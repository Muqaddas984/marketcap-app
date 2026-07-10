"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search, Star } from "lucide-react";
import { addHolding, addToWatchlist } from "@/app/actions";
import type { SearchHit } from "@/lib/finnhub";

export function StockSearch({ editable }: { editable: boolean }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<SearchHit | null>(null);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function watch(hit: SearchHit) {
    setWatched((prev) => new Set(prev).add(hit.symbol));
    startTransition(() => addToWatchlist(hit.symbol, hit.name));
  }

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setHits(data.hits ?? []);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={boxRef} className="relative max-w-xl">
      <div className="flex items-center gap-3 rounded-full border border-line bg-card px-5 py-3">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search stocks — try “Tesla” or “NVDA”"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted" />}
      </div>

      {open && (hits.length > 0 || picked) && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-line bg-card shadow-xl">
          {picked ? (
            <form action={addHolding} className="flex flex-wrap items-center gap-3 p-4">
              <input type="hidden" name="ticker" value={picked.symbol} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{picked.symbol}</p>
                <p className="truncate text-xs text-muted">{picked.name}</p>
              </div>
              <input
                name="shares"
                type="number"
                step="any"
                min="0.0001"
                required
                autoFocus
                placeholder="Shares"
                className="w-24 rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Add
              </button>
            </form>
          ) : (
            <ul>
              {hits.map((h) => (
                <li
                  key={h.symbol}
                  className="flex items-center border-b border-line last:border-b-0"
                >
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push(`/stock/${h.symbol}`);
                    }}
                    title={`View ${h.symbol} chart and details`}
                    className="flex min-w-0 flex-1 items-center gap-3 px-5 py-3 text-left hover:bg-background"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                      {h.symbol.slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{h.symbol}</span>
                      <span className="block truncate text-xs text-muted">{h.name}</span>
                    </span>
                  </button>
                  {editable && (
                    <>
                      <button
                        onClick={() => setPicked(h)}
                        aria-label={`Quick add ${h.symbol}`}
                        title="Quick add to portfolio"
                        className="rounded-md p-2 text-muted transition-colors hover:bg-background hover:text-accent"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => watch(h)}
                        aria-label={`Watch ${h.symbol}`}
                        title="Add to watchlist"
                        className="mr-3 rounded-md p-2 text-muted transition-colors hover:bg-background hover:text-accent"
                      >
                        <Star
                          className={`h-4 w-4 ${watched.has(h.symbol) ? "fill-accent text-accent" : ""}`}
                        />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
