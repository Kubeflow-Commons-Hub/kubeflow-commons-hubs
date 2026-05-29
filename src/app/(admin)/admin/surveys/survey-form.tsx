"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSurveySchema, type CreateSurveyInput } from "@/lib/validations/surveys";
import { createSurvey, updateSurvey } from "@/lib/admin/surveys";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/admin/admin-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  surveyId?: string;
  initialValues?: CreateSurveyInput;
}

export function SurveyForm({ surveyId, initialValues }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateSurveyInput>({
    resolver: zodResolver(createSurveySchema),
    defaultValues: initialValues ?? {
      title: "",
      description: "",
      eventId: "",
      status: "draft",
      opensAt: "",
      closesAt: "",
      questions: [
        { id: crypto.randomUUID(), text: "", type: "short_text", options: [], required: true, sortOrder: 0 },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  function onSubmit(data: CreateSurveyInput) {
    const cleaned = {
      ...data,
      questions: data.questions.map((q, i) => ({ ...q, sortOrder: i })),
    };
    startTransition(async () => {
      const result = surveyId
        ? await updateSurvey(surveyId, cleaned)
        : await createSurvey(cleaned);

      if ("error" in result && typeof result.error === "string") {
        toast({ title: result.error, variant: "error" });
      } else {
        toast({ title: surveyId ? "Survey updated" : "Survey created" });
        router.push("/admin/surveys");
      }
    });
  }

  function addQuestion() {
    append({
      id: crypto.randomUUID(),
      text: "",
      type: "short_text",
      options: [],
      required: true,
      sortOrder: fields.length,
    });
  }

  function moveQuestion(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= fields.length) return;
    move(from, to);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Title" error={errors.title?.message}>
        <input
          {...register("title")}
          className="form-input"
          placeholder="Community Feedback Survey"
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          className="form-input min-h-[80px] resize-y"
          placeholder="Survey description..."
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Status" error={errors.status?.message}>
          <select {...register("status")} className="form-input">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </FormField>

        <FormField label="Event ID (optional)" error={errors.eventId?.message}>
          <input
            {...register("eventId")}
            className="form-input"
            placeholder="Leave empty if not linked"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Opens At (optional)" error={errors.opensAt?.message}>
          <input
            {...register("opensAt")}
            type="datetime-local"
            className="form-input"
          />
        </FormField>

        <FormField label="Closes At (optional)" error={errors.closesAt?.message}>
          <input
            {...register("closesAt")}
            type="datetime-local"
            className="form-input"
          />
        </FormField>
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Questions</h2>
          <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
            <Plus className="size-4" /> Add Question
          </Button>
        </div>

        {errors.questions?.message && (
          <p className="mb-4 text-xs text-red-400">{errors.questions.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <QuestionEditor
              key={field.id}
              index={index}
              register={register}
              watch={watch}
              errors={errors}
              onRemove={() => remove(index)}
              onMoveUp={() => moveQuestion(index, "up")}
              onMoveDown={() => moveQuestion(index, "down")}
              isFirst={index === 0}
              isLast={index === fields.length - 1}
              canRemove={fields.length > 1}
            />
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
          {pending
            ? "Saving..."
            : surveyId
              ? "Update Survey"
              : "Create Survey"}
        </Button>
      </div>
    </form>
  );
}

function QuestionEditor({
  index,
  register,
  watch,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  canRemove,
}: {
  index: number;
  register: ReturnType<typeof useForm<CreateSurveyInput>>["register"];
  watch: ReturnType<typeof useForm<CreateSurveyInput>>["watch"];
  errors: ReturnType<typeof useForm<CreateSurveyInput>>["formState"]["errors"];
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  canRemove: boolean;
}) {
  const questionType = watch(`questions.${index}.type`);
  const hasOptions = questionType === "single_choice" || questionType === "multi_choice";
  const [optionsText, setOptionsText] = useState(
    (watch(`questions.${index}.options`) ?? []).join("\n")
  );

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/30 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-0.5 pt-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
            aria-label="Move up"
          >
            <GripVertical className="size-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
            aria-label="Move down"
          >
            <GripVertical className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted">Q{index + 1}</span>
            <input type="hidden" {...register(`questions.${index}.id`)} />
            <input type="hidden" {...register(`questions.${index}.sortOrder`, { valueAsNumber: true })} value={index} />
          </div>

          <FormField
            label="Question Text"
            error={errors.questions?.[index]?.text?.message}
          >
            <input
              {...register(`questions.${index}.text`)}
              className="form-input"
              placeholder="Enter your question..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Type">
              <select
                {...register(`questions.${index}.type`)}
                className="form-input"
              >
                <option value="short_text">Short Text</option>
                <option value="long_text">Long Text</option>
                <option value="single_choice">Single Choice</option>
                <option value="multi_choice">Multi Choice</option>
              </select>
            </FormField>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer pb-2">
                <input
                  type="checkbox"
                  {...register(`questions.${index}.required`)}
                  className="rounded border-border"
                />
                Required
              </label>
            </div>
          </div>

          {hasOptions && (
            <FormField label="Options (one per line)">
              <textarea
                className="form-input min-h-[100px] resize-y"
                placeholder={"Option 1\nOption 2\nOption 3"}
                value={optionsText}
                onChange={(e) => {
                  setOptionsText(e.target.value);
                }}
                onBlur={(e) => {
                  const opts = e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const input = register(`questions.${index}.options`);
                  const nativeEvent = new Event("input", { bubbles: true });
                  Object.defineProperty(nativeEvent, "target", {
                    value: { name: input.name, value: opts },
                  });
                  input.onChange({
                    target: { name: input.name, value: opts },
                    type: "change",
                  });
                }}
              />
            </FormField>
          )}
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-text-muted hover:text-red-400 transition-colors p-1"
            aria-label="Remove question"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
