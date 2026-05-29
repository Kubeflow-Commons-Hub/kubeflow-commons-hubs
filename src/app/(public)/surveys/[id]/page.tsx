import { notFound } from "next/navigation";
import { getPublicSurvey, hasUserRespondedToSurvey } from "@/lib/public/surveys";
import { getCurrentUser } from "@/lib/auth/guards";
import { SurveyFormClient } from "./survey-form-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const survey = await getPublicSurvey(id);
  return {
    title: survey ? survey.title : "Survey Not Found",
    description: survey?.description || undefined,
  };
}

export default async function PublicSurveyPage({ params }: Props) {
  const { id } = await params;
  const survey = await getPublicSurvey(id);

  if (!survey) notFound();

  const currentUser = await getCurrentUser();
  const alreadyResponded = currentUser
    ? await hasUserRespondedToSurvey(id, currentUser.authUser.id)
    : false;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">{survey.title}</h1>
        {survey.description && (
          <p className="text-text-secondary mt-2">{survey.description}</p>
        )}
      </div>

      {!currentUser ? (
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="text-text-secondary mb-4">
            Please sign in to submit your response.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--kf-blue)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--kf-blue)]/90 transition-colors"
          >
            Sign In
          </a>
        </div>
      ) : alreadyResponded ? (
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="text-text-secondary">
            You have already submitted a response to this survey. Thank you!
          </p>
        </div>
      ) : (
        <SurveyFormClient survey={survey} />
      )}
    </div>
  );
}
