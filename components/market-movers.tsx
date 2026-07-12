"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Flame, TrendingDown, Activity } from "lucide-react";
import { money } from "@/lib/data";
import type { Mover } from "@/lib/movers";

const TABS = [
  { key: "gainers", label: "Top Gainers", icon: Flame },
  { key: "losers", label: "Top Losers", icon: TrendingDown },
  { key: "active", label: "Most Active", icon: Activity },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function MarketMovers({
  gainers,
  losers,
  active,
}: {
  gainers: Mover[];
  losers: Mover[];
  active: Mover[];
}) {
  const [tab, setTab] = useState<TabKey>("gainers");
  const lists: Record<TabKey, Mover[]> = { gainers, losers, active };
  const rows = lists[tab];

  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Market Movers</h2>
        <div className="flex rounded-full bg-background p-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === key ? "bg-card shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl bg-background p-4 text-sm text-muted">
          Market movers are unavailable right now — check back in a minute.
        </p>
      ) : (
        <ul className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m, i) => {
            const up = m.changePct >= 0;
            return (
              <li key={m.ticker} className="border-b border-line last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(3)]:border-b-0">
                <a
                  href={`/stock/${m.ticker}`}
                  className="group flex items-center gap-3 py-3"
                >
                  <span className="w-5 shrink-0 text-xs font-bold text-muted">{i + 1}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                    {m.ticker.slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold group-hover:text-accent">
                      {m.ticker}
                    </span>
                    <span className="block truncate text-xs text-muted">{m.name}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold">{money(m.price)}</span>
                    <span
                      className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${
                        up ? "text-positive" : "text-negative"
                      }`}
                    >
                      {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(m.changePct).toFixed(2)}%
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
