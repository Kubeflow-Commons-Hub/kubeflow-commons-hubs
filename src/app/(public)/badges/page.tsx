import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Badges",
  description: "Explore all digital badges you can earn in the Kubeflow community.",
};

export default function BadgesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="text-5xl mb-6" role="img" aria-label="Coming soon">
          🏅
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Coming Soon
        </h1>
        <p className="text-text-secondary text-lg max-w-md mb-8">
          We&apos;re working on a badge catalog where you can explore and track
          all the badges you can earn in the Kubeflow community.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg bg-[var(--kf-blue)] text-white text-sm font-medium hover:bg-[var(--kf-blue)]/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
