"use server";

import { db } from "@/db";
import { surveyConfig, surveyResponses } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";
import { logAuditAsync } from "./audit-helper";
import { revalidatePath } from "next/cache";
import {
  updateSurveyConfigSchema,
  type UpdateSurveyConfigInput,
} from "@/lib/validations/survey";
import type { SurveyGraphPoint } from "@/lib/survey/graph";

export async function getAdminSurveyConfig() {
  await requireRole("moderator");
  try {
    const [config] = await db.select().from(surveyConfig).limit(1);
    return config ?? null;
  } catch {
    return null;
  }
}

export async function updateSurveyConfig(input: UpdateSurveyConfigInput) {
  const actor = await requireRole("moderator");

  const parsed = updateSurveyConfigSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;

  try {
    const [existing] = await db.select().from(surveyConfig).limit(1);

    if (existing) {
      await db
        .update(surveyConfig)
        .set({
          isEnabled: data.isEnabled,
          customLinkUrl: data.customLinkUrl || null,
          customLinkLabel: data.customLinkLabel || null,
          showQrCode: data.showQrCode,
          showGraph: data.showGraph,
          updatedBy: actor.id,
          updatedAt: new Date(),
        })
        .where(eq(surveyConfig.id, existing.id));

      logAuditAsync({
        actorId: actor.id,
        action: "survey_config.updated",
        targetType: "survey_config",
        targetId: existing.id,
        oldValues: {
          isEnabled: existing.isEnabled,
          customLinkUrl: existing.customLinkUrl,
          showQrCode: existing.showQrCode,
          showGraph: existing.showGraph,
        },
        newValues: {
          isEnabled: data.isEnabled,
          customLinkUrl: data.customLinkUrl,
          showQrCode: data.showQrCode,
          showGraph: data.showGraph,
        },
      });
    } else {
      const [created] = await db
        .insert(surveyConfig)
        .values({
          isEnabled: data.isEnabled,
          customLinkUrl: data.customLinkUrl || null,
          customLinkLabel: data.customLinkLabel || null,
          showQrCode: data.showQrCode,
          showGraph: data.showGraph,
          updatedBy: actor.id,
        })
        .returning({ id: surveyConfig.id });

      logAuditAsync({
        actorId: actor.id,
        action: "survey_config.created",
        targetType: "survey_config",
        targetId: created?.id,
        newValues: {
          isEnabled: data.isEnabled,
          customLinkUrl: data.customLinkUrl,
          showQrCode: data.showQrCode,
          showGraph: data.showGraph,
        },
      });
    }
  } catch {
    return { error: "Survey tables not found. Run the migration: supabase/migrations/00006_survey.sql" };
  }

  revalidatePath("/admin/survey");
  revalidatePath("/survey");
  revalidatePath("/survey/graph");
  return { success: true };
}

export async function getSurveyGraphData(): Promise<SurveyGraphPoint[]> {
  await requireRole("moderator");

  try {
    const rows = await db
      .select({
        name: surveyResponses.name,
        email: surveyResponses.email,
        experienceValue: surveyResponses.experienceValue,
        awarenessScore: surveyResponses.awarenessScore,
      })
      .from(surveyResponses)
      .orderBy(desc(surveyResponses.createdAt));

    return rows;
  } catch {
    return [];
  }
}

interface ListResponsesParams {
  page?: number;
  pageSize?: number;
}

export async function listSurveyResponses({
  page = 1,
  pageSize = 25,
}: ListResponsesParams = {}) {
  await requireRole("moderator");

  try {
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));

    const [rows, [total]] = await Promise.all([
      db
        .select()
        .from(surveyResponses)
        .orderBy(desc(surveyResponses.createdAt))
        .limit(safePageSize)
        .offset((safePage - 1) * safePageSize),
      db.select({ value: count() }).from(surveyResponses),
    ]);

    return { rows, totalCount: total?.value ?? 0 };
  } catch {
    return { rows: [], totalCount: 0 };
  }
}

export async function getSurveyStats() {
  await requireRole("moderator");

  try {
    const [total] = await db.select({ value: count() }).from(surveyResponses);
    return { totalResponses: total?.value ?? 0 };
  } catch {
    return { totalResponses: 0 };
  }
}
