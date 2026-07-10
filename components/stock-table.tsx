"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Trash2 } from "lucide-react";
import { deleteHolding } from "@/app/actions";
import { money, compactCap } from "@/lib/data";
import type { StockRow } from "@/lib/market";
import { AddHolding } from "./add-holding";
import { BrandLogo } from "./brand-logo";

type SortKey = "ticker" | "investDate" | "marketCapM" | "changePct" | "price";

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "ticker", label: "Name Stock" },
  { key: "investDate", label: "Invest Date" },
  { key: "marketCapM", label: "Market Cap" },
  { key: "changePct", label: "Change" },
  { key: "price", label: "Price/stock", align: "right" },
];

export function StockTable({ rows, editable = false }: { rows: StockRow[]; editable?: boolean }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const av = sortKey === "investDate" ? Date.parse(a.investDate) : a[sortKey];
      const bv = sortKey === "investDate" ? Date.parse(b.investDate) : b[sortKey];
      return (av < bv ? -1 : av > bv ? 1 : 0) * (asc ? 1 : -1);
    });
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  return (
    <div id="my-stock" className="scroll-mt-6 rounded-2xl border border-line bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">My Stock</h2>
        {editable && <AddHolding />}
      </div>
      {rows.length === 0 && (
        <p className="mt-4 rounded-xl bg-background p-4 text-sm text-muted">
          No holdings yet — click &quot;Add holding&quot; to track your first stock.
        </p>
      )}
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-155 text-sm">
          <thead>
            <tr className="border-b border-line">
              {columns.map(({ key, label, align }) => (
                <th key={key} className={`py-3 ${align === "right" ? "text-right" : "text-left"}`}>
                  <button
                    onClick={() => toggleSort(key)}
                    className="inline-flex items-center gap-1 font-semibold text-ink hover:text-accent"
                  >
                    {label}
                    <ChevronsUpDown className="h-3.5 w-3.5 text-muted" />
                  </button>
                </th>
              ))}
              {editable && <th className="w-10" aria-label="Actions" />}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const up = s.changePct >= 0;
              return (
                <tr key={s.ticker} className="border-b border-line last:border-b-0">
                  <td className="py-4">
                    <a href={`/stock/${s.ticker}`} className="flex items-center gap-3 hover:opacity-80">
                      <BrandLogo ticker={s.ticker} size={36} />
                      <div>
                        <p className="font-bold">{s.ticker}</p>
                        <p className="text-xs text-muted">{s.name}</p>
                      </div>
                    </a>
                  </td>
                  <td className="py-4 font-medium">{s.investDate}</td>
                  <td className="py-4 font-medium">{compactCap(s.marketCapM)}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        up ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
                      }`}
                    >
                      {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                      {Math.abs(s.changePct).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 text-right font-semibold">{money(s.price)}</td>
                  {editable && (
                    <td className="py-4 pl-3 text-right">
                      {s.id && (
                        <form action={deleteHolding.bind(null, s.id)}>
                          <button
                            aria-label={`Remove ${s.ticker}`}
                            className="rounded-md p-1.5 text-muted transition-colors hover:bg-negative-soft hover:text-negative"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
