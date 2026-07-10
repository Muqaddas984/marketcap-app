export type PricePoint = { date: string; value: number };

/**
 * Daily closing prices for the last ~3 months from Yahoo Finance's public
 * chart API (no key required). Oldest first.
 */
export async function getDailyHistory(symbol: string): Promise<PricePoint[]> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=3mo&interval=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
    if (!timestamps.length || timestamps.length !== closes.length) return [];

    return timestamps
      .map((t, i) => ({ t, close: closes[i] }))
      .filter((r): r is { t: number; close: number } => r.close !== null && r.close > 0)
      .map((r) => ({
        date: new Date(r.t * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: +r.close.toFixed(2),
      }));
  } catch {
    return [];
  }
}
