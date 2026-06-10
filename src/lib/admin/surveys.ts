"use server";

import { db } from "@/db";
import { surveys, surveyQuestions, surveyResponses, events, users } from "@/db/schema";
import { eq, desc, ilike, count, and } from "drizzle-orm";
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

export async function listSurveysAdmin({
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

  if (status && ["draft", "active", "closed"].includes(status)) {
    conditions.push(eq(surveys.status, status as typeof surveys.status.enumValues[number]));
  }

  if (safeSearch) {
    conditions.push(ilike(surveys.title, `%${safeSearch}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const respCount = db
    .select({
      surveyId: surveyResponses.surveyId,
      count: count().as("resp_count"),
    })
    .from(surveyResponses)
    .groupBy(surveyResponses.surveyId)
    .as("resp_counts");

  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: surveys.id,
        title: surveys.title,
        status: surveys.status,
        opensAt: surveys.opensAt,
        closesAt: surveys.closesAt,
        createdAt: surveys.createdAt,
        eventTitle: events.title,
        responseCount: respCount.count,
      })
      .from(surveys)
      .leftJoin(events, eq(surveys.eventId, events.id))
      .leftJoin(respCount, eq(surveys.id, respCount.surveyId))
      .where(where)
      .orderBy(desc(surveys.createdAt))
      .limit(safePageSize)
      .offset((safePage - 1) * safePageSize),
    db.select({ value: count() }).from(surveys).where(where),
  ]);

  return { rows, totalCount: total?.value ?? 0 };
}

export async function getSurveyByIdAdmin(id: string) {
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
    .where(eq(surveyQuestions.surveyId, survey.id))
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
      status: data.status,
      eventId: data.eventId || null,
      opensAt: data.opensAt ? new Date(data.opensAt) : null,
      closesAt: data.closesAt ? new Date(data.closesAt) : null,
      createdBy: actor.id,
    })
    .returning({ id: surveys.id });

  if (created && data.questions.length > 0) {
    await db.insert(surveyQuestions).values(
      data.questions.map((q, i) => ({
        surveyId: created.id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options?.length ? q.options : null,
        isRequired: q.isRequired,
        sortOrder: i,
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
  if (!parsedId.success) return { error: "Invalid Survey ID" };

  const parsed = createSurveySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const data = parsed.data;
  await db
    .update(surveys)
    .set({
      title: data.title,
      description: data.description || null,
      status: data.status,
      eventId: data.eventId || null,
      opensAt: data.opensAt ? new Date(data.opensAt) : null,
      closesAt: data.closesAt ? new Date(data.closesAt) : null,
      updatedAt: new Date(),
    })
    .where(eq(surveys.id, parsedId.data));

  const existingQuestions = await db
    .select({ id: surveyQuestions.id })
    .from(surveyQuestions)
    .where(eq(surveyQuestions.surveyId, parsedId.data));

  const incomingIds = new Set(data.questions.map((q) => q.id).filter(Boolean));
  const idsToDelete = existingQuestions
    .filter((existing) => !incomingIds.has(existing.id))
    .map((existing) => existing.id);

  if (idsToDelete.length > 0) {
    for (const qid of idsToDelete) {
      await db.delete(surveyQuestions).where(eq(surveyQuestions.id, qid));
    }
  }

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const values = {
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options?.length ? q.options : null,
      isRequired: q.isRequired,
      sortOrder: i,
    };

    if (q.id && incomingIds.has(q.id)) {
      await db
        .update(surveyQuestions)
        .set(values)
        .where(eq(surveyQuestions.id, q.id));
    } else {
      await db.insert(surveyQuestions).values({
        surveyId: parsedId.data,
        ...values,
      });
    }
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

export async function deleteSurvey(id: string) {
  const actor = await requireRole("admin");

  const parsedId = uuidSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid Survey ID" };

  await db.delete(surveys).where(eq(surveys.id, parsedId.data));

  logAuditAsync({
    actorId: actor.id,
    action: "survey.deleted",
    targetType: "survey",
    targetId: parsedId.data,
  });

  revalidatePath("/admin/surveys");
  return { success: true };
}

export async function getSurveyResponsesAdmin(surveyId: string) {
  await requireRole("moderator");

  const parsed = uuidSchema.safeParse(surveyId);
  if (!parsed.success) return [];

  const rows = await db
    .select({
      id: surveyResponses.id,
      answers: surveyResponses.answers,
      createdAt: surveyResponses.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(surveyResponses)
    .leftJoin(users, eq(surveyResponses.userId, users.id))
    .where(eq(surveyResponses.surveyId, parsed.data))
    .orderBy(desc(surveyResponses.createdAt));

  return rows;
}
