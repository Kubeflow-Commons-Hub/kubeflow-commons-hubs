"use client";

import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "Kubeflow Common Hubs helped me go from a beginner to a core contributor. The badge system kept me motivated, and the community events introduced me to amazing people.",
    name: "Rahul Sharma",
    role: "ML Engineer, Bangalore",
    level: 4,
  },
  {
    quote:
      "The CFP system made it so easy to submit my first talk proposal. I never thought I'd be a speaker, but the community encouraged me every step of the way.",
    name: "Priya Patel",
    role: "Data Scientist, Mumbai",
    level: 3,
  },
  {
    quote:
      "What I love most is seeing my contributions tracked and recognized. The GitHub integration makes it effortless - I just code, and the platform handles the rest.",
    name: "Amit Kumar",
    role: "Platform Engineer, Delhi NCR",
    level: 5,
  },
];

export function CommunityVoices() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-20 md:py-28 bg-bg-primary">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Community Voices
            </h2>
            <p className="text-text-secondary text-lg">
              Hear from members who are building and growing with Kubeflow
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label="Community testimonials"
          >
            <div className="glass rounded-2xl p-8 md:p-12 text-center" aria-live="polite">
              <Quote className="size-10 text-[var(--kf-blue)]/20 mx-auto mb-6" />

              <p className="text-lg md:text-xl text-text-primary leading-relaxed mb-8 max-w-2xl mx-auto min-h-[4.5rem]">
                &ldquo;{testimonials[active].quote}&rdquo;
              </p>

              <div className="flex flex-col items-center">
                {/* Avatar placeholder */}
                <div className="size-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center text-white font-semibold mb-3">
                  {testimonials[active].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="font-semibold">{testimonials[active].name}</div>
                <div className="text-sm text-text-secondary">
                  {testimonials[active].role}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() =>
                  setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                }
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="size-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={cn(
                      "size-2 rounded-full transition-all duration-300",
                      i === active
                        ? "bg-[var(--kf-blue)] w-6"
                        : "bg-text-muted hover:bg-text-secondary"
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActive((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
