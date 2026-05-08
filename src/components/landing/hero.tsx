"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "./animated-counter";
import { ParticleField } from "./particle-field";

const stats = [
  { label: "Members", value: 142 },
  { label: "Events", value: 23 },
  { label: "Contributions", value: 890 },
  { label: "Badges Earned", value: 456 },
];

export function Hero() {
  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0A1228] -mt-16">
      {/* Deep blue radial glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#1E40AF]/25 blur-[150px]" />
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-[#2563EB]/15 blur-[120px] animate-orb-1" />
        <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#0EA5E9]/10 blur-[100px] animate-orb-2" />
        <div className="absolute bottom-[15%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#1D4ED8]/12 blur-[110px] animate-orb-3" />
      </div>

      {/* Hidden "KUBEFLOW" text - positioned above the main content, revealed on cursor hover */}
      <div className="absolute inset-x-0 top-[5%] sm:top-[8%] flex justify-center z-[0] select-none" aria-hidden="true">
        <span
          className="text-[14vw] sm:text-[11vw] md:text-[10vw] font-extrabold tracking-[0.2em] uppercase"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(56, 189, 248, 0.25)",
            textShadow: "0 0 40px rgba(37, 99, 235, 0.15)",
          }}
        >
          KUBEFLOW
        </span>
      </div>

      {/* Interactive particle field - dots react to cursor, covers the text */}
      <ParticleField />

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-[2]" />

      {/* Content - above particles, but lets mouse events pass through to canvas */}
      <div className="relative z-[3] mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
        {/* Announcement pill */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm backdrop-blur-sm mb-8 border border-white/10 bg-white/5 text-blue-200/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Open for new members
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
          style={{ textShadow: "0 0 60px rgba(37, 99, 235, 0.3)" }}
        >
          The Home of{" "}
          <span className="bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-[#3B82F6] bg-clip-text text-transparent">
            Kubeflow
          </span>{" "}
          in India
        </h1>

        {/* Subheading */}
        <p className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed mb-10 text-blue-100/60">
          Learn. Contribute. Grow. The one-stop community hub for everything
          Kubeflow - events, contributions, badges, and your developer journey.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="xl"
            className="bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 rounded-xl transition-all"
            asChild
          >
            <Link href="/signup">Join the Community</Link>
          </Button>
          <Button
            size="xl"
            className="border border-white/15 text-blue-100 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl transition-all"
            asChild
          >
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-4 py-3 text-center backdrop-blur-md border border-white/10 bg-white/5"
            >
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                <AnimatedCounter value={stat.value} />
              </div>
              <p className="text-xs mt-1 uppercase tracking-wider font-medium text-blue-200/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
