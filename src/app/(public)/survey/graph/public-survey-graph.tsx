"use client";

import { SurveyGraphView } from "@/components/survey/survey-graph-view";
import { getPublicSurveyGraphData } from "@/lib/survey/actions";
import type { SurveyGraphPoint } from "@/lib/survey/graph";

interface PublicSurveyGraphProps {
  initialData: SurveyGraphPoint[];
}

export function PublicSurveyGraph({ initialData }: PublicSurveyGraphProps) {
  return (
    <SurveyGraphView
      initialData={initialData}
      title="Community Quadrant Graph"
      showLiveBadge
      onRefresh={async () => {
        const result = await getPublicSurveyGraphData();
        if (!result.data) {
          throw new Error(result.error ?? "Graph is not available");
        }
        return result.data;
      }}
    />
  );
}
