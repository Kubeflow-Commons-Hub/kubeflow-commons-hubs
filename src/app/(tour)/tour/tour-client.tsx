"use client";

import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────

const TOTAL_SLIDES = 10;

const GUIDE_MESSAGES: Record<number, string> = {
  1: "Hey! 👋 I'm <strong>Kube</strong>, your tour guide. Most teams spend <em>months</em> assembling ML infrastructure before training a single model. Kubeflow gives you that infrastructure ready to go — on any Kubernetes cluster.",
  2: "Here's the full picture — 5 steps from raw data to a live model. Each step has a dedicated Kubeflow component. <strong>Kubeflow Pipelines</strong> sits underneath all of them, stitching every step into one automated workflow.",
  3: "⚡ <strong>Kubeflow Spark Operator</strong> is the official sub-project for data processing — runs distributed Spark jobs on Kubernetes. Feast is a popular open-source feature store you can run alongside Kubeflow, but it's not a built-in component.",
  4: "No more waiting on IT! 🧑‍🔬 Data scientists spin up <em>GPU-backed JupyterLab or VSCode environments in seconds</em>. Kubeflow Profiles give each team their own isolated namespace — everyone shares the cluster, nothing collides.",
  5: "🚀 <strong>Trainer v2</strong> (released mid-2025) is the big one — fine-tune LLMs like Llama or Qwen with built-in LoRA/QLoRA support, no training code required. Write normal Python or use a built-in runtime. Katib runs hyperparameter search in parallel.",
  6: "📋 Every model gets a <em>complete history</em>: which data, which code, who ran it. Great for debugging, sharing results with the community, or meeting compliance requirements.",
  7: "KServe creates an <strong>InferenceService</strong> on Kubernetes — your model gets a REST and gRPC endpoint, auto-scales to zero when idle, and supports canary rollouts so you can test a new version on a small slice of traffic before going all-in. 🌐",
  8: "Define your entire workflow once as code — then <strong>share it</strong>. 🔀 Pipelines is how the community shares and reuses complete ML workflows, not just models.",
  9: "That's the full picture! 🙏 Explore the architecture diagram, browse the docs, or come say hi in the community — we'd love to have you.",
};

// ── Shared components ──────────────────────────────────────────────────────

function SlideBadge({ children, color = "#FF6B35" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-block px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3"
      style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
    >
      {children}
    </span>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#FF6B35] via-[#7B68EE] to-[#4ECDC4] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function SlideHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-tight mb-2 sm:mb-3 text-text-primary">
      {children}
    </h2>
  );
}

function SlideBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed mb-3 sm:mb-5">{children}</p>
  );
}

function SlideIcon({ emoji, gradient, color }: { emoji: string; gradient: string; color: string }) {
  return (
    <div
      className="relative size-14 sm:size-20 lg:size-28 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-5 mx-auto flex-none"
      style={{
        background: gradient,
        color,
        boxShadow: `0 0 30px ${color}44`,
        animation: "tour-icon-pulse 3s ease-in-out infinite",
      }}
    >
      <span
        className="absolute inset-[-10px] rounded-[24px] opacity-25"
        style={{ border: `1.5px solid ${color}`, animation: "tour-orbit 3s linear infinite" }}
      />
      {emoji}
    </div>
  );
}

function FeatureCard({
  emoji, title, desc, accentColor, delay, isActive,
}: {
  emoji: string; title: string; desc: string;
  accentColor: string; delay: string; isActive: boolean;
}) {
  return (
    <div
      className="bg-bg-tertiary rounded-xl p-3 sm:p-4 lg:p-5 border-l-[3px] flex items-start gap-3 sm:gap-4 text-left border border-border"
      style={{
        borderLeftColor: accentColor,
        opacity: 0,
        animation: isActive ? `tour-feature-slide-in 0.45s ease ${delay} forwards` : "none",
      }}
    >
      <span className="text-xl sm:text-2xl flex-none mt-0.5">{emoji}</span>
      <div>
        <h4 className="font-semibold text-text-primary text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1">{title}</h4>
        <p className="text-text-muted text-[10px] sm:text-xs lg:text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ── Slide 0: Welcome ───────────────────────────────────────────────────────

function Slide0({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center px-4 max-w-xl lg:max-w-2xl mx-auto">
      <h1
        className="text-4xl sm:text-6xl lg:text-8xl font-extrabold mb-3 sm:mb-4"
        style={{ background: "linear-gradient(135deg,#FF6B35,#7B68EE,#4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        Kubeflow
      </h1>
      <p className="text-text-secondary text-base sm:text-xl lg:text-2xl mb-2 sm:mb-3">
        What Can It Do For You?
      </p>
      <p className="text-text-muted text-xs sm:text-sm lg:text-base mb-8 sm:mb-10 max-w-sm sm:max-w-md">
        The open-source MLOps platform built by the community.<br />
        From raw data to production in one place.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-md mb-4 sm:mb-6">
        <button
          onClick={onStart}
          className="flex-1 px-6 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg,#FF6B35,#FF8A65)", boxShadow: "0 4px 30px rgba(255,107,53,0.45)", animation: "tour-btn-glow 2s ease-in-out infinite" }}
        >
          Start Tour →
        </button>
        <Link
          href="/architecture"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 text-base sm:text-lg font-bold rounded-2xl border border-border text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all"
        >
          🗺️ Architecture
        </Link>
      </div>
      <p className="text-text-muted text-xs sm:text-sm">
        ← → arrow keys or swipe to navigate
      </p>
    </div>
  );
}

// ── Slide 1: Business Pain (Flip Cards) ───────────────────────────────────

const FLIP_CARDS = [
  {
    delay: "0.1s",
    problem: { stat: "6–12 mo",  icon: "⏱️", text: "Months building infra before training a single model" },
    solution: { stat: "ship faster", icon: "⚡", text: "Infrastructure ready in days — spend time on models, not tooling" },
  },
  {
    delay: "0.2s",
    problem: { stat: "not reproducible", icon: "🔁", text: "\"Works on my machine\" — experiments can't be shared or reproduced" },
    solution: { stat: "fully reproducible", icon: "🤝", text: "Every run tracked, shareable, and reproducible by anyone on the team" },
  },
  {
    delay: "0.3s",
    problem: { stat: "no history",  icon: "🔍", text: "No record of what data or code produced the model in production" },
    solution: { stat: "full lineage", icon: "📋", text: "Complete history of every model — data, code, config, and which pipeline version produced it" },
  },
  {
    delay: "0.4s",
    problem: { stat: "lock-in",   icon: "🔒", text: "Proprietary ML platforms that own your workflows and data" },
    solution: { stat: "0 lock-in", icon: "🌐", text: "100% open source CNCF project — runs on any Kubernetes: on-prem, AWS, GCP, Azure" },
  },
];

function Slide1({ isActive }: { isActive: boolean }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const allFlipped = flipped.size === FLIP_CARDS.length;

  useEffect(() => { if (!isActive) startTransition(() => setFlipped(new Set())); }, [isActive]);

  return (
    <div className="flex flex-col items-center text-center w-full max-w-xl lg:max-w-3xl mx-auto px-2">
      <SlideBadge>The Challenge</SlideBadge>
      <SlideHeading>AI at Scale is <GradientText>Hard</GradientText></SlideHeading>
      <SlideBody>
        Without a unified platform, teams waste months on{" "}
        <span className="text-[#FF8A65] font-medium">infrastructure</span> instead of models.
      </SlideBody>

      <div className="flex justify-between items-center w-full mb-3">
        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          ❌ <span className="hidden sm:inline">Without Kubeflow</span><span className="sm:hidden">Without</span>
        </span>
        <span className="text-text-muted text-xs hidden sm:block">tap a card to flip →</span>
        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          ✅ With Kubeflow
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full">
        {FLIP_CARDS.map((card, i) => {
          const isFlipped = flipped.has(i);
          return (
            <div
              key={i}
              className="h-[148px] sm:h-[165px] lg:h-[200px] cursor-pointer"
              style={{ perspective: "900px", opacity: 0, animation: isActive ? `tour-card-entrance 0.45s ease ${card.delay} forwards` : "none" }}
              onClick={() => !isFlipped && setFlipped((p) => new Set([...p, i]))}
            >
              <div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* Problem face */}
                <div
                  className="absolute inset-0 rounded-2xl p-3 sm:p-4 lg:p-5 flex flex-col text-left"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "rgba(255,69,58,0.07)", border: "1px solid rgba(255,69,58,0.25)" }}
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-red-400/70">The Pain</span>
                    <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500/12 text-red-400/70">{card.problem.stat}</span>
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2">{card.problem.icon}</div>
                  <p className="text-xs sm:text-sm lg:text-base font-medium text-text-secondary leading-snug">{card.problem.text}</p>
                  {!isFlipped && <span className="text-[10px] sm:text-xs text-text-muted mt-auto">tap to flip</span>}
                </div>
                {/* Solution face */}
                <div
                  className="absolute inset-0 rounded-2xl p-3 sm:p-4 lg:p-5 flex flex-col text-left"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "rgba(52,199,89,0.07)", border: "1px solid rgba(52,199,89,0.25)" }}
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-green-400/70">With Kubeflow</span>
                    <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">{card.solution.stat}</span>
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2">{card.solution.icon}</div>
                  <p className="text-xs sm:text-sm lg:text-base font-medium text-green-100/90 leading-snug">{card.solution.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allFlipped ? (
        <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-green-500/8 border border-green-500/20 w-full" style={{ animation: "tour-guide-slide-up 0.4s ease forwards" }}>
          <span className="text-lg sm:text-xl">🚀</span>
          <p className="text-xs sm:text-sm lg:text-base text-green-300 font-medium text-left">
            <strong className="text-text-primary">Kubeflow fixes all four.</strong> One platform — faster, collaborative, governed, and open source.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(new Set([0, 1, 2, 3]))}
          className="mt-3 sm:mt-4 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm lg:text-base text-white transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#FF6B35,#FF8A65)", boxShadow: "0 4px 16px rgba(255,107,53,0.35)" }}
        >
          ✨ Flip all — see how Kubeflow fixes this
        </button>
      )}
    </div>
  );
}

// ── Slide 2: 5 Phases Overview ─────────────────────────────────────────────

const USE_CASES = [
  { emoji: "⚙️", label: "Prepare Data",    sub: "ETL & feature engineering", color: "#F57C00", delay: "0s" },
  { emoji: "📓", label: "Experiment",       sub: "Explore & iterate",         color: "#9C27B0", delay: "1s" },
  { emoji: "🚀", label: "Train & Optimize", sub: "Scale & AutoML",            color: "#E64A19", delay: "2s" },
  { emoji: "📦", label: "Govern Models",    sub: "Versioning & compliance",   color: "#388E3C", delay: "3s" },
  { emoji: "🌐", label: "Deploy & Serve",   sub: "Inference at any scale",    color: "#0277BD", delay: "4s" },
];

const KF_COMPONENTS = [
  { emoji: "⚡", name: "Spark Operator",  desc: "Data processing jobs", color: "#F57C00", delay: "0s" },
  { emoji: "📓", name: "KF Notebooks",    desc: "Dev environments",     color: "#9C27B0", delay: "1s" },
  { emoji: "🎯", name: "Trainer + Katib", desc: "Distributed + AutoML", color: "#E64A19", delay: "2s" },
  { emoji: "📦", name: "Model Registry",  desc: "Lineage & versioning",  color: "#388E3C", delay: "3s" },
  { emoji: "🌐", name: "KServe",          desc: "Serverless inference",  color: "#0277BD", delay: "4s" },
];

function Slide2() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    if (syncing.current) return;
    syncing.current = true;
    target.scrollLeft = source.scrollLeft;
    syncing.current = false;
  };

  return (
    <div className="flex flex-col items-center text-center w-full max-w-2xl lg:max-w-4xl mx-auto px-2">
      <SlideBadge>The Platform</SlideBadge>
      <SlideHeading>One Platform, <GradientText>Five Phases</GradientText></SlideHeading>
      <SlideBody>From raw data to live production.</SlideBody>

      {/* Row 1: ML use cases */}
      <div className="w-full mb-2">
        <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3 text-center">
          What you want to do
        </p>
        {/* Horizontally scrollable on mobile, flex on sm+ */}
        <div
          ref={row1Ref}
          className="overflow-x-auto pb-3 sm:overflow-visible tour-scroll-row"
          onScroll={() => row1Ref.current && row2Ref.current && syncScroll(row1Ref.current, row2Ref.current)}
        >
          <div className="flex items-stretch gap-2 sm:grid sm:grid-cols-5 sm:gap-2 sm:w-full" style={{ minWidth: "min-content" }}>
            {USE_CASES.map((stage, i) => (
              <div key={stage.label} className="relative flex-none w-[clamp(80px,18vw,200px)] sm:w-auto">
                <div
                  className="bg-bg-tertiary border border-border rounded-2xl p-2 sm:p-3 lg:p-4 text-center h-full"
                  style={{ animation: `tour-stage-glow 6s ease-in-out ${stage.delay} infinite` }}
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl mb-1" style={{ filter: `drop-shadow(0 0 6px ${stage.color})` }}>
                    {stage.emoji}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm font-bold leading-tight" style={{ color: stage.color }}>
                    {stage.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] lg:text-xs text-text-muted mt-0.5 leading-tight">{stage.sub}</div>
                </div>
                {i < USE_CASES.length - 1 && (
                  <span
                    className="absolute right-[-9px] top-1/2 -translate-y-1/2 z-10 text-text-muted text-xs"
                    style={{ animation: "tour-connector-pulse 1.5s ease-in-out infinite" }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connecting lines — hidden on mobile (cards scroll, lines can't track) */}
      <div className="hidden sm:grid sm:grid-cols-5 sm:gap-2 w-full h-5 lg:h-6">
        {KF_COMPONENTS.map((c) => (
          <div key={c.name} className="flex justify-center">
            <div className="w-px h-full rounded-full" style={{ background: c.color, opacity: 0.35, animation: `tour-stage-glow 6s ease-in-out ${c.delay} infinite` }} />
          </div>
        ))}
      </div>
      {/* Mobile: simple divider instead */}
      <div className="sm:hidden w-full my-2 flex items-center gap-2">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-[9px] text-text-muted tracking-widest uppercase flex-none">maps to</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Row 2: Kubeflow components */}
      <div className="w-full">
        <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-3 text-center">
          Kubeflow component
        </p>
        <div
          ref={row2Ref}
          className="overflow-x-auto pb-3 sm:overflow-visible tour-scroll-row"
          onScroll={() => row2Ref.current && row1Ref.current && syncScroll(row2Ref.current, row1Ref.current)}
        >
          <div className="flex items-stretch gap-2 sm:grid sm:grid-cols-5 sm:gap-2 sm:w-full" style={{ minWidth: "min-content" }}>
            {KF_COMPONENTS.map((comp) => (
              <div
                key={comp.name}
                className="flex-none w-[clamp(80px,18vw,200px)] sm:w-auto bg-bg-secondary border border-border rounded-2xl px-2 py-2 sm:py-3 lg:px-3 lg:py-4 flex items-center justify-center text-center"
                style={{ animation: `tour-kf-glow 6s ease-in-out ${comp.delay} infinite` }}
              >
                <div>
                  <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-text-primary leading-tight">{comp.name}</div>
                  <div className="text-[9px] sm:text-[10px] lg:text-xs text-text-muted mt-0.5 leading-tight">{comp.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipelines orchestrator */}
      <div className="w-full mt-3 flex flex-col items-center">
        {/* Curly brace: fixed elbows + growing CSS arms + fixed center nub */}
        <div
          className="w-full relative"
          style={{ height: "26px", animation: "tour-connector-pulse 3s ease-in-out infinite" }}
        >
          {/* Left elbow */}
          <svg style={{ position: "absolute", left: 0, top: 0 }} width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M1,1 C1,11 9,13 15,13" stroke="rgba(66,165,245,0.38)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {/* Left arm */}
          <div style={{ position: "absolute", left: "15px", right: "calc(50% + 10px)", top: "13px", height: "1.5px", background: "rgba(66,165,245,0.38)" }} />
          {/* Center nub with arrowhead */}
          <svg style={{ position: "absolute", left: "calc(50% - 10px)", top: "13px" }} width="20" height="13" viewBox="0 0 20 13" fill="none">
            <path d="M0,0 C4,0 8,7 10,7 C12,7 16,0 20,0" stroke="rgba(66,165,245,0.38)" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="7,8 13,8 10,13" fill="rgba(66,165,245,0.38)" />
          </svg>
          {/* Right arm */}
          <div style={{ position: "absolute", left: "calc(50% + 10px)", right: "15px", top: "13px", height: "1.5px", background: "rgba(66,165,245,0.38)" }} />
          {/* Right elbow */}
          <svg style={{ position: "absolute", right: 0, top: 0 }} width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M1,13 C7,13 15,11 15,1" stroke="rgba(66,165,245,0.38)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div
          className="inline-flex items-center gap-2 lg:gap-3 px-5 lg:px-8 py-2 lg:py-3 rounded-xl mt-1"
          style={{ background: "linear-gradient(135deg,#1565C0,#1976D2)", boxShadow: "0 0 20px rgba(25,118,210,0.3)" }}
        >
          <span className="text-xl lg:text-2xl">🔀</span>
          <span className="text-sm lg:text-base font-bold text-white">PIPELINES</span>
          <span className="text-xs lg:text-sm text-white/70 hidden sm:block">Orchestrates the entire lifecycle</span>
        </div>
      </div>
    </div>
  );
}

// ── Slides 3–8: Phase template ─────────────────────────────────────────────

function PhaseSlide({
  isActive, icon, iconGradient, iconColor,
  badge, badgeColor, title, titleHighlight,
  body, bodyHighlight, features, extraContent,
}: {
  isActive: boolean;
  icon: string; iconGradient: string; iconColor: string;
  badge: string; badgeColor: string;
  title: string; titleHighlight: string;
  body: string; bodyHighlight?: string;
  features?: { emoji: string; title: string; desc: string; color: string }[];
  extraContent?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-xl lg:max-w-3xl mx-auto px-2">
      <SlideIcon emoji={icon} gradient={iconGradient} color={iconColor} />
      <SlideBadge color={badgeColor}>{badge}</SlideBadge>
      <SlideHeading>
        {title} <GradientText>{titleHighlight}</GradientText>
      </SlideHeading>
      <SlideBody>
        {bodyHighlight ? (
          <>
            {body.split(bodyHighlight)[0]}
            <span className="text-[#FF8A65] font-medium">{bodyHighlight}</span>
            {body.split(bodyHighlight)[1]}
          </>
        ) : body}
      </SlideBody>

      {features && (
        <div className={cn("w-full", features.length === 3 ? "grid grid-cols-1 lg:grid-cols-3 gap-3" : "flex flex-col gap-3")}>
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              emoji={f.emoji} title={f.title} desc={f.desc} accentColor={f.color}
              delay={`${0.15 + i * 0.15}s`} isActive={isActive}
            />
          ))}
        </div>
      )}

      {extraContent}
    </div>
  );
}

// ── Slide 5: Train — training widget ──────────────────────────────────────

const CODE_LINES: { blank?: true; content?: React.ReactNode }[] = [
  { content: <><span className="text-purple-400">from</span> kubeflow.trainer <span className="text-purple-400">import</span> TrainingClient</> },
  { blank: true },
  { content: <>client = TrainingClient()</> },
  { content: <>client.<span className="text-yellow-300">train</span>(</> },
  { content: <>&nbsp;&nbsp;model=<span className="text-green-400">&quot;meta-llama/Llama-3.2-1B&quot;</span>,</> },
  { content: <>&nbsp;&nbsp;dataset=<span className="text-green-400">&quot;tatsu-lab/alpaca&quot;</span>,</> },
  { content: <>&nbsp;&nbsp;num_nodes=<span className="text-orange-400">4</span></> },
  { content: <>)  <span className="text-text-muted"># That&apos;s it 🚀</span></> },
];

function TrainingExtra({ isActive }: { isActive: boolean }) {
  const [epoch, setEpoch] = useState(1);
  const [loss, setLoss] = useState(2.45);
  const itvRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive) {
      startTransition(() => { setEpoch(1); setLoss(2.45); });
      if (itvRef.current) clearInterval(itvRef.current);
      return;
    }
    let step = 0;
    const epochs = [1, 2, 3];
    const losses = [2.45, 1.23, 0.67];
    itvRef.current = setInterval(() => {
      step = (step + 1) % 3;
      setEpoch(epochs[step]);
      setLoss(losses[step]);
    }, 2000);
    return () => { if (itvRef.current) clearInterval(itvRef.current); };
  }, [isActive]);

  return (
    <div className="w-full bg-bg-tertiary rounded-2xl border border-border overflow-hidden mt-2">
      {/* GPU bars */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 border-b border-border">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] sm:text-xs text-text-muted mb-1 sm:mb-1.5">GPU {i}</div>
            <div className="h-1.5 sm:h-2 rounded-full bg-bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A65]" style={{ animation: `tour-gpu-fill 3s ease-in-out ${i * 0.2}s infinite alternate` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Code */}
      <div className="bg-[#0d1117] p-3 sm:p-4 font-mono text-[10px] sm:text-xs lg:text-sm text-left border-b border-border leading-relaxed overflow-x-auto">
        {CODE_LINES.map((line, i) =>
          line.blank ? <div key={i} className="h-2 sm:h-3" /> : <div key={i} className="text-white/80 whitespace-nowrap">{line.content}</div>
        )}
      </div>
      {/* Training sim */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-2">
          <span className="size-1.5 sm:size-2 rounded-full bg-green-400" style={{ animation: "tour-live-pulse 1.5s infinite" }} />
          Training in progress...
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-6 mb-2 text-xs sm:text-sm">
          <div><span className="text-text-muted">Epoch </span><span className="text-text-primary font-bold transition-all duration-500">{epoch}/3</span></div>
          <div><span className="text-text-muted">Loss </span><span className="text-[#FF8A65] font-bold transition-all duration-500">{loss.toFixed(2)}</span></div>
          <div><span className="text-text-muted">Speed </span><span className="text-text-primary font-bold">4.2 it/s</span></div>
        </div>
        <div className="h-1 sm:h-1.5 rounded-full bg-bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#7B68EE]" style={{ animation: isActive ? "tour-sim-progress 6s linear infinite" : "none" }} />
        </div>
      </div>
    </div>
  );
}

// ── Slide 7: Deploy — terminal ─────────────────────────────────────────────

function DeployTerminal({ isActive }: { isActive: boolean }) {
  const lines = [
    { prompt: "$ ", cmd: "kubectl apply -f inference-service.yaml" },
    { output: "✓ InferenceService \"llama-finetune-v2\" created" },
    { output: "✓ Auto-scaling: 0 → ∞ replicas on demand" },
    { output: "✓ Canary split: 10% traffic → new version" },
    { output: "🌐 Endpoint ready: https://llama-finetune-v2.models.example.com" },
  ];
  return (
    <div className="w-full bg-[#0d1117] rounded-2xl overflow-hidden border border-border mt-2 font-mono text-xs sm:text-sm lg:text-base text-left">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-bg-tertiary border-b border-border">
        <span className="size-2.5 sm:size-3 rounded-full bg-red-500" />
        <span className="size-2.5 sm:size-3 rounded-full bg-yellow-400" />
        <span className="size-2.5 sm:size-3 rounded-full bg-green-400" />
        <span className="text-text-muted text-[10px] sm:text-xs ml-1 sm:ml-2">Deploying model...</span>
      </div>
      <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-nowrap" style={{ opacity: 0, animation: isActive ? `tour-terminal-type 0.3s ease ${0.3 + i * 0.5}s forwards` : "none" }}>
            {"prompt" in line
              ? <><span className="text-green-400">{line.prompt}</span><span className="text-white">{line.cmd}</span></>
              : <span className="text-text-secondary">{line.output}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Slide 9: CTA ──────────────────────────────────────────────────────────

const STATS = [
  { value: "10×",  label: "Faster Development" },
  { value: "100%", label: "Audit Trail" },
  { value: "∞",    label: "Scale Without Code Changes" },
  { value: "0",    label: "Vendor Lock-in" },
];

function Slide9() {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-xl lg:max-w-3xl mx-auto px-2">
      <SlideIcon emoji="☸️" gradient="linear-gradient(135deg,#FF6B35,#7B68EE)" color="white" />
      <SlideHeading>{"You're"} Part of <GradientText>Something Bigger</GradientText></SlideHeading>
      <SlideBody>Kubeflow is built by a global open-source community — CNCF project, runs on any Kubernetes cluster. Everything you just saw is accessible through the <strong>Kubeflow Central Dashboard</strong>, one unified UI.</SlideBody>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full mb-5">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-bg-secondary rounded-2xl p-4 lg:p-6 border border-border text-center"
            style={{ animation: `tour-stat-pulse 3s ease-in-out ${i * 0.5}s infinite` }}
          >
            <div className="text-3xl lg:text-4xl font-extrabold text-[#FF6B35] mb-1">{stat.value}</div>
            <div className="text-xs lg:text-sm text-text-muted uppercase tracking-wider leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <Link
          href="/architecture"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#FF6B35,#FF8A65)", boxShadow: "0 4px 20px rgba(255,107,53,0.35)" }}
        >
          🗺️ Architecture
        </Link>
        <Link
          href="/members"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#7B68EE,#9C27B0)", boxShadow: "0 4px 20px rgba(123,104,238,0.35)" }}
        >
          🤝 Community
        </Link>
        <a
          href="https://www.kubeflow.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-text-secondary border border-border hover:bg-bg-tertiary transition-colors"
        >
          📖 Documentation
        </a>
      </div>

      <p className="text-[#FF8A65]/60 text-xs mt-5 tracking-wide uppercase">
        CNCF Incubating · Open Source · Community-driven
      </p>
    </div>
  );
}

// ── Guide Dialog ──────────────────────────────────────────────────────────

function GuideDialog({
  slide, dismissedSlide, onDismiss, onRestore,
}: {
  slide: number; dismissedSlide: number;
  onDismiss: () => void; onRestore: () => void;
}) {
  const message = GUIDE_MESSAGES[slide];
  const isDismissed = dismissedSlide === slide;
  if (!message) return null;

  return isDismissed ? (
    <button
      onClick={onRestore}
      className="absolute bottom-24 left-4 lg:left-6 z-50 size-10 lg:size-12 rounded-full flex items-center justify-center shadow-lg text-lg transition-transform hover:scale-110"
      style={{ background: "linear-gradient(135deg,#FF6B35,#7B68EE)" }}
      title="Show guide tip"
    >
      🤖
    </button>
  ) : (
    <div
      className="absolute bottom-24 left-4 right-4 sm:right-auto sm:max-w-sm lg:max-w-md z-50 bg-bg-secondary border border-border rounded-2xl p-4 lg:p-5 flex items-start gap-3 lg:gap-4 shadow-xl"
      style={{ animation: "tour-guide-slide-up 0.4s ease 0.5s both" }}
    >
      <div className="size-9 lg:size-11 flex-none rounded-full flex items-center justify-center text-lg lg:text-xl" style={{ background: "linear-gradient(135deg,#FF6B35,#7B68EE)" }}>
        🤖
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-[#FF8A65] mb-1 uppercase tracking-widest">Kube</div>
        <div className="text-xs lg:text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
      <button onClick={onDismiss} className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none flex-none">×</button>
    </div>
  );
}

// ── Nav bar ────────────────────────────────────────────────────────────────

function TourNav({ current, total, onPrev, onNext }: {
  current: number; total: number;
  onPrev: () => void; onNext: () => void;
}) {
  const isLast = current === total - 1;
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4 lg:px-8 pt-10 z-50"
      style={{
        background: "linear-gradient(to top, var(--bg-primary) 55%, transparent)",
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
      }}
    >
      <button
        onClick={onPrev}
        disabled={current <= 1}
        className="flex items-center justify-center size-11 lg:size-13 rounded-xl border border-border bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5 flex-1">
        {Array.from({ length: total - 1 }, (_, i) => i + 1).map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current   ? "w-6 h-2.5 bg-[#FF6B35]"
              : i < current   ? "size-2.5 bg-[#FF6B35]/40"
              : "size-2.5 bg-border"
            )}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-3.5 rounded-xl font-semibold text-sm lg:text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg,#FF6B35,#FF8A65)", boxShadow: "0 4px 20px rgba(255,107,53,0.35)" }}
      >
        {isLast ? <><RotateCcw className="size-4" /> Restart</> : <>Next <ChevronRight className="size-5" /></>}
      </button>
    </div>
  );
}

// ── Main TourClient ────────────────────────────────────────────────────────

export function TourClient() {
  const [current, setCurrent] = useState(0);
  const [dismissedSlide, setDismissedSlide] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => setCurrent((c) => (c < TOTAL_SLIDES - 1 ? c + 1 : 0)), []);
  const goPrev = useCallback(() => setCurrent((c) => (c > 1 ? c - 1 : c)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Track real fullscreen state
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goPrev();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleFullscreen]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 45) { if (dx < 0) goNext(); else goPrev(); }
    touchStartX.current = null;
  };

  const progress = (current / (TOTAL_SLIDES - 1)) * 100;

  const slides: React.ReactNode[] = [
    <Slide0 key={0} onStart={goNext} />,
    <Slide1 key={1} isActive={current === 1} />,
    <Slide2 key={2} />,
    <PhaseSlide key={3} isActive={current === 3}
      icon="⚙️" iconGradient="linear-gradient(135deg,#E65100,#F57C00)" iconColor="#FFE0B2"
      badge="Phase 1" badgeColor="#F57C00" title="Prepare Your" titleHighlight="Data"
      body="Run scalable data processing on Kubernetes and build a consistent feature pipeline — from raw sources to training-ready datasets."
      bodyHighlight="consistent feature pipeline"
      features={[
        { emoji: "⚡", title: "Kubeflow Spark Operator", desc: "An official Kubeflow sub-project. Runs distributed Apache Spark jobs on Kubernetes — load, clean, and transform data at any scale.", color: "#FF9800" },
        { emoji: "🏪", title: "Feast (Ecosystem Integration)", desc: "Not a Kubeflow component — but a popular open-source feature store that works alongside Kubeflow Pipelines to keep training and serving features in sync.", color: "#4ECDC4" },
        { emoji: "🔒", title: "Versioned & Traceable", desc: "Every dataset snapshot is versioned with full lineage — always know exactly which data trained which model.", color: "#81C784" },
      ]}
    />,
    <PhaseSlide key={4} isActive={current === 4}
      icon="📓" iconGradient="linear-gradient(135deg,#7B1FA2,#9C27B0)" iconColor="#E1BEE7"
      badge="Phase 2" badgeColor="#9C27B0" title="Experiment" titleHighlight="Without Limits"
      body="Data scientists get on-demand GPU workspaces in seconds — no IT tickets, no setup delays."
      bodyHighlight="on-demand GPU workspaces"
      features={[
        { emoji: "💻", title: "JupyterLab or VSCode — Your Choice", desc: "Spin up a notebook server with full GPU access instantly. Kubeflow Notebooks v2 supports JupyterLab, VSCode, and custom images.", color: "#9C27B0" },
        { emoji: "🔄", title: "Reproducible Environments", desc: "Environments are versioned alongside your code — any teammate can reproduce your exact GPU setup with one click.", color: "#9C27B0" },
        { emoji: "🏢", title: "Multi-Team, One Cluster", desc: "Kubeflow Profiles give each team their own isolated namespace on a shared cluster — no infrastructure per team.", color: "#9C27B0" },
      ]}
    />,
    <PhaseSlide key={5} isActive={current === 5}
      icon="🚀" iconGradient="linear-gradient(135deg,#E64A19,#FF7043)" iconColor="#FFAB91"
      badge="Phase 3" badgeColor="#E64A19" title="Train &" titleHighlight="Optimize"
      body="Fine-tune LLMs or train custom models — 1 GPU to thousands, same code. LoRA, QLoRA, and AutoML built in."
      bodyHighlight="Fine-tune LLMs"
      extraContent={<TrainingExtra isActive={current === 5} />}
    />,
    <PhaseSlide key={6} isActive={current === 6}
      icon="📦" iconGradient="linear-gradient(135deg,#388E3C,#66BB6A)" iconColor="#C8E6C9"
      badge="Phase 4" badgeColor="#388E3C" title="Track Every" titleHighlight="Model"
      body="Know exactly what shipped, who trained it, and on what data — full history built in for research and production alike."
      bodyHighlight="full history"
      features={[
        { emoji: "📋", title: "Complete Version History", desc: "Every model version stored with its code, data, and config — reproduce any result at any time.", color: "#4CAF50" },
        { emoji: "🔍", title: "Audit Trail & Lineage", desc: "Trace exactly which data and code produced a model — essential for research reproducibility and compliance.", color: "#4CAF50" },
        { emoji: "🤝", title: "Discover & Reuse", desc: "Teams can browse registered models, compare versions, and promote a model from experiment to production — all from the Kubeflow Dashboard.", color: "#4CAF50" },
      ]}
    />,
    <PhaseSlide key={7} isActive={current === 7}
      icon="🌐" iconGradient="linear-gradient(135deg,#F57C00,#FFA726)" iconColor="#FFE0B2"
      badge="Phase 5" badgeColor="#F57C00" title="Deploy to" titleHighlight="Production"
      body="Registry to live endpoint in minutes — auto-scales with demand, zero-downtime rollouts."
      bodyHighlight="minutes"
      extraContent={<DeployTerminal isActive={current === 7} />}
    />,
    <PhaseSlide key={8} isActive={current === 8}
      icon="🔀" iconGradient="linear-gradient(135deg,#1976D2,#42A5F5)" iconColor="#BBDEFB"
      badge="Orchestration" badgeColor="#1976D2" title="Automate" titleHighlight="Everything"
      body="Kubeflow Pipelines ties all five phases together into a single, repeatable workflow — defined once as Python code."
      bodyHighlight="single, repeatable workflow"
      features={[
        { emoji: "🔁", title: "End-to-End Automation", desc: "Data prep → training → evaluation → registry → deployment — all connected as one pipeline, triggered automatically.", color: "#42A5F5" },
        { emoji: "⚡", title: "Step Caching", desc: "Steps that haven't changed since the last run are skipped automatically — saves compute and speeds up iteration.", color: "#42A5F5" },
        { emoji: "📜", title: "Full Run History", desc: "Every execution logged with inputs, outputs, parameters, and timing — complete lineage for every pipeline run.", color: "#42A5F5" },
      ]}
    />,
    <Slide9 key={9} />,
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 15% 50%, rgba(123,104,238,0.06) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(255,107,53,0.05) 0%, transparent 55%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
      />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-border z-50">
        <div
          className="h-full rounded-r-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg,#FF6B35,#7B68EE,#4ECDC4)" }}
        />
      </div>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-secondary/80 hover:bg-bg-tertiary border border-border text-text-muted hover:text-text-primary transition-all text-xs font-medium backdrop-blur-sm"
        title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
          </svg>
        )}
        <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
        <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-bg-primary/60 text-text-muted font-mono">F</kbd>
      </button>

      {/* Slides */}
      {slides.map((slide, i) => (
        <div key={i} className={cn("tour-slide", i === current && "active", i < current && "prev")}>
          {slide}
        </div>
      ))}

      {current > 0 && <TourNav current={current} total={TOTAL_SLIDES} onPrev={goPrev} onNext={goNext} />}

      {current > 0 && (
        <GuideDialog
          slide={current}
          dismissedSlide={dismissedSlide}
          onDismiss={() => setDismissedSlide(current)}
          onRestore={() => setDismissedSlide(-1)}
        />
      )}
    </div>
  );
}
