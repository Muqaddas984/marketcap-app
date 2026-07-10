"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartData as demoData } from "@/lib/data";

const PINK = "#f43f5e";

type Point = { date: string; value: number };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-card shadow-lg">
      {v >= 10000 ? `${(v / 1000).toFixed(1)}k` : `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
    </div>
  );
}

export function StatisticsChart({ history = [] }: { history?: Point[] }) {
  // Real history needs at least two daily snapshots to draw a line.
  const real = history.length >= 2;
  const data = real ? history : demoData;
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {real ? "Portfolio History" : "Statistics"}
        </h2>
        {!real && (
          <span
            className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold text-muted"
            title={
              history.length === 1
                ? "Your first snapshot is saved — the real chart appears after a second day"
                : "Sign in and add holdings to start building real history"
            }
          >
            Demo data
          </span>
        )}
      </div>
      <div className="mt-4 h-64 min-h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PINK} stopOpacity={0.28} />
                <stop offset="100%" stopColor={PINK} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="6 6"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={44}
              domain={real ? [0, "auto"] : [0, 80000]}
              ticks={real ? undefined : [0, 20000, 40000, 60000, 80000]}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(v: number) =>
                v === 0 ? "0" : v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : String(Math.round(v))
              }
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "var(--foreground)", strokeDasharray: "4 4", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={PINK}
              strokeWidth={2}
              fill="url(#pinkFill)"
              activeDot={{ r: 4, fill: PINK, stroke: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
