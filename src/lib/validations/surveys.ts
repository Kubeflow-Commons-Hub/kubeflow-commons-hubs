import { z } from "zod";

const questionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["short_text", "long_text", "single_choice", "multi_choice"]),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const createSurveySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  eventId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["draft", "active", "closed"]),
  opensAt: z.string().optional(),
  closesAt: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
export type QuestionInput = z.infer<typeof questionSchema>;

export const submitSurveySchema = z.object({
  surveyId: z.string().uuid(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export type SubmitSurveyInput = z.infer<typeof submitSurveySchema>;
