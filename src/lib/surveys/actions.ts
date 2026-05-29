"use server";

import { db } from "@/db";
import { surveys, surveyQuestions, surveyResponses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/guards";
import { submitSurveySchema, type SubmitSurveyInput } from "@/lib/validations/surveys";
import { z } from "zod";

const uuidSchema = z.string().uuid();

export async function getPublicSurvey(id: string) {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return null;

  const [survey] = await db
    .select()
    .from(surveys)
    .where(and(eq(surveys.id, parsed.data), eq(surveys.status, "active")))
    .limit(1);

  if (!survey) return null;

  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, survey.id))
    .orderBy(surveyQuestions.sortOrder);

  return { ...survey, questions };
}

export async function getUserSurveyResponse(surveyId: string) {
  const user = await requireAuth();
  const parsed = uuidSchema.safeParse(surveyId);
  if (!parsed.success) return null;

  const [response] = await db
    .select({ id: surveyResponses.id })
    .from(surveyResponses)
    .where(
      and(
        eq(surveyResponses.surveyId, parsed.data),
        eq(surveyResponses.userId, user.id)
      )
    )
    .limit(1);

  return response ?? null;
}

export async function submitSurveyResponse(input: SubmitSurveyInput) {
  const user = await requireAuth();

  const parsed = submitSurveySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { surveyId, answers } = parsed.data;

  const [survey] = await db
    .select()
    .from(surveys)
    .where(and(eq(surveys.id, surveyId), eq(surveys.status, "active")))
    .limit(1);

  if (!survey) return { error: "Survey is not active" };

  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, surveyId))
    .orderBy(surveyQuestions.sortOrder);

  for (const q of questions) {
    if (q.isRequired) {
      const answer = answers[q.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === "") {
        return { error: `"${q.questionText}" is required` };
      }
    }
  }

  const [existing] = await db
    .select({ id: surveyResponses.id })
    .from(surveyResponses)
    .where(
      and(
        eq(surveyResponses.surveyId, surveyId),
        eq(surveyResponses.userId, user.id)
      )
    )
    .limit(1);

  if (existing) return { error: "You have already submitted a response to this survey" };

  await db.insert(surveyResponses).values({
    surveyId,
    userId: user.id,
    answers,
  });

  return { success: true };
}
