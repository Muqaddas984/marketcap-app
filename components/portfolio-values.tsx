"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, Sparkles } from "lucide-react";
import { money } from "@/lib/data";
import type { StockRow } from "@/lib/market";
import { BrandLogo } from "./brand-logo";

export function PortfolioValues({
  total,
  cash,
  changePct,
  rows,
  realized = 0,
}: {
  /** Market value of all holdings. */
  total: number;
  /** Virtual cash available. */
  cash: number;
  changePct: number;
  rows: StockRow[];
  realized?: number;
}) {
  const [view, setView] = useState<"top" | "worst" | null>(null);
  const up = changePct >= 0;
  const accountValue = cash + total;
  const overall = accountValue - 100000;
  const gained = overall >= 0;

  const sorted = [...rows].sort((a, b) => b.changePct - a.changePct);
  const picked =
    view === "top" ? sorted[0] : view === "worst" ? sorted[sorted.length - 1] : null;

  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card p-6">
      <h2 className="text-lg font-bold">Account Value</h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-4xl font-extrabold tracking-tight">{money(accountValue)}</span>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            up ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
          }`}
        >
          {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          {Math.abs(changePct).toFixed(2)}%
        </span>
      </div>

      <p className="mt-2 text-sm text-muted">
        Virtual cash <span className="font-semibold text-ink">{money(cash)}</span> · invested{" "}
        <span className="font-semibold text-ink">{money(total)}</span> in {rows.length}{" "}
        {rows.length === 1 ? "stock" : "stocks"}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        {gained ? "Up" : "Down"}{" "}
        <span className={`font-semibold ${gained ? "text-positive" : "text-negative"}`}>
          {money(Math.abs(overall))}
        </span>{" "}
        since your $100,000 start.
        {realized !== 0 && (
          <>
            {" "}
            Realized {realized >= 0 ? "profit" : "loss"} from sales:{" "}
            <span className={`font-semibold ${realized >= 0 ? "text-positive" : "text-negative"}`}>
              {money(Math.abs(realized))}
            </span>
            .
          </>
        )}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => setView(view === "worst" ? null : "worst")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            view === "worst"
              ? "bg-negative text-white"
              : "border border-line text-ink hover:bg-background"
          }`}
        >
          Worst Performance
        </button>
        <button
          onClick={() => setView(view === "top" ? null : "top")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            view === "top"
              ? "bg-accent text-white"
              : "border border-line text-ink hover:bg-background"
          }`}
        >
          Top Performance
        </button>
      </div>

      {view && !picked && (
        <p className="mt-4 rounded-xl bg-background p-3 text-sm text-muted">
          No holdings yet — add a stock to see your {view === "top" ? "best" : "worst"} performer.
        </p>
      )}
      {picked && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-background p-3">
          <BrandLogo ticker={picked.ticker} size={36} />
          <div className="min-w-0">
            <p className="text-sm font-bold">{picked.ticker}</p>
            <p className="truncate text-xs text-muted">{picked.name}</p>
          </div>
          <span
            className={`ml-auto flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              picked.changePct >= 0
                ? "bg-positive-soft text-positive"
                : "bg-negative-soft text-negative"
            }`}
          >
            {picked.changePct >= 0 ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
            {Math.abs(picked.changePct).toFixed(2)}%
          </span>
          <span className="text-sm font-semibold">{money(picked.value)}</span>
        </div>
      )}

      <a
        href="#my-stock"
        className="mt-auto flex items-center gap-3 rounded-2xl bg-accent-soft p-4 pt-4"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card">
          <Sparkles className="h-4 w-4 text-accent" />
        </span>
        <span className="text-sm font-medium leading-snug text-accent">
          Track your investments below — add holdings to see live profit and loss.
        </span>
        <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-accent" />
      </a>
    </div>
  );
}
