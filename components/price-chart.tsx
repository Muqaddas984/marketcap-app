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
import type { PricePoint } from "@/lib/price-history";

const GREEN = "#16a34a";
const RED = "#e11d48";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-card shadow-lg">
      {label} · ${payload[0].value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
    </div>
  );
}

export function PriceChart({ data }: { data: PricePoint[] }) {
  const up = data.length >= 2 && data[data.length - 1].value >= data[0].value;
  const color = up ? GREEN : RED;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={48}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            tickMargin={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={56}
            domain={["auto", "auto"]}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            tickFormatter={(v: number) =>
              `$${v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : Math.round(v)}`
            }
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--foreground)", strokeDasharray: "4 4", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceFill)"
            activeDot={{ r: 4, fill: color, stroke: "var(--card)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
