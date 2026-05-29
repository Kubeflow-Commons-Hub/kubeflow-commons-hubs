"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createSurvey, updateSurvey } from "@/lib/admin/surveys";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/admin/admin-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { CreateSurveyInput, QuestionInput } from "@/lib/validations/surveys";

interface Props {
  surveyId?: string;
  initialValues?: CreateSurveyInput;
  events?: { id: string; title: string }[];
}

const QUESTION_TYPES = [
  { value: "short_text", label: "Short Answer" },
  { value: "long_text", label: "Long Answer" },
  { value: "single_choice", label: "Single Choice" },
  { value: "multi_choice", label: "Multiple Choice" },
] as const;

const DEFAULT_QUESTION: QuestionInput = {
  questionText: "",
  questionType: "short_text",
  options: [],
  isRequired: true,
  sortOrder: 0,
};

export function SurveyForm({ surveyId, initialValues, events = [] }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [status, setStatus] = useState<"draft" | "active" | "closed">(initialValues?.status ?? "draft");
  const [eventId, setEventId] = useState(initialValues?.eventId ?? "");
  const [opensAt, setOpensAt] = useState(initialValues?.opensAt ?? "");
  const [closesAt, setClosesAt] = useState(initialValues?.closesAt ?? "");
  const [questions, setQuestions] = useState<QuestionInput[]>(
    initialValues?.questions ?? [{ ...DEFAULT_QUESTION }]
  );

  function addQuestion() {
    setQuestions([...questions, { ...DEFAULT_QUESTION, sortOrder: questions.length }]);
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function updateQuestion(index: number, updates: Partial<QuestionInput>) {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setQuestions(updated);
  }

  function addOption(qIndex: number) {
    const q = questions[qIndex];
    updateQuestion(qIndex, { options: [...(q.options ?? []), ""] });
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    const q = questions[qIndex];
    const opts = [...(q.options ?? [])];
    opts[oIndex] = value;
    updateQuestion(qIndex, { options: opts });
  }

  function removeOption(qIndex: number, oIndex: number) {
    const q = questions[qIndex];
    updateQuestion(qIndex, {
      options: (q.options ?? []).filter((_, i) => i !== oIndex),
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim().length < 3) {
      toast({ title: "Title must be at least 3 characters", variant: "error" });
      return;
    }

    if (questions.some((q) => !q.questionText.trim())) {
      toast({ title: "All questions must have text", variant: "error" });
      return;
    }

    const payload: CreateSurveyInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      eventId: eventId || "",
      opensAt: opensAt || "",
      closesAt: closesAt || "",
      questions: questions.map((q, i) => ({
        ...q,
        questionText: q.questionText.trim(),
        sortOrder: i,
        options: q.options?.filter((o) => o.trim()),
      })),
    };

    startTransition(async () => {
      const result = surveyId
        ? await updateSurvey(surveyId, payload)
        : await createSurvey(payload);

      if ("error" in result && typeof result.error === "string") {
        toast({ title: result.error, variant: "error" });
      } else {
        toast({ title: surveyId ? "Survey updated" : "Survey created" });
        router.push("/admin/surveys");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Kubeflow Community Survey"
          required
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input min-h-[80px] resize-y"
          placeholder="Tell participants what this survey is about..."
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "active" | "closed")}
            className="form-input"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </FormField>

        <FormField label="Linked Event">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="form-input"
          >
            <option value="">None</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Opens At">
          <input
            type="datetime-local"
            value={opensAt}
            onChange={(e) => setOpensAt(e.target.value)}
            className="form-input"
          />
        </FormField>

        <FormField label="Closes At">
          <input
            type="datetime-local"
            value={closesAt}
            onChange={(e) => setClosesAt(e.target.value)}
            className="form-input"
          />
        </FormField>
      </div>

      {/* Questions Builder */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Questions</h2>
          <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
            <Plus className="size-4" /> Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="rounded-xl border border-border bg-bg-secondary p-4 space-y-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-0.5 pt-2">
                  <button
                    type="button"
                    onClick={() => moveQuestion(qi, -1)}
                    disabled={qi === 0}
                    className="text-text-muted hover:text-text-primary disabled:opacity-30"
                    title="Move up"
                  >
                    <GripVertical className="size-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <span className="text-sm font-medium text-text-muted pt-2 min-w-[24px]">
                      {qi + 1}.
                    </span>
                    <input
                      value={q.questionText}
                      onChange={(e) =>
                        updateQuestion(qi, { questionText: e.target.value })
                      }
                      className="form-input flex-1"
                      placeholder="Question text"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 ml-9">
                    <select
                      value={q.questionType}
                      onChange={(e) =>
                        updateQuestion(qi, {
                          questionType: e.target.value as QuestionInput["questionType"],
                          options:
                            e.target.value === "single_choice" ||
                            e.target.value === "multi_choice"
                              ? q.options?.length
                                ? q.options
                                : [""]
                              : [],
                        })
                      }
                      className="form-input w-44"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={q.isRequired}
                        onChange={(e) =>
                          updateQuestion(qi, { isRequired: e.target.checked })
                        }
                        className="rounded border-border"
                      />
                      Required
                    </label>
                  </div>

                  {(q.questionType === "single_choice" ||
                    q.questionType === "multi_choice") && (
                    <div className="ml-9 space-y-2">
                      <p className="text-xs font-medium text-text-muted">Options</p>
                      {(q.options ?? []).map((opt, oi) => (
                        <div key={oi} className="flex gap-2">
                          <input
                            value={opt}
                            onChange={(e) =>
                              updateOption(qi, oi, e.target.value)
                            }
                            className="form-input flex-1"
                            placeholder={`Option ${oi + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(qi, oi)}
                            className="text-text-muted hover:text-red-400"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addOption(qi)}
                        className="text-text-muted"
                      >
                        <Plus className="size-3.5" /> Add option
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qi)}
                  disabled={questions.length <= 1}
                  className="text-text-muted hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/surveys")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : surveyId ? "Update Survey" : "Create Survey"}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
