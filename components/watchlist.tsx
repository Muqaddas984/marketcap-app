import { ArrowDown, ArrowUp, X } from "lucide-react";
import { removeFromWatchlist } from "@/app/actions";
import { money } from "@/lib/data";
import type { WatchItem } from "@/lib/user-data";
import { BrandLogo } from "./brand-logo";

export function Watchlist({ items }: { items: WatchItem[] }) {
  return (
    <div id="watchlist" className="scroll-mt-6 rounded-2xl border border-line bg-card p-6">
      <h2 className="text-lg font-bold">Watchlist</h2>
      {items.length === 0 ? (
        <p className="mt-4 rounded-xl bg-background p-4 text-sm text-muted">
          Nothing here yet — search a stock above and click the star to follow it without buying.
        </p>
      ) : (
        <ul className="mt-2">
          {items.map((w) => {
            const up = (w.changePct ?? 0) >= 0;
            return (
              <li
                key={w.id}
                className="flex items-center gap-3 border-b border-line py-3.5 last:border-b-0"
              >
                <a href={`/stock/${w.ticker}`} className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-80">
                  <BrandLogo ticker={w.ticker} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{w.ticker}</p>
                    <p className="truncate text-xs text-muted">{w.name}</p>
                  </div>
                </a>
                {w.changePct !== null && (
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      up ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
                    }`}
                  >
                    {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                    {Math.abs(w.changePct).toFixed(2)}%
                  </span>
                )}
                <span className="w-20 text-right text-sm font-semibold">
                  {w.price !== null ? money(w.price) : "—"}
                </span>
                <form action={removeFromWatchlist.bind(null, w.id)}>
                  <button
                    aria-label={`Unfollow ${w.ticker}`}
                    className="rounded-md p-1.5 text-muted transition-colors hover:bg-negative-soft hover:text-negative"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
