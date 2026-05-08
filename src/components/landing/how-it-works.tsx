"use client";

import { UserPlus, GitBranch, Trophy } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const steps = [
  {
    icon: UserPlus,
    title: "Join the Community",
    description:
      "Sign up with your GitHub or Google account, complete your profile, and connect your GitHub to start tracking contributions.",
  },
  {
    icon: GitBranch,
    title: "Contribute & Participate",
    description:
      "Attend events, submit talks via CFPs, contribute to Kubeflow repos, review code, and help fellow community members.",
  },
  {
    icon: Trophy,
    title: "Earn Recognition",
    description:
      "Earn digital badges, climb the leaderboard, level up your profile, and showcase your journey in the Kubeflow ecosystem.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Three simple steps to become an active part of the Kubeflow community in India
            </p>
          </div>
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px border-t-2 border-dashed border-border-strong" />

          {steps.map((step, index) => (
            <ScrollReveal key={step.title} delay={index * 150}>
              <div className="relative flex flex-col items-center text-center">
                {/* Step number + icon */}
                <div className="relative mb-6">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-[var(--kf-blue)]/10 to-[var(--kf-teal)]/10 border border-border-strong flex items-center justify-center">
                    <step.icon className="size-7 text-[var(--kf-blue)]" />
                  </div>
                  <div className="absolute -top-2 -right-2 size-6 rounded-full bg-[var(--kf-blue)] flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
