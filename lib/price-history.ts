export type Candle = {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
};

export const CHART_RANGES = ["1D", "5D", "1M", "6M", "1Y", "5Y"] as const;
export type ChartRange = (typeof CHART_RANGES)[number];

const RANGE_CONFIG: Record<ChartRange, { range: string; interval: string; revalidate: number }> = {
  "1D": { range: "1d", interval: "5m", revalidate: 60 },
  "5D": { range: "5d", interval: "15m", revalidate: 300 },
  "1M": { range: "1mo", interval: "1d", revalidate: 3600 },
  "6M": { range: "6mo", interval: "1d", revalidate: 3600 },
  "1Y": { range: "1y", interval: "1wk", revalidate: 3600 },
  "5Y": { range: "5y", interval: "1mo", revalidate: 21600 },
};

/**
 * OHLC candles from Yahoo Finance's public chart API (no key required).
 * Intraday ranges (1D/5D) use 5- and 15-minute candles; longer ranges use
 * daily, weekly, or monthly candles. Oldest first.
 */
export async function getCandles(symbol: string, chartRange: ChartRange): Promise<Candle[]> {
  const cfg = RANGE_CONFIG[chartRange];
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${cfg.range}&interval=${cfg.interval}`,
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
