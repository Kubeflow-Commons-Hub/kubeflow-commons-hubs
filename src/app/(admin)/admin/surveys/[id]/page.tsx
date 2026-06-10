import { notFound } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema";
import { isNull, desc } from "drizzle-orm";
import { getSurveyByIdAdmin } from "@/lib/admin/surveys";
import { SurveyForm } from "../survey-form";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const survey = await getSurveyByIdAdmin(id);
  return { title: survey ? `Edit: ${survey.title}` : "Survey Not Found" };
}

export default async function EditSurveyPage({ params }: Props) {
  const { id } = await params;
  const survey = await getSurveyByIdAdmin(id);

  if (!survey) notFound();

  const eventList = await db
    .select({ id: events.id, title: events.title })
    .from(events)
    .where(isNull(events.deletedAt))
    .orderBy(desc(events.eventDate))
    .limit(50);

  const initial = {
    title: survey.title,
    description: survey.description || "",
    status: survey.status as "draft" | "active" | "closed",
    eventId: survey.eventId || "",
    opensAt: survey.opensAt?.toISOString().slice(0, 16) ?? "",
    closesAt: survey.closesAt?.toISOString().slice(0, 16) ?? "",
    questions: survey.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType as "short_text" | "long_text" | "single_choice" | "multi_choice",
      options: (q.options as string[] | null) ?? [],
      isRequired: q.isRequired,
      sortOrder: q.sortOrder,
    })),
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Edit Survey</h1>
        <p className="text-sm text-text-muted mt-1">{survey.title}</p>
      </div>
      <SurveyForm surveyId={id} initialValues={initial} events={eventList} />
    </div>
  );
}
