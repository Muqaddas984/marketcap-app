"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { money } from "@/lib/data";

// Fixed categorical order; cash always uses the neutral last color.
const COLORS = ["#7c5cfc", "#f43f5e", "#0ea5e9", "#f59e0b", "#14b8a6", "#d946ef", "#84cc16"];
const CASH_COLOR = "#9ca3af";

export type Slice = { name: string; value: number; isCash?: boolean };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-card shadow-lg">
      {p.name}: {money(p.value)} ({p.payload.pct.toFixed(1)}%)
    </div>
  );
}

export function AllocationChart({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const data = slices.map((s) => ({ ...s, pct: total > 0 ? (s.value / total) * 100 : 0 }));

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="h-56 w-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((s, i) => (
                <Cell
                  key={s.name}
                  fill={s.isCash ? CASH_COLOR : COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full min-w-0 flex-1">
        {data.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2.5 border-b border-line py-2 text-sm last:border-b-0">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: s.isCash ? CASH_COLOR : COLORS[i % COLORS.length] }}
            />
            <span className="min-w-0 flex-1 truncate font-semibold">{s.name}</span>
            <span className="text-muted">{s.pct.toFixed(1)}%</span>
            <span className="w-24 text-right font-semibold">{money(s.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
