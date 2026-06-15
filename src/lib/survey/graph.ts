import { QUADRANT_CENTER_X, QUADRANT_CENTER_Y } from "./constants";

export type SurveyGraphPoint = {
  name: string;
  email: string | null;
  experienceValue: number;
  awarenessScore: number;
};

export type SurveyGraphStats = {
  total: number;
  tl: number;
  tr: number;
  bl: number;
  br: number;
};

export function computeSurveyGraphStats(
  responses: SurveyGraphPoint[]
): SurveyGraphStats {
  return {
    total: responses.length,
    tl: responses.filter(
      (r) => r.experienceValue <= QUADRANT_CENTER_X && r.awarenessScore >= QUADRANT_CENTER_Y
    ).length,
    tr: responses.filter(
      (r) => r.experienceValue > QUADRANT_CENTER_X && r.awarenessScore >= QUADRANT_CENTER_Y
    ).length,
    bl: responses.filter(
      (r) => r.experienceValue <= QUADRANT_CENTER_X && r.awarenessScore < QUADRANT_CENTER_Y
    ).length,
    br: responses.filter(
      (r) => r.experienceValue > QUADRANT_CENTER_X && r.awarenessScore < QUADRANT_CENTER_Y
    ).length,
  };
}

export function matchGraphSearch(
  responses: SurveyGraphPoint[],
  search: string
): Set<string> {
  if (!search.trim()) return new Set();
  const q = search.trim().toLowerCase();
  return new Set(
    responses
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.email?.toLowerCase().includes(q) ?? false)
      )
      .map((r) => r.email || r.name)
  );
}
