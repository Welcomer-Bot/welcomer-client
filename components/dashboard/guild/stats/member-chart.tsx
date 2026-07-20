"use client";

import Chart from "chart.js/auto";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import type { MemberPoint } from "@/lib/utils";

/**
 * Member count over time.
 *
 * `series` already covers every day of the selected window, with null on days
 * that have no snapshot — so labels and values line up index for index.
 */
export default function MemberChart({ series }: { series: MemberPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const known = series.filter((p) => p.memberCount !== null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: series.map((p) => p.date),
        datasets: [
          {
            label: "Members",
            data: series.map((p) => p.memberCount),
            tension: 0.3,
            spanGaps: true,
            
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });

    return () => chart.destroy();
  }, [series, resolvedTheme]);

  if (known.length < 2) {
    return (
      <div className="flex h-[180px] items-center justify-center rounded-large border border-dashed border-default-200">
        <p className="text-small text-default-400">
          Not enough history yet — the daily snapshot needs a couple of days to
          build a curve.
        </p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Member count from ${known[0].date} to ${known[known.length - 1].date}, ${known[0].memberCount?.toLocaleString()} to ${known[known.length - 1].memberCount?.toLocaleString()} members`}
      className="text-primary"
      role="img"
    />
  );
}
