"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import {
  STUDENT_OPTIONS,
  AWARENESS_QUESTIONS,
  computeExperienceX,
} from "@/lib/survey/constants";
import { submitSurvey } from "@/lib/survey/actions";
import {
  User,
  Briefcase,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  GraduationCap,
  ExternalLink,
  BarChart3,
} from "lucide-react";

const LS_KEY = "kf_survey_submitted";
const STEPS = ["info", "experience", "awareness", "submitting"] as const;
type StepKey = (typeof STEPS)[number];

const STEP_META = [
  { title: "Your Info", icon: User },
  { title: "Background", icon: Briefcase },
  { title: "Interests", icon: Lightbulb },
];

function getSubmission(): { name: string; email: string; at: number } | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface SurveyFormProps {
  customLinkUrl?: string | null;
  customLinkLabel?: string | null;
  showQrCode?: boolean;
  showGraph?: boolean;
}

export function SurveyForm({
  customLinkUrl,
  customLinkLabel,
  showQrCode = true,
  showGraph = false,
}: SurveyFormProps) {
  const [alreadySubmitted] = useState(() => getSubmission());
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expType, setExpType] = useState<"student" | "professional" | null>(null);
  const [studentYear, setStudentYear] = useState<number | null>(null);
  const [yearsOfExp, setYearsOfExp] = useState(1);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const currentStep: StepKey = STEPS[step];

  const experienceX = computeExperienceX(expType, studentYear, yearsOfExp);
  const experienceLabel =
    expType === "student"
      ? STUDENT_OPTIONS.find((o) => o.value === studentYear)?.label || ""
      : expType === "professional"
        ? `${yearsOfExp} Year${yearsOfExp !== 1 ? "s" : ""} Experience`
        : "";

  function toggleAnswer(id: string) {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const awarenessScore = Object.values(answers).filter(Boolean).length;

  async function handleSubmit() {
    setStep(3);
    setError("");

    const result = await submitSurvey({
      name: name.trim(),
      email: email.trim(),
      experienceType: expType!,
      experienceLevel: experienceLabel,
      experienceValue: Math.round(experienceX * 100) / 100,
      answers,
      awarenessScore,
    });

    if (result.error) {
      setError(result.error);
      setStep(2);
      return;
    }

    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ name: name.trim(), email: email.trim(), at: Date.now() })
    );
    setSubmitted(true);
  }

  function canProceed(): boolean {
    if (currentStep === "info")
      return name.trim().length > 0;
    if (currentStep === "experience") {
      if (!expType) return false;
      if (expType === "student") return studentYear !== null;
      return true;
    }
    if (currentStep === "awareness") return true;
    return false;
  }

  function nextStep() {
    if (step < STEPS.length - 1) {
      if (currentStep === "awareness") handleSubmit();
      else setStep((s) => s + 1);
    }
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
  }

  // Already submitted
  if (alreadySubmitted && !submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="rounded-3xl border border-border bg-bg-secondary p-8 shadow-2xl sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kf-blue)]/10">
              <CheckCircle2 className="size-7 text-[var(--kf-blue)]" />
            </div>
            <h2 className="mb-2 text-xl font-bold tracking-tight text-text-primary">
              Already Submitted
            </h2>
            <p className="mb-1 text-sm text-text-muted">
              We already have your response
            </p>
            <p className="mb-6 text-sm font-semibold text-text-secondary">
              {alreadySubmitted.name}
              {alreadySubmitted.email ? ` (${alreadySubmitted.email})` : ""}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--kf-blue)] to-[var(--kf-teal)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                Back to Home
              </Link>
              {showGraph && (
                <Link
                  href="/survey/graph"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-text-secondary transition-all hover:bg-bg-tertiary active:scale-[0.98]"
                >
                  <BarChart3 className="size-4 text-[var(--kf-blue)]" />
                  View Community Graph
                </Link>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <button
                onClick={() => {
                  localStorage.removeItem(LS_KEY);
                  window.location.reload();
                }}
                className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Submit another response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Thank-you screen after submission
  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
        <div className="mx-auto w-full max-w-lg text-center">
          <div className="rounded-3xl border border-border bg-bg-secondary p-8 shadow-2xl sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <CheckCircle2 className="size-7 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-text-primary">
              Thank you!
            </h2>
            <p className="mb-6 text-sm text-text-muted">
              Your response has been recorded. We appreciate your time!
            </p>

            {customLinkUrl && (
              <div className="mb-6 rounded-2xl border border-border bg-bg-primary p-6">
                <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-text-primary">
                  <ExternalLink className="size-4" />
                  {customLinkLabel || "Check this out"}
                </div>

                {showQrCode && (
                  <div className="mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border">
                    <QRCodeSVG
                      value={customLinkUrl}
                      size={180}
                      level="M"
                      marginSize={2}
                      fgColor="#000000"
                    />
                  </div>
                )}

                <a
                  href={customLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--kf-blue)] to-[var(--kf-teal)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <ExternalLink className="size-3.5" />
                  Open Link
                </a>

                <p className="mt-1 break-all text-lg font-semibold text-text-primary sm:text-xl">
                  {customLinkUrl}
                </p>
              </div>
            )}

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-text-secondary transition-all hover:bg-bg-tertiary active:scale-[0.98]"
            >
              Back to Home
            </Link>
            {showGraph && (
              <Link
                href="/survey/graph"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-text-secondary transition-all hover:bg-bg-tertiary active:scale-[0.98]"
              >
                <BarChart3 className="size-4 text-[var(--kf-blue)]" />
                View Community Graph
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="mx-auto w-full max-w-lg">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            Community Survey
          </h1>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-text-muted">
            Tell us about yourself so we can connect you with the right
            opportunities in the Kubeflow community.
          </p>
          {showGraph && (
            <Link
              href="/survey/graph"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-bg-tertiary active:scale-[0.98]"
            >
              <BarChart3 className="size-4 text-[var(--kf-blue)]" />
              View Community Graph
            </Link>
          )}
        </div>

        {/* Progress steps */}
        <div className="mb-6 flex items-center justify-center gap-3">
          {STEP_META.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300",
                    i < step
                      ? "bg-emerald-500/10 text-emerald-500"
                      : i === Math.min(step, 2)
                        ? "bg-[var(--kf-blue)]/10 text-[var(--kf-blue)] shadow-sm ring-1 ring-[var(--kf-blue)]/20"
                        : "bg-bg-tertiary text-text-muted"
                  )}
                >
                  {i < step ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                  <span className="hidden text-[11px] font-semibold sm:inline">
                    {s.title}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={cn(
                      "h-px w-8 transition-all duration-500",
                      i < step ? "bg-emerald-400" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-bg-secondary p-7 shadow-2xl sm:p-9">
          {/* Step 1: Info */}
          {currentStep === "info" && (
            <div>
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Step 1 of 3
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-text-primary">
                  Welcome
                </h2>
                <p className="mt-1.5 text-sm text-text-muted">
                  Tell us a little about yourself.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="survey-name" className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-muted uppercase">
                    <User className="size-3.5" />
                    Full Name
                  </label>
                  <input
                    id="survey-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="form-input w-full"
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="survey-email" className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-muted uppercase">
                    <Mail className="size-3.5" />
                    Email
                  </label>
                  <input
                    id="survey-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="form-input w-full"
                  />
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["@gmail.com", "@redhat.com"].map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => {
                          const at = email.indexOf("@");
                          const base = at !== -1 ? email.slice(0, at) : email;
                          setEmail(base + domain);
                        }}
                        className="rounded-lg border border-border bg-bg-primary px-3 py-1 text-[11px] font-semibold text-text-muted transition-all duration-200 hover:border-[var(--kf-blue)]/30 hover:bg-[var(--kf-blue)]/5 hover:text-[var(--kf-blue)]"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === "experience" && (
            <div>
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Step 2 of 3
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-text-primary">
                  Experience
                </h2>
                <p className="mt-1.5 text-sm text-text-muted">
                  Where are you in your career?
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      key: "student" as const,
                      label: "Student",
                      desc: "Currently in engineering",
                      icon: GraduationCap,
                    },
                    {
                      key: "professional" as const,
                      label: "Professional",
                      desc: "Graduated & working",
                      icon: Briefcase,
                    },
                  ] as const
                ).map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setExpType(t.key)}
                      className={cn(
                        "group rounded-2xl border p-4 text-left transition-all duration-200",
                        expType === t.key
                          ? "border-[var(--kf-blue)]/30 bg-[var(--kf-blue)]/5 shadow-md ring-1 ring-[var(--kf-blue)]/20"
                          : "border-border bg-bg-primary hover:border-text-muted/30 hover:shadow-sm"
                      )}
                    >
                      <div
                        className={cn(
                          "mb-2 flex size-8 items-center justify-center rounded-lg transition-colors",
                          expType === t.key
                            ? "bg-[var(--kf-blue)]/10 text-[var(--kf-blue)]"
                            : "bg-bg-tertiary text-text-muted group-hover:text-text-secondary"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div
                        className={cn(
                          "text-sm font-semibold",
                          expType === t.key
                            ? "text-[var(--kf-blue)]"
                            : "text-text-primary"
                        )}
                      >
                        {t.label}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-[11px]",
                          expType === t.key
                            ? "text-[var(--kf-blue)]/60"
                            : "text-text-muted"
                        )}
                      >
                        {t.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Student years */}
              {expType === "student" && (
                <div className="space-y-2">
                  {STUDENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStudentYear(opt.value)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                        studentYear === opt.value
                          ? "border-[var(--kf-blue)]/30 bg-[var(--kf-blue)]/5 text-[var(--kf-blue)] shadow-sm ring-1 ring-[var(--kf-blue)]/20"
                          : "border-border bg-bg-primary text-text-secondary hover:border-text-muted/30 hover:bg-bg-tertiary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200",
                            studentYear === opt.value
                              ? "border-[var(--kf-blue)] bg-[var(--kf-blue)]"
                              : "border-text-muted/40"
                          )}
                        >
                          {studentYear === opt.value && (
                            <div className="size-2 rounded-full bg-white" />
                          )}
                        </div>
                        {opt.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Professional slider */}
              {expType === "professional" && (
                <div className="rounded-2xl border border-border bg-bg-primary p-5">
                  <div className="mb-5 text-center">
                    <span className="text-5xl font-extrabold tabular-nums text-text-primary">
                      {yearsOfExp}
                    </span>
                    <span className="ml-2 text-base text-text-muted">
                      {yearsOfExp === 1 ? "year" : "years"}
                    </span>
                  </div>

                  <div className="px-1">
                    <input
                      type="range"
                      min={1}
                      max={15}
                      step={1}
                      value={yearsOfExp}
                      onChange={(e) => setYearsOfExp(Number(e.target.value))}
                      className="w-full cursor-pointer accent-[var(--kf-blue)]"
                    />
                    <div className="mt-3 flex justify-between text-[10px] font-medium text-text-muted">
                      <span>1 yr</span>
                      <span>5 yrs</span>
                      <span>10 yrs</span>
                      <span>15 yrs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Awareness */}
          {currentStep === "awareness" && (
            <div>
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Step 3 of 3
                  </p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-text-primary">
                    Tech you know
                  </h2>
                  <p className="mt-1.5 text-sm text-text-muted">
                    Optional — highlight areas where you might collaborate.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-[var(--kf-blue)]/20 bg-[var(--kf-blue)]/5 px-3 py-1.5">
                  <span className="text-base font-bold tabular-nums text-[var(--kf-blue)]">
                    {awarenessScore}
                  </span>
                  <span className="text-xs font-medium text-[var(--kf-blue)]/60">
                    /9
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {AWARENESS_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => toggleAnswer(q.id)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
                      answers[q.id]
                        ? "border-[var(--kf-blue)]/30 bg-[var(--kf-blue)]/5 shadow-sm ring-1 ring-[var(--kf-blue)]/20"
                        : "border-border bg-bg-primary hover:border-text-muted/30 hover:bg-bg-tertiary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                          answers[q.id]
                            ? "border-[var(--kf-blue)] bg-[var(--kf-blue)]"
                            : "border-text-muted/40"
                        )}
                      >
                        {answers[q.id] && (
                          <svg
                            className="size-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "text-sm font-medium",
                            answers[q.id]
                              ? "text-[var(--kf-blue)]"
                              : "text-text-primary"
                          )}
                        >
                          {q.topic}
                        </div>
                        <div
                          className={cn(
                            "truncate text-[11px]",
                            answers[q.id]
                              ? "text-[var(--kf-blue)]/50"
                              : "text-text-muted"
                          )}
                        >
                          {q.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submitting */}
          {currentStep === "submitting" && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-5 size-8 animate-spin text-[var(--kf-blue)]" />
              <p className="text-sm font-medium text-text-muted">
                Submitting your response...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              <AlertTriangle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Nav buttons */}
          {currentStep !== "submitting" && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  step === 0
                    ? "cursor-not-allowed text-text-muted/30"
                    : "text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
                )}
              >
                {step > 0 && <ChevronLeft className="size-3.5" />}
                Back
              </button>

              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-7 py-3 text-sm font-semibold transition-all duration-200",
                  canProceed()
                    ? "bg-gradient-to-r from-[var(--kf-blue)] to-[var(--kf-teal)] text-white shadow-lg hover:opacity-90 active:scale-[0.98]"
                    : "cursor-not-allowed bg-bg-tertiary text-text-muted/50"
                )}
              >
                {currentStep === "awareness" ? "Submit" : "Continue"}
                {canProceed() && <ChevronRight className="size-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
