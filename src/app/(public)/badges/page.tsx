import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Badges",
  description: "Explore all digital badges you can earn in the Kubeflow community.",
};

const allBadges = [
  { name: "Welcome!", description: "Completed your profile", tier: "bronze" as const, category: "engagement", icon: "👋", earned: 89 },
  { name: "First Blood", description: "First PR merged to a Kubeflow repo", tier: "bronze" as const, category: "contribution", icon: "🩸", earned: 45 },
  { name: "Bug Hunter", description: "Filed 10+ issues", tier: "silver" as const, category: "contribution", icon: "🐛", earned: 23 },
  { name: "Guardian", description: "10+ code reviews", tier: "silver" as const, category: "contribution", icon: "🛡️", earned: 18 },
  { name: "Code Warrior", description: "10+ PRs merged", tier: "silver" as const, category: "contribution", icon: "⚔️", earned: 15 },
  { name: "First Steps", description: "Attended first event", tier: "bronze" as const, category: "engagement", icon: "👣", earned: 67 },
  { name: "Regular", description: "Attended 5+ events", tier: "silver" as const, category: "engagement", icon: "📅", earned: 28 },
  { name: "CFP Pioneer", description: "Submitted first CFP", tier: "bronze" as const, category: "engagement", icon: "📝", earned: 31 },
  { name: "Speaker", description: "Delivered a talk", tier: "gold" as const, category: "community", icon: "🎤", earned: 12 },
  { name: "Organizer", description: "Organized a community event", tier: "gold" as const, category: "community", icon: "🎯", earned: 8 },
  { name: "Kubeflow Core", description: "Contributed to 3+ repos", tier: "gold" as const, category: "contribution", icon: "🏆", earned: 6 },
  { name: "Community Champion", description: "Exceptional service", tier: "platinum" as const, category: "special", icon: "💎", earned: 3 },
  { name: "KubeCon Speaker", description: "Spoke at KubeCon", tier: "platinum" as const, category: "special", icon: "🌟", earned: 2 },
  { name: "Founding Member", description: "Joined during launch", tier: "gold" as const, category: "special", icon: "🚀", earned: 50 },
];

const tierBorder = {
  bronze: "border-[var(--tier-bronze)]/30",
  silver: "border-[var(--tier-silver)]/30",
  gold: "border-[var(--tier-gold)]/30",
  platinum: "border-[var(--tier-silver)]/40",
};

const tierDot = {
  bronze: "bg-[var(--tier-bronze)]",
  silver: "bg-[var(--tier-silver)]",
  gold: "bg-[var(--tier-gold)]",
  platinum: "bg-gradient-to-r from-[#E5E4E2] via-[#B0C4DE] to-[#E5E4E2]",
};

const categories = ["all", "contribution", "community", "engagement", "special"];

export default function BadgesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Badge Catalog
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Explore all the badges you can earn. Contribute, participate, and build your collection.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm capitalize transition-colors",
              cat === "all"
                ? "bg-bg-secondary border border-border-strong text-text-primary"
                : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allBadges.map((badge) => (
          <div
            key={badge.name}
            className={cn(
              "flex flex-col items-center p-5 rounded-xl border bg-bg-secondary transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-lg cursor-pointer",
              tierBorder[badge.tier]
            )}
          >
            <div className="text-3xl mb-3" role="img" aria-label={badge.name}>
              {badge.icon}
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <div className={cn("size-2 rounded-full", tierDot[badge.tier])} />
              <span className="text-[10px] uppercase tracking-widest font-medium text-text-muted">
                {badge.tier}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-center mb-1">{badge.name}</h3>
            <p className="text-xs text-text-muted text-center leading-relaxed mb-3">
              {badge.description}
            </p>

            <span className="text-xs text-text-muted">
              {badge.earned} earned
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
