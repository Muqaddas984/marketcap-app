export type Mover = {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
};

export type MoverKind = "day_gainers" | "day_losers" | "most_actives";

/** Yahoo's predefined screeners: top gainers, losers, and most-traded, cached 5 min. */
export async function getMovers(kind: MoverKind, count = 6): Promise<Mover[]> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=${kind}&count=${count}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const quotes: Record<string, unknown>[] = json?.finance?.result?.[0]?.quotes ?? [];
    return quotes
      .filter(
        (q) =>
          typeof q.symbol === "string" &&
          typeof q.regularMarketPrice === "number" &&
          !q.symbol.includes(".")
      )
      .slice(0, count)
      .map((q) => ({
        ticker: q.symbol as string,
        name: (q.shortName as string) || (q.longName as string) || (q.symbol as string),
        price: q.regularMarketPrice as number,
        changePct: (q.regularMarketChangePercent as number) ?? 0,
      }));
  } catch {
    return [];
  }
}
