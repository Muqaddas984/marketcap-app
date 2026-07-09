import { ArrowUp, ArrowDown } from "lucide-react";
import { stocks, money, type Stock } from "@/lib/data";
import { BrandLogo } from "./brand-logo";

function StockCard({ stock }: { stock: Stock }) {
  const up = stock.changePct >= 0;
  return (
    <div className="min-w-60 flex-1 rounded-2xl border border-line bg-card p-5">
      <div className="flex items-center gap-3">
        <BrandLogo ticker={stock.ticker} />
        <div className="min-w-0">
          <p className="text-sm font-bold">{stock.ticker}</p>
          <p className="truncate text-xs text-muted">{stock.name}</p>
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">{money(stock.value)}</p>
      <p className="mt-1.5 flex items-center gap-1 text-xs text-muted">
        <span className={`flex items-center font-semibold ${up ? "text-positive" : "text-negative"}`}>
          {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          {Math.abs(stock.changePct).toFixed(2)}%
        </span>
        vs last month
      </p>
    </div>
  );
}

export function StockCards() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {stocks.slice(0, 4).map((s) => (
        <StockCard key={s.ticker} stock={s} />
      ))}
    </div>
  );
}
