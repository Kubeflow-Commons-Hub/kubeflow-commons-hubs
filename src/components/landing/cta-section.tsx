"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./scroll-reveal";

export function CtaSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-[var(--kf-blue)]/5 to-bg-primary" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--kf-blue)]/8 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full bg-[var(--kf-purple)]/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to be part of something{" "}
            <span className="bg-gradient-to-r from-[var(--kf-blue)] to-[var(--kf-teal)] bg-clip-text text-transparent">
              bigger
            </span>
            ?
          </h2>
          <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Join hundreds of developers building the future of ML infrastructure
            in India. Your contributions matter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="xl" asChild>
              <Link href="/signup">Join Now - It&apos;s Free</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
