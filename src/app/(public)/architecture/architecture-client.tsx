"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Persona = "leader" | "scientist" | "mlops" | "admin";

const PERSONA_STAGES: Record<Persona, string[]> = {
  leader: ["stage-training", "stage-registry", "stage-kserve", "stage-pipelines"],
  scientist: ["stage-data", "stage-notebooks", "stage-training"],
  mlops: [
    "stage-data",
    "stage-training",
    "stage-registry",
    "stage-kserve",
    "stage-pipelines",
  ],
  admin: ["stage-data", "stage-registry", "stage-kserve", "stage-pipelines"],
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function Panel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-secondary/80 backdrop-blur-sm p-5 relative overflow-hidden",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function PanelTitle({
  children,
  color = "#FF6B35",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 text-sm font-bold mb-4 relative z-10"
      style={{ color }}
    >
      <div
        className="w-1 h-5 rounded flex-shrink-0"
        style={{ background: `linear-gradient(180deg, ${color}, ${color}88)` }}
      />
      {children}
    </div>
  );
}

function CapBlock({ items }: { items: string[] }) {
  return (
    <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-80 group-hover:opacity-100 transition-all duration-300 ease-in-out mt-0 group-hover:mt-3">
      <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
          Key Capabilities
        </div>
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-[12px] text-text-secondary mb-1.5 last:mb-0 leading-snug"
          >
            <span className="text-[#4ECDC4] mt-px flex-shrink-0 text-[11px]">
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonaTag({
  role,
}: {
  role: "leader" | "scientist" | "mlops" | "admin";
}) {
  const cfg = {
    leader: {
      label: "Business Leader",
      bg: "rgba(233,30,99,0.2)",
      color: "#F06292",
    },
    scientist: {
      label: "Data Scientist",
      bg: "rgba(76,175,80,0.2)",
      color: "#81C784",
    },
    mlops: {
      label: "MLOps",
      bg: "rgba(33,150,243,0.2)",
      color: "#64B5F6",
    },
    admin: {
      label: "Platform Admin",
      bg: "rgba(255,152,0,0.2)",
      color: "#FFB74D",
    },
  }[role];
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function PoweredBy({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-text-muted bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.08]">
      Powered by:{" "}
      <strong className="text-text-secondary font-semibold">{text}</strong>
    </span>
  );
}

function ArrowConnector() {
  const dots = [
    { color: "#FF6B35", delay: "0s" },
    { color: "#7B68EE", delay: "0.5s" },
    { color: "#4ECDC4", delay: "1s" },
  ];
  return (
    <div className="relative h-10 flex items-center justify-center my-px">
      <div
        className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full rounded-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,107,53,0.8), rgba(123,104,238,0.8) 50%, rgba(78,205,196,0.8))",
        }}
      />
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: 10,
            height: 10,
            background: dot.color,
            borderRadius: "50%",
            boxShadow: `0 0 10px ${dot.color}, 0 0 20px ${dot.color}`,
            animation: `flow-down 1.5s ease-in-out ${dot.delay} infinite`,
            left: "50%",
          }}
        />
      ))}
      <div
        className="absolute bottom-0 left-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "11px solid #4ECDC4",
          filter: "drop-shadow(0 0 5px #4ECDC4)",
          animation: "arrow-pulse 1s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function StageNumber({
  n,
  gradient,
  ping,
  delay = "0s",
}: {
  n: string;
  gradient: string;
  ping: string;
  delay?: string;
}) {
  return (
    <div className="relative w-9 h-9 flex-shrink-0 mt-0.5">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-base relative z-10"
        style={{ background: gradient }}
      >
        {n}
      </div>
      <div
        className="absolute inset-0 rounded-full border-2 opacity-0"
        style={{
          borderColor: ping,
          animation: `arch-number-ping 2.5s ease-in-out ${delay} infinite`,
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ArchitectureClient() {
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [frameworksOpen, setFrameworksOpen] = useState(false);

  const isActive = (id: string) =>
    !activePersona || PERSONA_STAGES[activePersona].includes(id);

  const stageClass = (id: string) =>
    cn(
      "group relative flex items-start gap-4 p-4 rounded-xl border-2 mb-2 bg-bg-tertiary/50 transition-all duration-300 hover:translate-x-1",
      !isActive(id) && "opacity-20 grayscale pointer-events-none",
    );

  const personas = [
    {
      id: "leader" as Persona,
      label: "Business Leader",
      desc: "ROI, governance & time-to-market",
      color: "#F06292",
      gradient: "linear-gradient(135deg, #E91E63, #F06292)",
      emoji: "💼",
    },
    {
      id: "scientist" as Persona,
      label: "Data Scientist",
      desc: "Experiment, build & iterate fast",
      color: "#81C784",
      gradient: "linear-gradient(135deg, #4CAF50, #81C784)",
      emoji: "🧑‍🔬",
    },
    {
      id: "mlops" as Persona,
      label: "MLOps Engineer",
      desc: "Automate, scale & operationalise",
      color: "#64B5F6",
      gradient: "linear-gradient(135deg, #2196F3, #64B5F6)",
      emoji: "⚙️",
    },
    {
      id: "admin" as Persona,
      label: "Platform Admin",
      desc: "Security, compliance & multi-tenancy",
      color: "#FFB74D",
      gradient: "linear-gradient(135deg, #FF9800, #FFB74D)",
      emoji: "🔧",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 pb-16">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span
            style={{
              background:
                "linear-gradient(135deg, #FF6B35 0%, #7B68EE 50%, #4ECDC4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            What Can Kubeflow Do For You?
          </span>
        </h1>
        <p className="text-text-secondary">
          Open AI Platform on Kubernetes · From Raw Data to Production
        </p>
        <span
          className="inline-block mt-3 text-xs font-semibold px-4 py-1 rounded-full text-white"
          style={{ background: "linear-gradient(135deg, #7B68EE, #9B59B6)" }}
        >
          SELECT YOUR ROLE ↓
        </span>
      </div>

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr_290px] gap-5">
        {/* ── LEFT ── */}
        <div className="flex flex-col gap-5">
          {/* Persona selector */}
          <Panel>
            <PanelTitle>Who are you?</PanelTitle>
            <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
              Click your role to highlight what Kubeflow offers you
              specifically.
            </p>
            {personas.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setActivePersona((prev) => (prev === p.id ? null : p.id))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActivePersona((prev) => (prev === p.id ? null : p.id));
                  }
                }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2 last:mb-0 transition-all duration-300 hover:translate-x-1 bg-bg-tertiary/60",
                  activePersona === p.id && "translate-x-1",
                )}
                style={{
                  borderColor:
                    activePersona === p.id ? p.color : "transparent",
                  background:
                    activePersona === p.id ? `${p.color}18` : undefined,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-shadow duration-300"
                  style={{
                    background: p.gradient,
                    boxShadow:
                      activePersona === p.id
                        ? `0 0 14px ${p.color}`
                        : undefined,
                  }}
                >
                  {p.emoji}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {p.label}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5 leading-snug">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
            {activePersona && (
              <button
                onClick={() => setActivePersona(null)}
                className="w-full text-[11px] text-text-muted mt-2 py-1.5 rounded-lg transition-colors hover:text-[#FF6B35]"
              >
                ✕ Clear filter
              </button>
            )}
          </Panel>

          {/* AI Lifecycle */}
          <Panel>
            <PanelTitle>AI Lifecycle</PanelTitle>
            <div className="flex flex-col gap-1.5">
              {[
                { num: "1", label: "Prepare Data", color: "#F57C00" },
                { num: "2", label: "Experiment", color: "#7B1FA2" },
                { num: "3", label: "Train & Optimize", color: "#E64A19" },
                { num: "4", label: "Govern Models", color: "#388E3C" },
                { num: "5", label: "Deploy & Serve", color: "#0277BD" },
              ].map((phase, i) => (
                <div
                  key={phase.num}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] text-text-secondary border-l-[3px] hover:bg-white/[0.04] hover:text-text-primary transition-all"
                  style={{
                    borderLeftColor: phase.color,
                    animation: `arch-fade-up 0.4s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: phase.color }}
                  >
                    {phase.num}
                  </div>
                  <span>{phase.label}</span>
                </div>
              ))}
              <div
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] mt-1"
                style={{
                  background: "rgba(25,118,210,0.1)",
                  borderLeft: "3px solid #1976D2",
                }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] flex-shrink-0"
                  style={{ background: "#1976D2" }}
                >
                  🔀
                </div>
                <span className="text-blue-300/80">
                  Pipelines orchestrate all phases
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── CENTER ── */}
        <div>
          <Panel>
            <PanelTitle>Platform Capabilities</PanelTitle>
            <div className="flex flex-col">
              {/* Stage 1 — Prepare Data */}
              <div
                id="stage-data"
                className={stageClass("stage-data")}
                style={{ borderColor: "#F57C00" }}
              >
                <StageNumber
                  n="1"
                  gradient="linear-gradient(135deg, #E65100, #F57C00)"
                  ping="#F57C00"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-1.5">
                    ⚙️ PREPARE YOUR DATA
                  </div>
                  <div className="text-[12px] text-text-secondary leading-relaxed">
                    Transform raw data into AI-ready features at any scale and
                    build a shared feature store every team can reuse — with
                    zero training-serving skew.
                  </div>
                  {/* Spark/Feast badges — revealed on hover */}
                  <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-300 flex flex-wrap gap-2 group-hover:mt-2.5">
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-white border"
                      style={{
                        background: "rgba(229,121,32,0.22)",
                        borderColor: "rgba(229,121,32,0.4)",
                      }}
                    >
                      ⚡ Apache Spark
                    </span>
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-white border"
                      style={{
                        background: "rgba(78,205,196,0.18)",
                        borderColor: "rgba(78,205,196,0.4)",
                      }}
                    >
                      🏪 Feast Feature Store
                    </span>
                  </div>
                  <CapBlock
                    items={[
                      "Process petabytes of raw data with distributed Spark jobs",
                      "Build a centralised feature store shared across every AI project",
                      "Guarantee identical features between training and live serving",
                      "Versioned, governed datasets with full lineage",
                    ]}
                  />
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <PoweredBy text="Apache Spark · Feast" />
                    <PersonaTag role="scientist" />
                    <PersonaTag role="mlops" />
                    <PersonaTag role="admin" />
                  </div>
                </div>
              </div>

              <ArrowConnector />

              {/* Stage 2 — Experiment */}
              <div
                id="stage-notebooks"
                className={stageClass("stage-notebooks")}
                style={{ borderColor: "#7B1FA2" }}
              >
                <StageNumber
                  n="2"
                  gradient="linear-gradient(135deg, #7B1FA2, #9C27B0)"
                  ping="#9C27B0"
                  delay="0.3s"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-1.5">
                    📓 EXPERIMENT WITHOUT LIMITS
                  </div>
                  <div className="text-[12px] text-text-secondary leading-relaxed">
                    Data scientists get on-demand, GPU-backed workspaces in
                    seconds — no IT tickets, no environment setup, no waiting.
                  </div>
                  <CapBlock
                    items={[
                      "JupyterLab, VSCode, or RStudio — your IDE, on the cluster",
                      "Instant access to GPUs, storage, and shared data",
                      "Reproducible environments versioned alongside code",
                      "Collaborate and share notebooks across the team",
                    ]}
                  />
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <PoweredBy text="Kubeflow Notebooks" />
                    <PersonaTag role="scientist" />
                  </div>
                </div>
              </div>

              <ArrowConnector />

              {/* Stage 3 — Train */}
              <div
                id="stage-training"
                className={stageClass("stage-training")}
                style={{
                  borderColor: "#E64A19",
                  background:
                    "linear-gradient(135deg, rgba(230,74,25,0.12), rgba(255,87,34,0.06))",
                  animation: isActive("stage-training")
                    ? "training-glow 3s ease-in-out infinite"
                    : undefined,
                }}
              >
                <StageNumber
                  n="3"
                  gradient="linear-gradient(135deg, #E64A19, #FF5722)"
                  ping="#FF5722"
                  delay="0.6s"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-1.5">
                    🚀 TRAIN & OPTIMIZE YOUR AI MODELS
                  </div>
                  <div className="text-[12px] text-text-secondary leading-relaxed">
                    Fine-tune any LLM or ML model on your proprietary data and
                    let AutoML find the best configuration — scaling from 1 GPU
                    to thousands without touching infrastructure.
                  </div>
                  <CapBlock
                    items={[
                      "Fine-tune LLMs on proprietary data in a single API call",
                      "Scale from 1 GPU to 1,000s — no code changes needed",
                      "AutoML (Katib) automatically finds optimal hyperparameters",
                      "Built-in support for PyTorch, TensorFlow, JAX, DeepSpeed & more",
                      "Fair GPU sharing across teams with Kueue queuing",
                    ]}
                  />
                  {/* Frameworks toggle */}
                  <button
                    onClick={() => setFrameworksOpen((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 mt-2.5 text-[11px] text-text-muted px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.05] transition-all duration-200",
                      "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                      frameworksOpen &&
                        "!opacity-100 !pointer-events-auto border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.1)] text-white",
                      "hover:text-white hover:bg-[rgba(255,107,53,0.15)] hover:border-[rgba(255,107,53,0.3)]",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[9px] transition-transform duration-200",
                        frameworksOpen && "rotate-90",
                      )}
                    >
                      ▶
                    </span>
                    Supported Frameworks
                    <span className="bg-white/10 px-1.5 py-px rounded-md text-[9px]">
                      8
                    </span>
                  </button>
                  {frameworksOpen && (
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {[
                        { label: "PyTorch", icon: "🔥", color: "#EE4C2C" },
                        { label: "JAX", icon: "🧮", color: "#4CAF50" },
                        {
                          label: "TensorFlow",
                          icon: "📊",
                          color: "#FF6F00",
                        },
                        { label: "MPI", icon: "🖧", color: "#3F51B5" },
                        { label: "DeepSpeed", icon: "⚡", color: "#1976D2" },
                        { label: "XGBoost", icon: "🌲", color: "#43A047" },
                        { label: "MLX", icon: "🍎", color: "#9E9E9E" },
                        {
                          label: "HuggingFace",
                          icon: "🤗",
                          color: "#FF9D00",
                        },
                      ].map((fw) => (
                        <div
                          key={fw.label}
                          className="flex flex-col items-center p-2 rounded-lg border border-white/10 text-[10px] font-semibold text-white cursor-pointer transition-all hover:-translate-y-0.5 bg-bg-primary/80"
                        >
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center text-sm mb-1"
                            style={{ background: fw.color }}
                          >
                            {fw.icon}
                          </div>
                          {fw.label}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <PoweredBy text="Kubeflow Trainer v2 · Katib" />
                    <PersonaTag role="scientist" />
                    <PersonaTag role="mlops" />
                    <PersonaTag role="leader" />
                  </div>
                </div>
              </div>

              <ArrowConnector />

              {/* Stage 4 — Registry */}
              <div
                id="stage-registry"
                className={stageClass("stage-registry")}
                style={{ borderColor: "#388E3C" }}
              >
                <StageNumber
                  n="4"
                  gradient="linear-gradient(135deg, #388E3C, #4CAF50)"
                  ping="#4CAF50"
                  delay="0.9s"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-1.5">
                    📦 GOVERN EVERY MODEL
                  </div>
                  <div className="text-[12px] text-text-secondary leading-relaxed">
                    Know exactly what is in production, why it was deployed, and
                    who approved it — full audit trail, version history, and
                    lineage for every model.
                  </div>
                  <CapBlock
                    items={[
                      "Version every model with full metadata, tags, and lineage",
                      "Trace exactly which data and code produced each model",
                      "Approval workflows and compliance audit trail built in",
                      "Reproduce any past result with a single command",
                    ]}
                  />
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <PoweredBy text="Model Registry" />
                    <PersonaTag role="leader" />
                    <PersonaTag role="mlops" />
                    <PersonaTag role="admin" />
                  </div>
                </div>
              </div>

              <ArrowConnector />

              {/* Stage 5 — Serve */}
              <div
                id="stage-kserve"
                className={stageClass("stage-kserve")}
                style={{ borderColor: "#0277BD" }}
              >
                <StageNumber
                  n="5"
                  gradient="linear-gradient(135deg, #01579B, #0288D1)"
                  ping="#0288D1"
                  delay="1.2s"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-1.5">
                    🌐 DEPLOY TO PRODUCTION, INSTANTLY
                  </div>
                  <div className="text-[12px] text-text-secondary leading-relaxed">
                    Go from model registry to a live, production-grade endpoint
                    in minutes — auto-scaling with demand, with zero-downtime
                    rollouts.
                  </div>
                  <CapBlock
                    items={[
                      "Registry-to-endpoint deployment in under 5 minutes",
                      "Auto-scales from zero to millions of requests automatically",
                      "A/B testing and canary rollouts with instant rollback",
                      "Serverless — pay only for inference you actually use",
                    ]}
                  />
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <PoweredBy text="KServe" />
                    <PersonaTag role="leader" />
                    <PersonaTag role="mlops" />
                    <PersonaTag role="admin" />
                  </div>
                </div>
              </div>

              {/* Pipelines bar */}
              <div
                id="stage-pipelines"
                className={cn(
                  "group mt-2 flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.003]",
                  !isActive("stage-pipelines") &&
                    "opacity-20 grayscale pointer-events-none",
                )}
                style={{
                  borderColor: "#1976D2",
                  background:
                    "linear-gradient(135deg, rgba(25,118,210,0.14), rgba(33,150,243,0.07))",
                  animation: isActive("stage-pipelines")
                    ? "pipelines-pulse 3s ease-in-out infinite"
                    : undefined,
                }}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">🔀</div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-bold flex items-center gap-2 flex-wrap mb-1"
                    style={{ color: "#64B5F6" }}
                  >
                    AUTOMATE THE ENTIRE AI LIFECYCLE
                    <span
                      className="text-[9px] px-2 py-px rounded-full font-semibold"
                      style={{
                        background: "rgba(25,118,210,0.35)",
                        color: "#90CAF9",
                      }}
                    >
                      ORCHESTRATOR
                    </span>
                  </div>
                  <div className="text-[12px] text-text-secondary leading-relaxed">
                    Define the full pipeline once as code — automatic retries,
                    caching, dependency resolution, and a complete run history
                    for every execution.
                  </div>
                  <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-72 group-hover:opacity-100 transition-all duration-300 ease-in-out mt-0 group-hover:mt-3">
                    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">
                        Key Capabilities
                      </div>
                      {[
                        "Drag-and-drop DAG builder or Python DSL — your choice",
                        "Automatic step caching cuts re-run costs by up to 80%",
                        "Full audit log of every pipeline run, version, and output",
                        "Integrates with any CI/CD system (GitHub Actions, Tekton, etc.)",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-[12px] text-text-secondary mb-1.5 last:mb-0 leading-snug"
                        >
                          <span className="text-[#4ECDC4] mt-px flex-shrink-0 text-[11px]">
                            ✓
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <PoweredBy text="Kubeflow Pipelines" />
                    <PersonaTag role="leader" />
                    <PersonaTag role="mlops" />
                    <PersonaTag role="admin" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-center flex-shrink-0 mt-2">
                  {[0, 0.3, 0.6].map((delay, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#42A5F5",
                        animation: `arch-dot 1.5s ease-in-out ${delay}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex flex-col gap-5">
          {/* K8s Infrastructure */}
          <Panel
            style={{
              background:
                "linear-gradient(135deg, rgba(50,108,229,0.15), rgba(26,77,181,0.08))",
              borderColor: "rgba(50,108,229,0.4)",
            }}
          >
            <PanelTitle color="#64B5F6">☸️ Kubernetes Infrastructure</PanelTitle>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: "📋", label: "JobSet", desc: "Job Orchestration" },
                { icon: "📊", label: "Kueue", desc: "Resource Queuing" },
                { icon: "🎮", label: "GPUs", desc: "NVIDIA · AMD", gpu: true },
                { icon: "💾", label: "Storage", desc: "PVC · NFS · S3" },
                { icon: "🌐", label: "Services", desc: "Headless · LB" },
                { icon: "🌋", label: "Volcano", desc: "Gang Scheduling" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative flex flex-col items-center p-3 rounded-lg text-center transition-all hover:scale-105 bg-bg-tertiary/80 border border-border"
                >
                  <div
                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#4ECDC4]"
                    style={{ animation: "arch-sync 2s ease-in-out infinite" }}
                  />
                  <div className="w-9 h-9 rounded-lg bg-[#326CE5] flex items-center justify-center text-lg mb-1.5">
                    {item.icon}
                  </div>
                  <div className="text-[12px] font-semibold text-text-primary">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    {item.desc}
                  </div>
                  {item.gpu && (
                    <div className="flex gap-0.5 mt-1.5">
                      {[8, 12, 16, 10, 14].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-sm"
                          style={{
                            height: h,
                            background:
                              "linear-gradient(180deg, #76FF03, #43A047)",
                            animation: `gpu-bar 0.5s ease-in-out ${i * 0.1}s infinite alternate`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          {/* Integrations */}
          <Panel>
            <PanelTitle color="#CE93D8">🔗 Ecosystem Integrations</PanelTitle>
            <div className="flex flex-col gap-2.5">
              {[
                {
                  icon: "🤗",
                  label: "HuggingFace",
                  desc: "Models · Datasets · Tokenizers",
                  color: "#FFD21E",
                },
                {
                  icon: "📈",
                  label: "MLflow",
                  desc: "Experiment Tracking · Artifacts",
                  color: "#0194E2",
                },
                {
                  icon: "☁️",
                  label: "S3 / MinIO",
                  desc: "Object Storage · Checkpoints",
                  color: "#FF9900",
                },
                {
                  icon: "📊",
                  label: "Prometheus",
                  desc: "Metrics · Monitoring",
                  color: "#E6522C",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative flex items-center gap-3 p-3 rounded-lg border-l-4 bg-bg-tertiary/60 transition-all hover:translate-x-1 overflow-hidden"
                  style={{ borderLeftColor: item.color }}
                >
                  <span
                    className="absolute right-3 text-sm"
                    style={{
                      color: "#4ECDC4",
                      animation: "arch-sync 1.5s ease-in-out infinite",
                    }}
                  >
                    ↔
                  </span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 bg-bg-secondary border border-border">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Business Outcomes */}
          <Panel>
            <PanelTitle color="#81C784">📈 Business Outcomes</PanelTitle>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { metric: "10×", label: "Faster model development cycle" },
                { metric: "100%", label: "Audit trail & compliance" },
                { metric: "∞", label: "Scale without code changes" },
                { metric: "0", label: "Vendor lock-in — CNCF open source" },
              ].map((item) => (
                <div
                  key={item.metric}
                  className="p-3 rounded-xl bg-bg-tertiary/70 border border-border text-center transition-all hover:-translate-y-0.5"
                >
                  <div
                    className="text-2xl font-bold leading-tight"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF6B35, #7B68EE)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.metric}
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 leading-snug">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-6 px-4 py-4 rounded-xl border border-border bg-bg-secondary/60">
        {[
          { type: "flow" as const, label: "Data Flow" },
          { type: "circle" as const, color: "#F57C00", label: "Spark + Feast" },
          {
            type: "circle" as const,
            color: "#FF6B35",
            label: "Kubeflow Trainer",
          },
          {
            type: "circle" as const,
            color: "#326CE5",
            label: "Kubernetes Native",
          },
          {
            type: "circle" as const,
            color: "#9C27B0",
            label: "External Integration",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-[12px] text-text-muted"
          >
            {item.type === "flow" ? (
              <div className="flex items-center gap-0.5">
                {["#FF6B35", "#7B68EE", "#4ECDC4"].map((c, j) => (
                  <div
                    key={j}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: c,
                      animation: `arch-legend-dot 1.5s ease-in-out ${j * 0.3}s infinite`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Floating tour button */}
      <Link
        href="/tour"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        style={{
          background: "linear-gradient(135deg, #FF6B35, #FF8A65)",
          boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
          animation: "tour-btn-pulse 2s ease-in-out infinite",
        }}
      >
        🎬 <span>Interactive Tour</span>
      </Link>
    </div>
  );
}
