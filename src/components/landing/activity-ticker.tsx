"use client";

import { Award, GitPullRequest, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { icon: Award, text: "Rahul earned the Bug Hunter badge", color: "text-[var(--tier-gold)]" },
  { icon: Calendar, text: "New event: KCD Delhi 2026", color: "text-[var(--kf-teal)]" },
  { icon: GitPullRequest, text: "Priya's PR merged to kubeflow/pipelines", color: "text-emerald-400" },
  { icon: UserPlus, text: "Amit joined the community", color: "text-[var(--kf-blue)]" },
  { icon: Award, text: "Sneha earned her first badge!", color: "text-[var(--tier-bronze)]" },
  { icon: Calendar, text: "Workshop: Intro to Kubeflow Pipelines", color: "text-[var(--kf-teal)]" },
  { icon: GitPullRequest, text: "Vikram's issue resolved in kubeflow/katib", color: "text-emerald-400" },
  { icon: UserPlus, text: "Deepika completed Level 3", color: "text-[var(--kf-purple)]" },
];

export function ActivityTicker() {
  const doubled = [...activities, ...activities];

  return (
    <section
      className="py-6 border-y border-border overflow-hidden bg-bg-secondary/50"
      aria-label="Recent community activity"
      role="marquee"
    >
      <div className="flex animate-ticker hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {doubled.map((activity, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-6 whitespace-nowrap text-sm"
          >
            <activity.icon className={cn("size-4 shrink-0", activity.color)} />
            <span className="text-text-secondary">{activity.text}</span>
            <span className="text-text-muted mx-4" aria-hidden="true">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
