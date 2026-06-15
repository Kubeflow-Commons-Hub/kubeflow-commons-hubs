import { z } from "zod";

export const submitSurveySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address").max(200).optional().or(z.literal("")),
  experienceType: z.enum(["student", "professional"]),
  experienceLevel: z.string().min(1),
  experienceValue: z.number(),
  answers: z.record(z.string(), z.boolean()),
  awarenessScore: z.number().int().min(0).max(9),
});

export type SubmitSurveyInput = z.infer<typeof submitSurveySchema>;

export const updateSurveyConfigSchema = z.object({
  isEnabled: z.boolean(),
  customLinkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  customLinkLabel: z.string().max(200).optional().or(z.literal("")),
  showQrCode: z.boolean(),
  showGraph: z.boolean(),
});

export type UpdateSurveyConfigInput = z.infer<typeof updateSurveyConfigSchema>;
