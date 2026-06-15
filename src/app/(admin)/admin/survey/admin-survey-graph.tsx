"use client";

import { SurveyGraphView } from "@/components/survey/survey-graph-view";
import { getSurveyGraphData } from "@/lib/admin/survey";
import type { SurveyGraphPoint } from "@/lib/survey/graph";

interface AdminSurveyGraphProps {
  initialData: SurveyGraphPoint[];
}

export function AdminSurveyGraph({ initialData }: AdminSurveyGraphProps) {
  return (
    <SurveyGraphView
      initialData={initialData}
      title="Response Quadrant Graph"
      subtitle="Experience vs awareness across all survey submissions"
      onRefresh={getSurveyGraphData}
    />
  );
}
