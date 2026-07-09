export type Holding = {
  id?: string;
  ticker: string;
  name: string;
  shares: number;
  buyPrice: number;
  investDate: string;
};

// The user's holdings — static for now; becomes per-account data in the accounts phase.
export const holdings: Holding[] = [
  { ticker: "AAPL", name: "Apple Inc", shares: 42, buyPrice: 168.4, investDate: "Feb 22, 2024" },
  { ticker: "GOOGL", name: "Alphabet Inc", shares: 36, buyPrice: 138.2, investDate: "Jan 14, 2024" },
  { ticker: "SPOT", name: "Spotify Technology SA", shares: 15, buyPrice: 245.6, investDate: "Mar 05, 2024" },
  { ticker: "MSFT", name: "Microsoft Corp", shares: 12, buyPrice: 397.5, investDate: "Apr 02, 2024" },
  { ticker: "NVDA", name: "NVIDIA Corp", shares: 25, buyPrice: 94.3, investDate: "May 21, 2024" },
];

// Demo quotes shown when FINNHUB_API_KEY is missing or the API is unreachable.
export const fallbackQuotes: Record<string, { price: number; changePct: number; marketCapM: number }> = {
  AAPL: { price: 213.5, changePct: 1.24, marketCapM: 3_190_000 },
  GOOGL: { price: 178.9, changePct: 0.82, marketCapM: 2_200_000 },
  SPOT: { price: 692.1, changePct: -1.43, marketCapM: 141_000 },
  MSFT: { price: 468.3, changePct: 0.57, marketCapM: 3_480_000 },
  NVDA: { price: 159.2, changePct: 2.08, marketCapM: 3_890_000 },
};

export const chartData = [
  { date: "Dec 1", value: 34200 },
  { date: "Dec 2", value: 38400 },
  { date: "Dec 3", value: 36800 },
  { date: "Dec 4", value: 39600 },
  { date: "Dec 5", value: 37900 },
  { date: "Dec 6", value: 41200 },
  { date: "Dec 7", value: 25500 },
  { date: "Dec 8", value: 43800 },
];

export function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Format a market cap given in millions, e.g. 3_190_000 -> "3.19T". */
export function compactCap(millions: number) {
  if (millions >= 1_000_000) return `${(millions / 1_000_000).toFixed(2)}T`;
  if (millions >= 1_000) return `${(millions / 1_000).toFixed(1)}B`;
  return `${millions.toFixed(0)}M`;
}
