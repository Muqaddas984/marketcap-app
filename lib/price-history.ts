export type Candle = {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
};

/** Candle interval options, like a real trading app. */
export const CHART_INTERVALS = ["5m", "15m", "30m", "1H", "1D", "1W"] as const;
export type ChartInterval = (typeof CHART_INTERVALS)[number];

export const INTERVAL_META: Record<
  ChartInterval,
  { range: string; interval: string; revalidate: number; label: string; refreshMs: number }
> = {
  "5m": { range: "1d", interval: "5m", revalidate: 30, label: "5-minute candles · today", refreshMs: 30_000 },
  "15m": { range: "5d", interval: "15m", revalidate: 60, label: "15-minute candles · last 5 days", refreshMs: 30_000 },
  "30m": { range: "1mo", interval: "30m", revalidate: 120, label: "30-minute candles · last month", refreshMs: 60_000 },
  "1H": { range: "3mo", interval: "60m", revalidate: 300, label: "Hourly candles · last 3 months", refreshMs: 60_000 },
  "1D": { range: "1y", interval: "1d", revalidate: 3600, label: "Daily candles · last year", refreshMs: 300_000 },
  "1W": { range: "5y", interval: "1wk", revalidate: 21600, label: "Weekly candles · last 5 years", refreshMs: 300_000 },
};

/**
 * OHLC candles from Yahoo Finance's public chart API (no key required).
 * Oldest first. The most recent candle is the one still forming, so
 * repeated fetches make the chart live.
 */
export async function getCandles(symbol: string, chartInterval: ChartInterval): Promise<Candle[]> {
  const cfg = INTERVAL_META[chartInterval];
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${cfg.range}&interval=${cfg.interval}&includePrePost=false`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: cfg.revalidate },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const q = result?.indicators?.quote?.[0] ?? {};
    if (!timestamps.length) return [];

    const candles: Candle[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const open = q.open?.[i];
      const high = q.high?.[i];
      const low = q.low?.[i];
      const close = q.close?.[i];
      if ([open, high, low, close].some((v) => v === null || v === undefined)) continue;
      candles.push({
        time: timestamps[i],
        open: +open.toFixed(4),
        high: +high.toFixed(4),
        low: +low.toFixed(4),
        close: +close.toFixed(4),
      });
    }
    return candles;
  } catch {
    return [];
  }
}
