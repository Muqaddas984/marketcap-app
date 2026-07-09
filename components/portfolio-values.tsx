import { ArrowDown, ArrowUp, ChevronRight, EllipsisVertical, Sparkles } from "lucide-react";
import { money } from "@/lib/data";

export function PortfolioValues({
  total,
  profit,
  changePct,
  holdingsCount,
}: {
  total: number;
  profit: number;
  changePct: number;
  holdingsCount: number;
}) {
  const up = changePct >= 0;
  const gained = profit >= 0;
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-card p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold">Total Value</h2>
        <button aria-label="More options" className="rounded-md p-1 text-muted hover:bg-background">
          <EllipsisVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-4xl font-extrabold tracking-tight">{money(total)}</span>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            up ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
          }`}
        >
          {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          {Math.abs(changePct).toFixed(2)}%
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        Your total {gained ? "profit" : "loss"} is{" "}
        <span className={`font-semibold ${gained ? "text-ink" : "text-negative"}`}>
          {money(Math.abs(profit))}
        </span>{" "}
        across your {holdingsCount} holdings.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-background">
          Worst Performance
        </button>
        <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Top Performance
        </button>
      </div>

      <a
        href="#"
        className="mt-auto flex items-center gap-3 rounded-2xl bg-accent-soft p-4 pt-4"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card">
          <Sparkles className="h-4 w-4 text-accent" />
        </span>
        <span className="text-sm font-medium leading-snug text-accent">
          Here&apos;s how to improve your portfolio and understand how investing works.
        </span>
        <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-accent" />
      </a>
    </div>
  );
}
