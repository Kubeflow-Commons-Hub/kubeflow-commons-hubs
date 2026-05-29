import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSurveyByIdAdmin, getSurveyResponsesAdmin } from "@/lib/admin/surveys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const survey = await getSurveyByIdAdmin(id);
  return { title: survey ? `Responses: ${survey.title}` : "Survey Not Found" };
}

export default async function SurveyResponsesPage({ params }: Props) {
  const { id } = await params;
  const survey = await getSurveyByIdAdmin(id);

  if (!survey) notFound();

  const responses = await getSurveyResponsesAdmin(id);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Responses: {survey.title}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {responses.length} response{responses.length !== 1 ? "s" : ""} received
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/surveys/${id}`}>
            <ArrowLeft className="size-4" /> Back to Survey
          </Link>
        </Button>
      </div>

      {responses.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-secondary p-12 text-center">
          <p className="text-text-muted">No responses yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((resp, ri) => {
            const answers = resp.answers as Record<string, string | string[]>;
            return (
              <div
                key={resp.id}
                className="rounded-xl border border-border bg-bg-secondary p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">#{ri + 1}</Badge>
                    <span className="font-medium text-text-primary">
                      {resp.userName ?? "Unknown"}
                    </span>
                    <span className="text-sm text-text-muted">
                      {resp.userEmail}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(resp.createdAt).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="grid gap-3">
                  {survey.questions.map((q) => {
                    const answer = answers[q.id];
                    return (
                      <div key={q.id} className="text-sm">
                        <p className="font-medium text-text-secondary">
                          {q.questionText}
                        </p>
                        <p className="text-text-primary mt-0.5">
                          {Array.isArray(answer)
                            ? answer.join(", ") || "—"
                            : answer || "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
