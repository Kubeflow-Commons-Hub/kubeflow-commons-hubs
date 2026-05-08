import type { Metadata } from "next";
import { MapPin, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past Kubeflow community events across India - meetups, conferences, workshops, and hackathons.",
};

const mockEvents = [
  {
    id: "1",
    title: "KCD Bangalore 2026",
    slug: "kcd-bangalore-2026",
    shortDescription: "The biggest Kubernetes Community Day in South India, featuring Kubeflow talks and workshops.",
    location: "Bangalore",
    eventDate: "2026-06-15T09:00:00",
    type: "conference" as const,
    status: "upcoming" as const,
    attendees: 142,
  },
  {
    id: "2",
    title: "Kubeflow Pipelines Workshop",
    slug: "kubeflow-pipelines-workshop",
    shortDescription: "Hands-on workshop building ML pipelines with Kubeflow Pipelines v2.",
    location: "Virtual",
    eventDate: "2026-06-22T14:00:00",
    type: "workshop" as const,
    status: "upcoming" as const,
    attendees: 58,
  },
  {
    id: "3",
    title: "Delhi MLOps Meetup",
    slug: "delhi-mlops-meetup",
    shortDescription: "Monthly meetup for MLOps practitioners in Delhi NCR. Lightning talks and networking.",
    location: "Delhi NCR",
    eventDate: "2026-07-03T18:00:00",
    type: "meetup" as const,
    status: "upcoming" as const,
    attendees: 34,
  },
  {
    id: "4",
    title: "Kubeflow Katib Deep Dive",
    slug: "kubeflow-katib-deep-dive",
    shortDescription: "Deep dive into hyperparameter tuning with Kubeflow Katib.",
    location: "Virtual",
    eventDate: "2026-07-10T15:00:00",
    type: "webinar" as const,
    status: "upcoming" as const,
    attendees: 22,
  },
];

const typeVariant: Record<string, "meetup" | "conference" | "workshop" | "webinar"> = {
  meetup: "meetup",
  conference: "conference",
  workshop: "workshop",
  webinar: "webinar",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Events
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Join us at meetups, conferences, workshops, and hackathons across India and online.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by event type">
        <button aria-pressed="true" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors">
          <Filter className="size-3.5" />
          All Types
        </button>
        {["Meetup", "Conference", "Workshop", "Hackathon", "Webinar"].map((type) => (
          <button
            key={type}
            aria-pressed="false"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
          >
            {type}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvents.map((event) => (
          <a
            key={event.id}
            href={`/events/${event.slug}`}
            className="group block rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-lg hover:border-border-strong"
          >
            <div className="flex items-start justify-between mb-4">
              <Badge variant={typeVariant[event.type] || "default"}>
                {event.type}
              </Badge>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider font-medium text-[var(--kf-blue)]">
                  {new Date(event.eventDate).toLocaleDateString("en-IN", { month: "short" })}
                </div>
                <div className="text-lg font-bold leading-tight">
                  {new Date(event.eventDate).getDate()}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--kf-blue)] transition-colors">
              {event.title}
            </h3>
            <p className="text-sm text-text-secondary mb-4 line-clamp-2">
              {event.shortDescription}
            </p>

            <div className="flex items-center justify-between text-sm text-text-muted">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {event.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(event.eventDate).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
