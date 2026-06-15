import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublicSurveyGraphData, getSurveyConfig } from "@/lib/survey/actions";
import { PublicSurveyGraph } from "./public-survey-graph";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Survey Graph | Kubeflow Commons Hub",
  description: "Live quadrant graph of community survey responses.",
};

export default async function SurveyGraphPage() {
  const config = await getSurveyConfig();

  if (!config?.isEnabled || !config.showGraph) {
    redirect("/survey");
  }

  const { data } = await getPublicSurveyGraphData();

  return (
    <div className="px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/survey"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Survey
        </Link>

        <PublicSurveyGraph initialData={data ?? []} />
      </div>
    </div>
  );
}
