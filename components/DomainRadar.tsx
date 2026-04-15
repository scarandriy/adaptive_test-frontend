"use client";

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

const DOMAIN_LABELS: Record<string, string> = {
  business:        "Business",
  finance:         "Finance",
  technology:      "Technology",
  marketing_sales: "Marketing",
  psychology:      "Psychology",
};

/* Shortened tick labels for compact radar */
const SHORT_LABELS: Record<string, string> = {
  Business:   "Biz",
  Finance:    "Fin",
  Technology: "Tech",
  Marketing:  "Mktg",
  Psychology: "Psych",
};

interface DomainRadarProps {
  scores: Record<string, number>;
  /** Height in px (default 200) */
  height?: number;
  /** outerRadius for the chart (default 75) */
  outerRadius?: number;
  /** Font size for axis ticks (default 10) */
  tickFontSize?: number;
  /** Margin object */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  /** Whether to shorten tick labels */
  shortTicks?: boolean;
}

function CustomTooltip({
  active, payload,
}: {
  active?: boolean;
  payload?: { payload: { domain: string; score: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs shadow-sm"
      style={{ fontFamily: "var(--font-jetbrains)" }}>
      <span className="font-medium text-gray-900">{d.domain}</span>
      <span className="ml-2 text-[#0056D2]">{d.score.toFixed(1)}</span>
    </div>
  );
}

export function DomainRadar({
  scores,
  height = 200,
  outerRadius = 75,
  tickFontSize = 10,
  margin = { top: 15, right: 25, bottom: 15, left: 25 },
  shortTicks = true,
}: DomainRadarProps) {
  const data = Object.entries(DOMAIN_LABELS).map(([key, label]) => ({
    domain: label,
    score: scores[key] ?? 0,
  }));

  const tickFormatter = shortTicks
    ? (v: string) => SHORT_LABELS[v] ?? v
    : (v: string) => v;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius={outerRadius} margin={margin}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis
          dataKey="domain"
          tick={{ fontSize: tickFontSize, fill: "#9CA3AF" }}
          tickFormatter={tickFormatter}
        />
        <PolarRadiusAxis angle={90} domain={[0, "auto"]} tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#2563EB"
          fill="#3B82F6"
          fillOpacity={0.12}
          strokeWidth={1.5}
          dot={{ fill: "#2563EB", r: 2.5 }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
