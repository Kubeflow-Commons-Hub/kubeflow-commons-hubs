import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import { getPublicSurvey, getUserSurveyResponse } from "@/lib/surveys/actions";
import { createClient } from "@/lib/supabase/server";
import { SurveyFormClient } from "./survey-form-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const survey = await getPublicSurvey(id);

  if (!survey) {
    return { title: "Survey Not Found" };
  }

  return {
    title: survey.title,
    description: survey.description ?? "Take this survey",
    openGraph: {
      title: survey.title,
      description: survey.description ?? "Take this survey",
      url: `${SITE_URL}/surveys/${survey.id}`,
      type: "website",
    },
  };
}

export default async function PublicSurveyPage({ params }: PageProps) {
  const { id } = await params;
  const survey = await getPublicSurvey(id);

  if (!survey) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadySubmitted = false;
  if (user) {
    try {
      const existing = await getUserSurveyResponse(survey.id);
      alreadySubmitted = !!existing;
    } catch {
      // not authenticated
    }
  }

  const questions = survey.questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    questionType: q.questionType,
    options: (q.options as string[] | null) ?? [],
    isRequired: q.isRequired,
    sortOrder: q.sortOrder,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-text-muted">
          <li>
            <Link href="/" className="hover:text-text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-text-muted">
            /
          </li>
          <li className="text-text-secondary truncate" aria-current="page">
            Survey
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          {survey.title}
        </h1>
        {survey.description && (
          <p className="text-text-secondary text-lg">{survey.description}</p>
        )}
      </div>

      {!user ? (
        <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center space-y-4">
          <p className="text-text-secondary">
            Please sign in to submit your response.
          </p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      ) : alreadySubmitted ? (
        <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center space-y-4">
          <p className="text-lg font-medium text-text-primary">
            Thank you for your response!
          </p>
          <p className="text-text-secondary">
            You have already submitted a response to this survey.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
          </Button>
        </div>
      ) : (
        <SurveyFormClient surveyId={survey.id} questions={questions} />
      )}
    </div>
  );
}
