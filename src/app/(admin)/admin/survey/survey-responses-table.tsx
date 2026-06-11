"use client";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

interface SurveyResponse {
  id: string;
  name: string;
  email: string | null;
  experienceType: string;
  experienceLevel: string;
  experienceValue: number;
  answers: Record<string, boolean>;
  awarenessScore: number;
  createdAt: Date;
}

interface SurveyResponsesTableProps {
  rows: SurveyResponse[];
}

export function SurveyResponsesTable({ rows }: SurveyResponsesTableProps) {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-muted">
        No responses yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-4 font-semibold text-text-muted">Name</th>
            <th className="pb-3 pr-4 font-semibold text-text-muted">Email</th>
            <th className="pb-3 pr-4 font-semibold text-text-muted">
              Experience
            </th>
            <th className="pb-3 pr-4 font-semibold text-text-muted">
              Awareness
            </th>
            <th className="pb-3 font-semibold text-text-muted">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border/50 last:border-0"
            >
              <td className="py-3 pr-4 font-medium text-text-primary">
                {row.name}
              </td>
              <td className="py-3 pr-4 text-text-secondary">{row.email}</td>
              <td className="py-3 pr-4">
                <span className="inline-flex items-center rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                  {row.experienceLevel}
                </span>
              </td>
              <td className="py-3 pr-4 tabular-nums text-text-secondary">
                {row.awarenessScore}/9
              </td>
              <td className="py-3 text-text-muted">
                {timeAgo(row.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
