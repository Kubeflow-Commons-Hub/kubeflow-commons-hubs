import { SurveyForm } from "../survey-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin: Create Survey" };

export default function NewSurveyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create Survey</h1>
        <p className="text-sm text-text-muted mt-1">
          Design a new survey with custom questions.
        </p>
      </div>
      <SurveyForm />
    </div>
  );
}
