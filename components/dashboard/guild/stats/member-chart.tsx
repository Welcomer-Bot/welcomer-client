"use client";

import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import type { MemberPoint } from "@/lib/utils";

// Register only what this line chart actually needs (see options below):
// - LineController: `type: "line"`
// - LineElement / PointElement: line segments and data point markers
// - CategoryScale / LinearScale: default x/y scale types for a line chart
//   with string labels and numeric values (no `options.scales` override here)
// - Tooltip: default hover tooltip (no `plugins.tooltip` override, but active
//   by default and previously enabled via "chart.js/auto")
// Legend is intentionally NOT registered: `plugins.legend.display` is false,
// so the rendered output is identical with or without the plugin.
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

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

    // ponytail: `text-primary` (on the canvas below) resolves to HeroUI's
    // current accent color; reading it back via getComputedStyle gives a
    // theme-consistent borderColor without hardcoding a hex or importing the
    // theme config. Falls back to a plain blue if the style isn't resolvable
    // yet (e.g. computed before first paint) rather than passing `undefined`
    // to chart.js.
    const accentColor = getComputedStyle(canvas).color || "#3b82f6";

    const chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: series.map((p) => p.date),
        datasets: [
          {
            label: "Members",
            data: series.map((p) => p.memberCount),
            borderColor: accentColor,
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
