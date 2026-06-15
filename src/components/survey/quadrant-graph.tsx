"use client";

import { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { QUADRANT_CENTER_X, QUADRANT_CENTER_Y } from "@/lib/survey/constants";
import type { SurveyGraphPoint } from "@/lib/survey/graph";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const quadrantPlugin = {
  id: "quadrantBackground",
  beforeDraw(chart: ChartJS) {
    const {
      ctx,
      chartArea: { left, top, right, bottom },
      scales: { x, y },
    } = chart;

    const centerX = x.getPixelForValue(QUADRANT_CENTER_X);
    const centerY = y.getPixelForValue(QUADRANT_CENTER_Y);

    const quadrants = [
      { x1: left, y1: top, x2: centerX, y2: centerY, color: "rgba(251, 146, 60, 0.12)" },
      { x1: centerX, y1: top, x2: right, y2: centerY, color: "rgba(20, 184, 166, 0.12)" },
      { x1: left, y1: centerY, x2: centerX, y2: bottom, color: "rgba(244, 63, 94, 0.09)" },
      { x1: centerX, y1: centerY, x2: right, y2: bottom, color: "rgba(56, 189, 248, 0.10)" },
    ];

    quadrants.forEach(({ x1, y1, x2, y2, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    });

    ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(centerX, top);
    ctx.lineTo(centerX, bottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(left, centerY);
    ctx.lineTo(right, centerY);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.font = "700 10px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";

    const padX = 60;
    const padY = 18;

    ctx.fillStyle = "rgba(234, 88, 12, 0.55)";
    ctx.fillText("AWARE · STUDENT", (left + centerX) / 2 + padX, top + padY);

    ctx.fillStyle = "rgba(13, 148, 136, 0.55)";
    ctx.fillText("AWARE · PRO", (centerX + right) / 2 - padX, top + padY);

    ctx.fillStyle = "rgba(225, 29, 72, 0.45)";
    ctx.fillText("UNAWARE · STUDENT", (left + centerX) / 2 + padX, bottom - padY + 2);

    ctx.fillStyle = "rgba(2, 132, 199, 0.5)";
    ctx.fillText("UNAWARE · PRO", (centerX + right) / 2 - padX, bottom - padY + 2);
  },
};

ChartJS.register(quadrantPlugin);

function getPointColor(origX: number, origY: number) {
  if (origX <= QUADRANT_CENTER_X && origY >= QUADRANT_CENTER_Y) {
    return "rgba(249, 115, 22, 0.92)";
  }
  if (origX > QUADRANT_CENTER_X && origY >= QUADRANT_CENTER_Y) {
    return "rgba(20, 184, 166, 0.92)";
  }
  if (origX <= QUADRANT_CENTER_X && origY < QUADRANT_CENTER_Y) {
    return "rgba(244, 63, 94, 0.88)";
  }
  return "rgba(14, 165, 233, 0.9)";
}

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    return ((h >>> 0) / 4294967296) - 0.5;
  };
}

interface QuadrantGraphProps {
  responses: SurveyGraphPoint[];
  highlightedNames?: Set<string>;
}

export function QuadrantGraph({
  responses,
  highlightedNames = new Set(),
}: QuadrantGraphProps) {
  const hasHighlight = highlightedNames.size > 0;

  const chartData = useMemo(() => {
    const points = responses.map((r) => {
      const key = r.email || r.name;
      const rng = seededRandom(key);
      const jitterX = rng() * 0.6;
      const jitterY = rng() * 0.6;
      const jX = Math.max(0.5, Math.min(9.5, r.experienceValue + jitterX));
      const jY = Math.max(-0.3, Math.min(9.3, r.awarenessScore + jitterY));
      const isHighlighted = highlightedNames.has(key);
      return {
        x: jX,
        y: jY,
        origX: r.experienceValue,
        origY: r.awarenessScore,
        name: r.name,
        email: r.email,
        isHighlighted,
      };
    });

    return {
      datasets: [
        {
          label: "Participants",
          data: points,
          pointBackgroundColor: points.map((p) => {
            if (!hasHighlight) return getPointColor(p.origX, p.origY);
            return p.isHighlighted ? "#2563eb" : "rgba(203, 213, 225, 0.2)";
          }),
          pointBorderColor: points.map((p) => {
            if (!hasHighlight) return "rgba(255,255,255,0.95)";
            return p.isHighlighted ? "#1e3a8a" : "transparent";
          }),
          pointRadius: points.map((p) => {
            if (!hasHighlight) return 7;
            return p.isHighlighted ? 12 : 4;
          }),
          pointHoverRadius: points.map((p) => (p.isHighlighted ? 15 : 10)),
          pointBorderWidth: points.map((p) => {
            if (!hasHighlight) return 2;
            return p.isHighlighted ? 3 : 0;
          }),
        },
      ],
    };
  }, [responses, highlightedNames, hasHighlight]);

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 14, right: 14, bottom: 8, left: 8 },
    },
    clip: false as const,
    scales: {
      x: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: "← Students    |    Professionals →",
          color: "#2563eb",
          font: { size: 12, weight: "bold", family: "Inter, system-ui, sans-serif" },
          padding: { top: 12 },
        },
        ticks: { display: false },
        grid: { color: "rgba(59, 130, 246, 0.06)" },
        border: { color: "rgba(59, 130, 246, 0.12)" },
      },
      y: {
        min: -0.5,
        max: 9.5,
        title: {
          display: true,
          text: "↑ Awareness Score",
          color: "#2563eb",
          font: { size: 12, weight: "bold", family: "Inter, system-ui, sans-serif" },
          padding: { bottom: 12 },
        },
        ticks: { display: false },
        grid: { color: "rgba(59, 130, 246, 0.06)" },
        border: { color: "rgba(59, 130, 246, 0.12)" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f0f9ff",
        bodyColor: "#93c5fd",
        titleFont: { size: 13, weight: "bold", family: "Inter, system-ui, sans-serif" },
        bodyFont: { size: 12, family: "Inter, system-ui, sans-serif" },
        padding: { top: 10, right: 14, bottom: 10, left: 14 },
        cornerRadius: 12,
        boxPadding: 4,
        callbacks: {
          title: (items) => {
            const point = items[0]?.raw as { name?: string } | undefined;
            return point?.name || "Unknown";
          },
          label: (item) => {
            const point = item.raw as { origX: number; origY: number };
            return [
              `Experience: ${point.origX}`,
              `Awareness: ${point.origY}/9`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Scatter data={chartData} options={options} />
    </div>
  );
}
