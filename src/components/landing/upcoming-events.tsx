"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "./scroll-reveal";

const events = [
  {
    title: "KCD Bangalore 2026",
    date: "Jun 15",
    month: "JUN",
    day: "15",
    location: "Bangalore",
    type: "conference" as const,
    attendees: 142,
    slug: "kcd-bangalore-2026",
  },
  {
    title: "Kubeflow Pipelines Workshop",
    date: "Jun 22",
    month: "JUN",
    day: "22",
    location: "Virtual",
    type: "workshop" as const,
    attendees: 58,
    slug: "kubeflow-pipelines-workshop",
  },
  {
    title: "Delhi MLOps Meetup",
    date: "Jul 03",
    month: "JUL",
    day: "03",
    location: "Delhi NCR",
    type: "meetup" as const,
    attendees: 34,
    slug: "delhi-mlops-meetup",
  },
];

const typeVariant: Record<string, "meetup" | "conference" | "workshop"> = {
  meetup: "meetup",
  conference: "conference",
  workshop: "workshop",
};

export function UpcomingEvents() {
  return (
    <section className="py-20 md:py-28 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Upcoming Events
              </h2>
              <p className="text-text-secondary text-lg">
                Join us at meetups, conferences, and workshops across India
              </p>
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--kf-blue)] hover:underline underline-offset-4"
            >
              View all events <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <ScrollReveal key={event.slug} delay={index * 100}>
              <Link href={`/events/${event.slug}`} className="group block">
                <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-border-strong">
                  {/* Banner placeholder with gradient */}
                  <div className="relative h-40 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--kf-blue)]/5 to-[var(--kf-teal)]/5" />

                    {/* Date chip */}
                    <div className="absolute top-3 left-3 bg-bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center border border-border">
                      <div className="text-[10px] uppercase tracking-wider font-medium text-[var(--kf-blue)]">
                        {event.month}
                      </div>
                      <div className="text-lg font-bold leading-tight">{event.day}</div>
                    </div>
                  </div>

                  <div className="p-5">
                    <Badge variant={typeVariant[event.type] || "default"} className="mb-3">
                      {event.type}
                    </Badge>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-[var(--kf-blue)] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                      <MapPin className="size-3.5" />
                      {event.location}
                    </div>

                    {/* Attendee count */}
                    <div className="flex items-center mt-4 pt-4 border-t border-border">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="size-7 rounded-full bg-bg-tertiary border-2 border-bg-secondary"
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-text-muted">
                        +{event.attendees} attending
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile "View all" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--kf-blue)] hover:underline underline-offset-4"
          >
            View all events <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
