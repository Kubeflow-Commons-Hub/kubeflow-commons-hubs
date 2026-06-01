import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const stages = [
  { label: "Prepare Data",    color: "#F57C00", n: "1" },
  { label: "Experiment",      color: "#7B1FA2", n: "2" },
  { label: "Train & Optimize",color: "#E64A19", n: "3" },
  { label: "Govern Models",   color: "#388E3C", n: "4" },
  { label: "Deploy & Serve",  color: "#0277BD", n: "5" },
  { label: "Pipelines",       color: "#1565C0", n: "🔀" },
];

export function PlatformBanner() {
  return (
    <section className="py-14 md:py-20 bg-bg-secondary border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border-strong bg-bg-primary p-8 md:p-10 flex flex-col items-center text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--kf-blue)] mb-3">
              New to Kubeflow?
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Understand the platform before you build on it
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
              Kubeflow is an open AI platform on Kubernetes — covering every
              step from raw data to production model serving. Explore the
              interactive overview to see exactly what it can do for your role.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <Link
                href="/architecture"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--kf-blue)] text-white text-sm font-medium hover:bg-[var(--kf-blue-dark)] transition-colors shadow-sm hover:shadow-md hover:shadow-[var(--kf-blue)]/20"
              >
                Explore Platform Overview
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/tour"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-strong text-text-primary text-sm font-medium hover:bg-bg-tertiary transition-colors"
              >
                <Play className="size-3.5" />
                Quick Tour
              </Link>
            </div>

            {/* Horizontal mini pipeline */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {stages.map((s, i) => (
                <div key={s.n} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg-secondary">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{ background: s.color }}
                    >
                      {s.n}
                    </div>
                    <span className="text-xs text-text-muted font-medium whitespace-nowrap">{s.label}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-3 h-px rounded-full bg-border-strong opacity-60" />
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
