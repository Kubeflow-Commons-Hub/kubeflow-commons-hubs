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
    .select({
      id: surveys.id,
      title: surveys.title,
      description: surveys.description,
      status: surveys.status,
      opensAt: surveys.opensAt,
      closesAt: surveys.closesAt,
    })
    .from(surveys)
    .where(and(eq(surveys.id, parsed.data), eq(surveys.status, "active")))
    .limit(1);

  if (!survey) return null;

  const now = new Date();
  if (survey.opensAt && now < survey.opensAt) return null;
  if (survey.closesAt && now > survey.closesAt) return null;

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

  const now = new Date();
  if (survey.opensAt && now < survey.opensAt) return { error: "Survey is not yet open" };
  if (survey.closesAt && now > survey.closesAt) return { error: "Survey has closed" };

  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, surveyId))
    .orderBy(surveyQuestions.sortOrder);

  for (const q of questions) {
    const answer = answers[q.id];
    if (q.isRequired) {
      if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === "") {
        return { error: `"${q.questionText}" is required` };
      }
    }

    if (answer && q.options && (q.questionType === "single_choice" || q.questionType === "multi_choice")) {
      const validOptions = q.options as string[];
      const values = Array.isArray(answer) ? answer : [answer];
      for (const v of values) {
        if (!validOptions.includes(v)) {
          return { error: `Invalid option for "${q.questionText}"` };
        }
      }
    }
  }

  try {
    await db.insert(surveyResponses).values({
      surveyId,
      userId: user.id,
      answers,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("survey_responses_unique_idx")) {
      return { error: "You have already submitted a response to this survey" };
    }
    throw err;
  }

  return { success: true };
}
