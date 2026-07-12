"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  AreaSeries,
  CandlestickSeries,
  type UTCTimestamp,
} from "lightweight-charts";
import { Loader2 } from "lucide-react";
import { CHART_RANGES, type Candle, type ChartRange } from "@/lib/price-history";

const UP = "#16a34a";
const DOWN = "#e11d48";

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function AdvancedChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<ChartRange>("1M");
  const [mode, setMode] = useState<"line" | "candles">("line");
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/history?symbol=${encodeURIComponent(symbol)}&range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setCandles(d.candles ?? []);
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
  }, [symbol, range]);

  useEffect(() => {
    if (!containerRef.current || !candles || candles.length < 2) return;

    const up = candles[candles.length - 1].close >= candles[0].close;
    const trend = up ? UP : DOWN;
    const intraday = range === "1D" || range === "5D";

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

    if (mode === "candles") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: UP,
        downColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
        borderVisible: false,
      });
      series.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      );
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: trend,
        lineWidth: 2,
        topColor: up ? "rgba(22, 163, 74, 0.25)" : "rgba(225, 29, 72, 0.25)",
        bottomColor: "rgba(0, 0, 0, 0)",
      });
      series.setData(
        candles.map((c) => ({ time: c.time as UTCTimestamp, value: c.close }))
      );
    }

    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [candles, mode, range]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full bg-background p-1">
          {CHART_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                range === r ? "bg-card shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
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

      <div className="relative mt-4 h-80">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        )}
        {!loading && candles && candles.length < 2 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-background text-sm text-muted">
            No price history available for this range.
          </div>
        ) : (
          <div ref={containerRef} className="h-full w-full" />
        )}
      </div>
      <p className="mt-2 text-right text-xs text-muted">
        {range === "1D"
          ? "5-minute candles, today"
          : range === "5D"
            ? "15-minute candles, last 5 days"
            : range === "1Y"
              ? "Weekly candles, last year"
              : range === "5Y"
                ? "Monthly candles, last 5 years"
                : `Daily candles, last ${range === "1M" ? "month" : "6 months"}`}
      </p>
    </div>
  );
}
