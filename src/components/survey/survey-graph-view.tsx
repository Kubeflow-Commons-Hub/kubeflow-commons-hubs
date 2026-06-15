"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Search, X } from "lucide-react";
import { QuadrantGraph } from "@/components/survey/quadrant-graph";
import {
  computeSurveyGraphStats,
  matchGraphSearch,
  type SurveyGraphPoint,
} from "@/lib/survey/graph";
import { cn } from "@/lib/utils";

const REFRESH_INTERVAL = 2 * 60 * 1000;

const STAT_CARDS = [
  {
    key: "total" as const,
    label: "Total",
    bg: "bg-[var(--kf-blue)]/10",
    text: "text-[var(--kf-blue)]",
    border: "border-[var(--kf-blue)]/20",
  },
  {
    key: "tr" as const,
    label: "Pro + Aware",
    bg: "bg-teal-500/10",
    text: "text-teal-600",
    border: "border-teal-500/20",
  },
  {
    key: "tl" as const,
    label: "Student + Aware",
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    border: "border-orange-500/20",
  },
  {
    key: "br" as const,
    label: "Pro + Unaware",
    bg: "bg-sky-500/10",
    text: "text-sky-600",
    border: "border-sky-500/20",
  },
  {
    key: "bl" as const,
    label: "Student + Unaware",
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    border: "border-rose-500/20",
  },
];

const LEGEND = [
  { color: "bg-teal-500", label: "Professional + Aware" },
  { color: "bg-orange-500", label: "Student + Aware" },
  { color: "bg-sky-500", label: "Professional + Unaware" },
  { color: "bg-rose-500", label: "Student + Unaware" },
];

interface SurveyGraphViewProps {
  initialData: SurveyGraphPoint[];
  title?: string;
  subtitle?: string;
  showLiveBadge?: boolean;
  onRefresh?: () => Promise<SurveyGraphPoint[]>;
  className?: string;
}

export function SurveyGraphView({
  initialData,
  title = "Quadrant Graph",
  subtitle,
  showLiveBadge = false,
  onRefresh,
  className,
}: SurveyGraphViewProps) {
  const [responses, setResponses] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setLastUpdated(new Date());
    }
  }, []);

  const highlightedNames = useMemo(
    () => matchGraphSearch(responses, search),
    [search, responses]
  );

  const stats = useMemo(() => computeSurveyGraphStats(responses), [responses]);

  const loadData = useCallback(
    async (showLoader = false) => {
      if (!onRefresh) return;
      if (showLoader) setLoading(true);
      setError("");
      try {
        const data = await onRefresh();
        setResponses(data);
        setLastUpdated(new Date());
      } catch {
        setError("Failed to load graph data.");
      } finally {
        setLoading(false);
      }
    },
    [onRefresh]
  );

  useEffect(() => {
    if (!onRefresh) return;
    const interval = setInterval(() => loadData(false), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData, onRefresh]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {showLiveBadge && (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[var(--kf-blue)]/10 px-3 py-1 ring-1 ring-[var(--kf-blue)]/20">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-[var(--kf-blue)]">
                Live
              </span>
            </div>
          )}
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {subtitle ??
              (lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}${onRefresh ? " · Auto-refreshes every 2 min" : ""}`
                : "Loading...")}
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg-tertiary disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STAT_CARDS.map((s) => (
          <div
            key={s.key}
            className={cn(
              "rounded-2xl border bg-bg-secondary p-4 shadow-sm",
              s.border
            )}
          >
            <p className="text-[11px] font-medium text-text-muted">{s.label}</p>
            <p
              className={cn(
                "mt-1 text-2xl font-extrabold tabular-nums",
                s.text
              )}
            >
              {stats[s.key]}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="size-4 text-text-muted" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name to highlight on graph..."
          aria-label="Search participants"
          className="form-input w-full py-3 pl-11 pr-10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted transition-colors hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {search.trim() && (
        <p className="-mt-4 pl-1 text-xs text-text-muted">
          {highlightedNames.size === 0
            ? "No matches found"
            : `${highlightedNames.size} match${highlightedNames.size > 1 ? "es" : ""} highlighted`}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl border border-border bg-bg-secondary shadow-lg">
        <div className="p-5 sm:p-6">
          {loading && responses.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-7 animate-spin text-[var(--kf-blue)]" />
                <p className="text-sm text-text-muted">Loading data...</p>
              </div>
            </div>
          ) : responses.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-text-primary">
                  No responses yet
                </p>
                <p className="text-xs text-text-muted">
                  Data will appear as people submit the survey.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[400px] sm:h-[500px] lg:h-[580px]">
              <QuadrantGraph
                responses={responses}
                highlightedNames={highlightedNames}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {LEGEND.map(({ color, label }) => (
          <span
            key={label}
            className="flex items-center gap-2 text-xs font-medium text-text-muted"
          >
            <span className={cn("h-3 w-3 rounded-full shadow-sm", color)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
