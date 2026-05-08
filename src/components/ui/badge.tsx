import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--kf-blue)]/10 text-[var(--kf-blue)]",
        secondary: "border-transparent bg-bg-tertiary text-text-secondary",
        outline: "border-border text-text-secondary",
        success: "border-transparent bg-emerald-500/10 text-emerald-400",
        warning: "border-transparent bg-amber-500/10 text-amber-400",
        destructive: "border-transparent bg-red-500/10 text-red-400",
        meetup: "border-transparent bg-[var(--kf-teal)]/10 text-[var(--kf-teal)]",
        conference: "border-transparent bg-[var(--kf-purple)]/10 text-[var(--kf-purple)]",
        workshop: "border-transparent bg-amber-500/10 text-amber-400",
        hackathon: "border-transparent bg-pink-500/10 text-pink-400",
        webinar: "border-transparent bg-emerald-500/10 text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
