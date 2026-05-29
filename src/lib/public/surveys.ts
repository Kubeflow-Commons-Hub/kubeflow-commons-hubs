"use server";

import { db } from "@/db";
import { surveys, surveyQuestions, surveyResponses } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/guards";
import { submitSurveySchema, type SubmitSurveyInput } from "@/lib/validations/surveys";

export async function getPublicSurvey(id: string) {
  const [survey] = await db
    .select({
      id: surveys.id,
      title: surveys.title,
      description: surveys.description,
      status: surveys.status,
      opensAt: surveys.opensAt,
      closesAt: surveys.closesAt,
    })
    .from(surveys)
    .where(and(eq(surveys.id, id), isNull(surveys.deletedAt), eq(surveys.status, "active")))
    .limit(1);

  if (!survey) return null;

  const now = new Date();
  if (survey.opensAt && now < survey.opensAt) return null;
  if (survey.closesAt && now > survey.closesAt) return null;

  const questions = await db
    .select({
      id: surveyQuestions.id,
      text: surveyQuestions.text,
      type: surveyQuestions.type,
      options: surveyQuestions.options,
      required: surveyQuestions.required,
      sortOrder: surveyQuestions.sortOrder,
    })
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, id))
    .orderBy(surveyQuestions.sortOrder);

  return { ...survey, questions };
}

export async function submitSurveyResponse(input: SubmitSurveyInput) {
  const user = await requireAuth();

  const parsed = submitSurveySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const survey = await getPublicSurvey(parsed.data.surveyId);
  if (!survey) return { error: "Survey not found or not active" };

  const [existing] = await db
    .select({ id: surveyResponses.id })
    .from(surveyResponses)
    .where(
      and(
        eq(surveyResponses.surveyId, parsed.data.surveyId),
        eq(surveyResponses.userId, user.id)
      )
    )
    .limit(1);

  if (existing) return { error: "You have already submitted a response to this survey" };

  for (const q of survey.questions) {
    const answer = parsed.data.answers[q.id];
    if (q.required) {
      if (answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0)) {
        return { error: `"${q.text}" is required` };
      }
    }
  }

  await db.insert(surveyResponses).values({
    surveyId: parsed.data.surveyId,
    userId: user.id,
    answers: parsed.data.answers,
  });

  return { success: true };
}

export async function hasUserRespondedToSurvey(surveyId: string, userId: string) {
  const [existing] = await db
    .select({ id: surveyResponses.id })
    .from(surveyResponses)
    .where(
      and(
        eq(surveyResponses.surveyId, surveyId),
        eq(surveyResponses.userId, userId)
      )
    )
    .limit(1);

  return !!existing;
}
