"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  AreaSeries,
  CandlestickSeries,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { Loader2 } from "lucide-react";
import { CHART_INTERVALS, INTERVAL_META, type Candle, type ChartInterval } from "@/lib/price-history";

const UP = "#16a34a";
const DOWN = "#e11d48";

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function toSeriesData(candles: Candle[], mode: "line" | "candles") {
  return mode === "candles"
    ? candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    : candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.close }));
}

export function AdvancedChart({ symbol }: { symbol: string }) {
  const [interval, setInterval_] = useState<ChartInterval>("15m");
  const [mode, setMode] = useState<"line" | "candles">("candles");
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Initial load whenever symbol or interval changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setCandles(null);
    fetch(`/api/history?symbol=${encodeURIComponent(symbol)}&interval=${interval}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setCandles(d.candles ?? []);
          setLastUpdate(new Date());
        }
      })
      .catch(() => {
        if (!cancelled) setCandles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [symbol, interval]);

  // Live refresh: silently refetch and update the series in place so the
  // chart stays put (zoom/pan preserved) while the newest candle moves.
  useEffect(() => {
    const id = window.setInterval(async () => {
      try {
        const r = await fetch(`/api/history?symbol=${encodeURIComponent(symbol)}&interval=${interval}`);
        const d = await r.json();
        if (Array.isArray(d.candles) && d.candles.length && seriesRef.current) {
          seriesRef.current.setData(
            toSeriesData(d.candles, modeRef.current) as never[]
          );
          setLastUpdate(new Date());
        }
      } catch {
        // transient network failure — keep the current chart
      }
    }, INTERVAL_META[interval].refreshMs);
    return () => window.clearInterval(id);
  }, [symbol, interval]);

  // Build the chart whenever the data set or mode changes.
  useEffect(() => {
    if (!containerRef.current || !candles || candles.length < 2) return;

    const up = candles[candles.length - 1].close >= candles[0].close;
    const trend = up ? UP : DOWN;
    const intraday = ["5m", "15m", "30m", "1H"].includes(interval);

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: cssVar("--muted") || "#8e8ea3",
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: cssVar("--border") || "#ebebef", style: 2 },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: intraday,
        secondsVisible: false,
      },
      crosshair: {
        horzLine: { labelBackgroundColor: cssVar("--foreground") || "#16161d" },
        vertLine: { labelBackgroundColor: cssVar("--foreground") || "#16161d" },
      },
    });

    const series =
      mode === "candles"
        ? chart.addSeries(CandlestickSeries, {
            upColor: UP,
            downColor: DOWN,
            wickUpColor: UP,
            wickDownColor: DOWN,
            borderVisible: false,
          })
        : chart.addSeries(AreaSeries, {
            lineColor: trend,
            lineWidth: 2,
            topColor: up ? "rgba(22, 163, 74, 0.25)" : "rgba(225, 29, 72, 0.25)",
            bottomColor: "rgba(0, 0, 0, 0)",
          });
    series.setData(toSeriesData(candles, mode) as never[]);
    seriesRef.current = series;

    chart.timeScale().fitContent();
    return () => {
      seriesRef.current = null;
      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, mode]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full bg-background p-1">
          {CHART_INTERVALS.map((iv) => (
            <button
              key={iv}
              onClick={() => setInterval_(iv)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                interval === iv ? "bg-card shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {iv}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-positive">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
            </span>
            LIVE
          </span>
          <div className="flex rounded-full bg-background p-1">
            {(["line", "candles"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  mode === m ? "bg-card shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-80">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        )}
        {!loading && candles && candles.length < 2 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-background text-sm text-muted">
            No price history available for this interval.
          </div>
        ) : (
          <div ref={containerRef} className="h-full w-full" />
        )}
      </div>
      <p className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>
          {lastUpdate
            ? `Updated ${lastUpdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : ""}
        </span>
        <span>{INTERVAL_META[interval].label}</span>
      </p>
    </div>
  );
}
