"use client";

import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

const badges = [
  {
    name: "First Blood",
    description: "First PR merged to a Kubeflow repo",
    tier: "bronze" as const,
    icon: "🩸",
  },
  {
    name: "Code Warrior",
    description: "10+ PRs merged",
    tier: "silver" as const,
    icon: "⚔️",
  },
  {
    name: "Speaker",
    description: "Delivered a talk at a community event",
    tier: "gold" as const,
    icon: "🎤",
  },
  {
    name: "Kubeflow Core",
    description: "Contributed to 3+ different repos",
    tier: "gold" as const,
    icon: "🏆",
  },
  {
    name: "Community Champion",
    description: "Exceptional community service",
    tier: "platinum" as const,
    icon: "💎",
  },
  {
    name: "Bug Hunter",
    description: "10+ issues filed",
    tier: "silver" as const,
    icon: "🐛",
  },
];

const tierStyles = {
  bronze: "border-[var(--tier-bronze)]/40 shadow-[var(--tier-bronze)]/5",
  silver: "border-[var(--tier-silver)]/40 shadow-[var(--tier-silver)]/5",
  gold: "border-[var(--tier-gold)]/40 shadow-[var(--tier-gold)]/10",
  platinum: "border-[var(--tier-silver)]/40 shadow-[var(--tier-silver)]/10",
};

const tierDot = {
  bronze: "bg-[var(--tier-bronze)]",
  silver: "bg-[var(--tier-silver)]",
  gold: "bg-[var(--tier-gold)]",
  platinum: "bg-gradient-to-r from-[#E5E4E2] via-[#B0C4DE] to-[#E5E4E2]",
};

export function FeaturedBadges() {
  return (
    <section className="py-20 md:py-28 bg-bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Earn Digital Badges
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Contribute, participate, and get recognized. Collect verifiable badges
              that showcase your journey in the Kubeflow community.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <ScrollReveal key={badge.name} delay={index * 80}>
              <div
                className={cn(
                  "group relative flex flex-col items-center p-5 rounded-xl border bg-bg-secondary transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-2 hover:shadow-xl cursor-default",
                  tierStyles[badge.tier]
                )}
              >
                {/* Hexagonal badge placeholder */}
                <div className="relative size-16 mb-3 flex items-center justify-center">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl rotate-45 border-2 transition-all duration-300 group-hover:rotate-[55deg]",
                      tierStyles[badge.tier]
                    )}
                  />
                  <span className="relative text-2xl" role="img" aria-label={badge.name}>
                    {badge.icon}
                  </span>
                </div>

                {/* Tier dot */}
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={cn("size-2 rounded-full", tierDot[badge.tier])} />
                  <span className="text-[10px] uppercase tracking-widest font-medium text-text-muted">
                    {badge.tier}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-center">{badge.name}</h3>
                <p className="text-xs text-text-muted text-center mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
