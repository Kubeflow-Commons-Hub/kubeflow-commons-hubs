import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kf-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--kf-blue)] text-white shadow-sm hover:bg-[var(--kf-blue)]/90 hover:shadow-md hover:shadow-[var(--kf-blue)]/10",
        gradient:
          "bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] text-white shadow-sm hover:shadow-lg hover:shadow-[#2563EB]/30",
        secondary:
          "bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80",
        ghost:
          "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
        outline:
          "border border-border-strong text-text-primary hover:bg-bg-secondary hover:border-[var(--kf-blue)]/30 hover:shadow-sm",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        link: "text-[var(--kf-blue)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
