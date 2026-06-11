"use server";

import { db } from "@/db";
import { surveyConfig, surveyResponses } from "@/db/schema";
import { submitSurveySchema, type SubmitSurveyInput } from "@/lib/validations/survey";

export async function getSurveyConfig() {
  try {
    const [config] = await db.select().from(surveyConfig).limit(1);
    return config ?? null;
  } catch {
    // Table may not exist yet if migration hasn't run
    return null;
  }
}

export async function isSurveyEnabled(): Promise<boolean> {
  const config = await getSurveyConfig();
  return config?.isEnabled ?? false;
}

export async function submitSurvey(input: SubmitSurveyInput) {
  const config = await getSurveyConfig();
  if (!config?.isEnabled) {
    return { error: "Survey is currently closed" };
  }

  const parsed = submitSurveySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  await db.insert(surveyResponses).values({
    name: data.name,
    email: data.email || null,
    experienceType: data.experienceType,
    experienceLevel: data.experienceLevel,
    experienceValue: data.experienceValue,
    answers: data.answers,
    awarenessScore: data.awarenessScore,
  });

  return { success: true };
}
