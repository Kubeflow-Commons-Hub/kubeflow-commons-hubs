"use client";

import { useState, useTransition } from "react";
import { submitSurveyResponse } from "@/lib/public/surveys";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  required: boolean;
  sortOrder: number;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
}

export function SurveyFormClient({ survey }: { survey: Survey }) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateAnswer(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMultiChoice(questionId: string, option: string) {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[] | undefined) ?? [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitSurveyResponse({
        surveyId: survey.id,
        answers,
      });

      if ("error" in result && typeof result.error === "string") {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border p-8 text-center space-y-3">
        <CheckCircle2 className="size-12 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-semibold text-text-primary">
          Thank you!
        </h2>
        <p className="text-text-secondary">
          Your response has been recorded.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {survey.questions.map((q, i) => (
        <div
          key={q.id}
          className="rounded-xl border border-border p-5 space-y-3"
        >
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-text-muted mt-0.5">
              {i + 1}.
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {q.text}
                {q.required && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </p>
            </div>
          </div>

          <div className="pl-6">
            {q.type === "short_text" && (
              <input
                type="text"
                className="form-input"
                placeholder="Your answer"
                value={(answers[q.id] as string) ?? ""}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                required={q.required}
              />
            )}

            {q.type === "long_text" && (
              <textarea
                className="form-input min-h-[100px] resize-y"
                placeholder="Your answer"
                value={(answers[q.id] as string) ?? ""}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                required={q.required}
              />
            )}

            {q.type === "single_choice" && q.options && (
              <div className="space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={option}
                      checked={(answers[q.id] as string) === option}
                      onChange={() => updateAnswer(q.id, option)}
                      className="accent-[var(--kf-blue)]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {q.type === "multi_choice" && q.options && (
              <div className="space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={((answers[q.id] as string[] | undefined) ?? []).includes(option)}
                      onChange={() => toggleMultiChoice(q.id, option)}
                      className="rounded border-border accent-[var(--kf-blue)]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Submit Response"}
        </Button>
      </div>
    </form>
  );
}
