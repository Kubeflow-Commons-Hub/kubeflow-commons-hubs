"use server";

import { db } from "@/db";
import { surveys, surveyQuestions, surveyResponses, users } from "@/db/schema";
import { eq, and, isNull, isNotNull, desc, ilike, count } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";
import { logAuditAsync } from "./audit-helper";
import { revalidatePath } from "next/cache";
import { createSurveySchema, type CreateSurveyInput } from "@/lib/validations/surveys";
import { z } from "zod";

const uuidSchema = z.string().uuid();

interface ListSurveysParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function listSurveys({
  page = 1,
  pageSize = 25,
  search,
  status,
}: ListSurveysParams = {}) {
  await requireRole("moderator");

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));
  const safeSearch = search?.slice(0, 200);

  const conditions = [];

  if (status === "deleted") {
    conditions.push(isNotNull(surveys.deletedAt));
  } else {
    conditions.push(isNull(surveys.deletedAt));
    if (status && ["draft", "active", "closed"].includes(status)) {
      conditions.push(eq(surveys.status, status as "draft" | "active" | "closed"));
    }
  }

  if (safeSearch) {
    conditions.push(ilike(surveys.title, `%${safeSearch}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const responseCount = db
    .select({
      surveyId: surveyResponses.surveyId,
      count: count().as("response_count"),
    })
    .from(surveyResponses)
    .groupBy(surveyResponses.surveyId)
    .as("response_counts");

  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: surveys.id,
        title: surveys.title,
        status: surveys.status,
        opensAt: surveys.opensAt,
        closesAt: surveys.closesAt,
        deletedAt: surveys.deletedAt,
        createdAt: surveys.createdAt,
        responseCount: responseCount.count,
      })
      .from(surveys)
      .leftJoin(responseCount, eq(surveys.id, responseCount.surveyId))
      .where(where)
      .orderBy(desc(surveys.createdAt))
      .limit(safePageSize)
      .offset((safePage - 1) * safePageSize),
    db.select({ value: count() }).from(surveys).where(where),
  ]);

  return { rows, totalCount: total?.value ?? 0 };
}

export async function getSurveyById(id: string) {
  await requireRole("moderator");

  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return null;

  const [survey] = await db
    .select()
    .from(surveys)
    .where(eq(surveys.id, parsed.data))
    .limit(1);

  if (!survey) return null;

  const questions = await db
    .select()
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, parsed.data))
    .orderBy(surveyQuestions.sortOrder);

  return { ...survey, questions };
}

export async function createSurvey(input: CreateSurveyInput) {
  const actor = await requireRole("moderator");

  const parsed = createSurveySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const data = parsed.data;

  const [created] = await db
    .insert(surveys)
    .values({
      title: data.title,
      description: data.description || null,
      eventId: data.eventId || null,
      status: data.status,
      opensAt: data.opensAt ? new Date(data.opensAt) : null,
      closesAt: data.closesAt ? new Date(data.closesAt) : null,
      createdBy: actor.id,
    })
    .returning({ id: surveys.id });

  if (created && data.questions.length > 0) {
    await db.insert(surveyQuestions).values(
      data.questions.map((q) => ({
        surveyId: created.id,
        text: q.text,
        type: q.type,
        options: q.options?.length ? q.options : null,
        required: q.required,
        sortOrder: q.sortOrder,
      }))
    );
  }

  logAuditAsync({
    actorId: actor.id,
    action: "survey.created",
    targetType: "survey",
    targetId: created?.id,
    newValues: { title: data.title },
  });

  revalidatePath("/admin/surveys");
  return { success: true, id: created?.id };
}

export async function updateSurvey(id: string, input: CreateSurveyInput) {
  const actor = await requireRole("moderator");

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid survey ID" };

  const parsed = createSurveySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await getSurveyById(parsedId.data);
  if (!existing) return { error: "Survey not found" };

  const data = parsed.data;

  await db
    .update(surveys)
    .set({
      title: data.title,
      description: data.description || null,
      eventId: data.eventId || null,
      status: data.status,
      opensAt: data.opensAt ? new Date(data.opensAt) : null,
      closesAt: data.closesAt ? new Date(data.closesAt) : null,
      updatedAt: new Date(),
    })
    .where(eq(surveys.id, parsedId.data));

  await db.delete(surveyQuestions).where(eq(surveyQuestions.surveyId, parsedId.data));

  if (data.questions.length > 0) {
    await db.insert(surveyQuestions).values(
      data.questions.map((q) => ({
        surveyId: parsedId.data,
        text: q.text,
        type: q.type,
        options: q.options?.length ? q.options : null,
        required: q.required,
        sortOrder: q.sortOrder,
      }))
    );
  }

  logAuditAsync({
    actorId: actor.id,
    action: "survey.updated",
    targetType: "survey",
    targetId: parsedId.data,
    newValues: { title: data.title },
  });

  revalidatePath("/admin/surveys");
  return { success: true };
}

export async function softDeleteSurvey(id: string) {
  const actor = await requireRole("moderator");

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid survey ID" };

  await db
    .update(surveys)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(surveys.id, parsedId.data));

  logAuditAsync({
    actorId: actor.id,
    action: "survey.deleted",
    targetType: "survey",
    targetId: parsedId.data,
  });

  revalidatePath("/admin/surveys");
  return { success: true };
}

export async function listSurveyResponses(surveyId: string) {
  await requireRole("moderator");

  const parsedId = uuidSchema.safeParse(surveyId);
  if (!parsedId.success) return [];

  const rows = await db
    .select({
      id: surveyResponses.id,
      answers: surveyResponses.answers,
      submittedAt: surveyResponses.submittedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(surveyResponses)
    .leftJoin(users, eq(surveyResponses.userId, users.id))
    .where(eq(surveyResponses.surveyId, parsedId.data))
    .orderBy(desc(surveyResponses.submittedAt));

  return rows;
}
