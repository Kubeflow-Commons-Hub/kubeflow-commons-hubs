"use client";

import Link from "next/link";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers";

export default function TourLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Minimal top bar — fixed height so we can calc the remaining space */}
      <header className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 bg-bg-primary/95 backdrop-blur-md border-b border-border z-50">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-7 rounded-lg bg-gradient-to-br from-[var(--kf-blue)] to-[var(--kf-teal)] flex items-center justify-center">
            <span className="text-white font-bold text-[11px] tracking-tight">KF</span>
          </div>
          <span className="text-text-primary font-semibold text-sm group-hover:text-[var(--kf-blue)] transition-colors hidden sm:block">
            Kubeflow Commons Hub
          </span>
        </Link>

        <span className="absolute left-1/2 -translate-x-1/2 text-text-muted text-xs font-medium tracking-widest uppercase pointer-events-none">
          Interactive Tour
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="size-[18px] hidden dark:block" />
            <Moon className="size-[18px] dark:hidden" />
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors px-2 py-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Tour area fills viewport below the header using an inline style to avoid h-full cascade issues */}
      <main
        style={{ paddingTop: "3rem", height: "100dvh", overflow: "hidden" }}
        className="relative bg-bg-primary"
      >
        {children}
      </main>
    </>
  );
}
