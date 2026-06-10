import { db } from "@/db";
import { events } from "@/db/schema";
import { isNull, desc } from "drizzle-orm";
import { SurveyForm } from "../survey-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin: Create Survey" };

export default async function NewSurveyPage() {
  const eventList = await db
    .select({ id: events.id, title: events.title })
    .from(events)
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.eventDate))
    .limit(50);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create Survey</h1>
        <p className="text-sm text-text-muted mt-1">
          Build a new survey with custom questions.
        </p>
      </div>
      <SurveyForm events={eventList} />
    </div>
  );
}
