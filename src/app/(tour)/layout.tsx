import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Minimal top bar — fixed height so we can calc the remaining space */}
      <header className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 bg-bg-primary/95 backdrop-blur-md border-b border-border z-50">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-7 rounded-lg bg-gradient-to-br from-[var(--kf-blue)] to-[var(--kf-teal)] flex items-center justify-center">
            <span className="text-white font-bold text-[11px] tracking-tight">KF</span>
          </div>
          <span className="text-text-primary font-semibold text-sm group-hover:text-[var(--kf-blue)] transition-colors hidden sm:block">
            Kubeflow
          </span>
        </Link>

        <span className="absolute left-1/2 -translate-x-1/2 text-text-muted text-xs font-medium tracking-widest uppercase pointer-events-none">
          Interactive Tour
        </span>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to site
        </Link>
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
