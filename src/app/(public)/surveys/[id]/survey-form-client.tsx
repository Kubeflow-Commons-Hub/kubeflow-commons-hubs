"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitSurveyResponse } from "@/lib/surveys/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  isRequired: boolean;
  sortOrder: number;
}

interface Props {
  surveyId: string;
  questions: Question[];
}

export function SurveyFormClient({ surveyId, questions }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function setAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMultiChoice(questionId: string, option: string) {
    const current = (answers[questionId] as string[] | undefined) ?? [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswer(questionId, updated);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitSurveyResponse({ surveyId, answers });

      if ("error" in result && typeof result.error === "string") {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center space-y-4">
        <CheckCircle2 className="size-12 text-green-500 mx-auto" />
        <p className="text-lg font-medium text-text-primary">
          Thank you for your response!
        </p>
        <p className="text-text-secondary">
          Your survey submission has been recorded.
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {questions.map((q, i) => (
        <div
          key={q.id}
          className="rounded-xl border border-border bg-bg-secondary p-5 space-y-3"
        >
          <p className="font-medium text-text-primary">
            <span className="text-text-muted mr-2">{i + 1}.</span>
            {q.questionText}
            {q.isRequired && <span className="text-red-400 ml-1">*</span>}
          </p>

          {q.questionType === "short_text" && (
            <input
              type="text"
              value={(answers[q.id] as string) ?? ""}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              className="form-input"
              placeholder="Your answer"
              required={q.isRequired}
            />
          )}

          {q.questionType === "long_text" && (
            <textarea
              value={(answers[q.id] as string) ?? ""}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              className="form-input min-h-[100px] resize-y"
              placeholder="Your answer"
              required={q.isRequired}
            />
          )}

          {q.questionType === "single_choice" && (
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-bg-tertiary/50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={(answers[q.id] as string) === opt}
                    onChange={() => setAnswer(q.id, opt)}
                    className="accent-[var(--kf-blue)]"
                    required={q.isRequired}
                  />
                  <span className="text-sm text-text-secondary">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.questionType === "multi_choice" && (
            <div className="space-y-2">
              {q.options.map((opt) => {
                const selected = (
                  (answers[q.id] as string[] | undefined) ?? []
                ).includes(opt);
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-bg-tertiary/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMultiChoice(q.id, opt)}
                      className="rounded border-border accent-[var(--kf-blue)]"
                    />
                    <span className="text-sm text-text-secondary">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={pending} variant="gradient">
          {pending ? "Submitting..." : "Submit Response"}
        </Button>
      </div>
    </form>
  );
}
