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

export type Profile = { name: string; marketCapM: number };

/** Company name + market cap (millions USD), cached for an hour. */
export async function getProfile(symbol: string): Promise<Profile | null> {
  const p = (await fh(`/stock/profile2?symbol=${symbol}`, 3600)) as
    | { name?: string; marketCapitalization?: number }
    | null;
  if (!p?.name) return null;
  return { name: p.name, marketCapM: p.marketCapitalization || 0 };
}

/** Market cap in millions of USD, cached for an hour. */
export async function getMarketCap(symbol: string): Promise<number | null> {
  const p = await getProfile(symbol);
  return p?.marketCapM || null;
}

export type NewsItem = {
  headline: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  summary: string;
};

/** Latest general market news, cached 5 minutes. */
export async function getMarketNews(): Promise<NewsItem[]> {
  const r = (await fh(`/news?category=general`, 300)) as NewsItem[] | null;
  if (!Array.isArray(r)) return [];
  return r
    .filter((n) => n.headline && n.url)
    .slice(0, 6)
    .map((n) => ({
      headline: n.headline,
      source: n.source,
      url: n.url,
      image: n.image || "",
      datetime: n.datetime,
      summary: n.summary || "",
    }));
}

export type SearchHit = { symbol: string; name: string };

/** Search stocks by ticker or company name, US common stocks first. */
export async function searchSymbols(query: string): Promise<SearchHit[]> {
  const r = (await fh(`/search?q=${encodeURIComponent(query)}&exchange=US`, 300)) as {
    result?: { symbol: string; description: string; type: string }[];
  } | null;
  if (!r?.result) return [];
  return r.result
    .filter((h) => h.type === "Common Stock" && !h.symbol.includes("."))
    .slice(0, 8)
    .map((h) => ({ symbol: h.symbol, name: h.description }));
}
