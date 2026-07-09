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
import { chartData } from "@/lib/data";

const PINK = "#f43f5e";

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-card shadow-lg">
      {(payload[0].value / 1000).toFixed(1)}k
    </div>
  );
}

export function StatisticsChart() {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card p-6">
      <h2 className="text-lg font-bold">Statistics</h2>
      <div className="mt-4 h-64 min-h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
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
              domain={[0, 80000]}
              ticks={[0, 20000, 40000, 60000, 80000]}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}k`)}
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
