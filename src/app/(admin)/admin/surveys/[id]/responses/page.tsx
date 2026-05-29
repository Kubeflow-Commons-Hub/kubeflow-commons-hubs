import { notFound } from "next/navigation";
import { getSurveyById, listSurveyResponses } from "@/lib/admin/surveys";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const survey = await getSurveyById(id);
  return { title: survey ? `Responses: ${survey.title}` : "Survey Not Found" };
}

export default async function SurveyResponsesPage({ params }: Props) {
  const { id } = await params;
  const survey = await getSurveyById(id);
  if (!survey) notFound();

  const responses = await listSurveyResponses(id);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/surveys/${id}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Responses</h1>
          <p className="text-sm text-text-muted mt-1">
            {survey.title} — {responses.length} response{responses.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-text-muted">
          No responses yet.
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <div
              key={response.id}
              className="rounded-xl border border-border bg-bg-secondary/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary">
                  {response.userName || "Anonymous"}
                </span>
                <span className="text-text-muted">
                  {new Date(response.submittedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              {response.userEmail && (
                <p className="text-xs text-text-muted">{response.userEmail}</p>
              )}
              <div className="border-t border-border pt-3 space-y-2">
                {survey.questions.map((q) => {
                  const answers = response.answers as Record<string, string | string[]>;
                  const answer = answers[q.id];
                  return (
                    <div key={q.id} className="text-sm">
                      <p className="font-medium text-text-secondary">{q.text}</p>
                      <p className="text-text-primary mt-0.5">
                        {Array.isArray(answer)
                          ? answer.join(", ")
                          : answer || <span className="text-text-muted italic">No answer</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
