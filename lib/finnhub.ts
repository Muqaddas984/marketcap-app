const BASE = "https://finnhub.io/api/v1";

export type Quote = {
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
};

export function hasApiKey() {
  return Boolean(process.env.FINNHUB_API_KEY);
}

async function fh(path: string, revalidate: number): Promise<Record<string, number> | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}${path}&token=${key}`, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  const q = await fh(`/quote?symbol=${symbol}`, 60);
  if (!q || !q.c) return null;
  return {
    price: q.c,
    change: q.d ?? 0,
    changePct: q.dp ?? 0,
    prevClose: q.pc || q.c,
  };
}

/** Market cap in millions of USD, cached for an hour. */
export async function getMarketCap(symbol: string): Promise<number | null> {
  const p = await fh(`/stock/profile2?symbol=${symbol}`, 3600);
  return p?.marketCapitalization || null;
}
