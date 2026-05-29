import { z } from "zod";

const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required").max(500),
  questionType: z.enum(["short_text", "long_text", "single_choice", "multi_choice"]),
  options: z.array(z.string().min(1)).optional(),
  isRequired: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const createSurveySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["draft", "active", "closed"]),
  eventId: z.string().uuid().optional().or(z.literal("")),
  opensAt: z.string().optional().or(z.literal("")),
  closesAt: z.string().optional().or(z.literal("")),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export const submitSurveySchema = z.object({
  surveyId: z.string().uuid(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type SubmitSurveyInput = z.infer<typeof submitSurveySchema>;
