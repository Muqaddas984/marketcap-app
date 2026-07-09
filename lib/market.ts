import { holdings, fallbackQuotes } from "./data";
import { getQuote, getMarketCap, hasApiKey } from "./finnhub";

export type StockRow = {
  ticker: string;
  name: string;
  investDate: string;
  price: number;
  changePct: number;
  value: number;
  profit: number;
  marketCapM: number;
  live: boolean;
};

export type DashboardData = {
  rows: StockRow[];
  portfolio: { total: number; profit: number; changePct: number };
  live: boolean;
};

export async function getDashboardData(): Promise<DashboardData> {
  const rows = await Promise.all(
    holdings.map(async (h): Promise<StockRow> => {
      const [quote, cap] = await Promise.all([getQuote(h.ticker), getMarketCap(h.ticker)]);
      const fb = fallbackQuotes[h.ticker];
      const price = quote?.price ?? fb.price;
      const changePct = quote?.changePct ?? fb.changePct;
      return {
        ticker: h.ticker,
        name: h.name,
        investDate: h.investDate,
        price,
        changePct,
        value: price * h.shares,
        profit: (price - h.buyPrice) * h.shares,
        marketCapM: cap ?? fb.marketCapM,
        live: quote !== null,
      };
    })
  );

  const total = rows.reduce((s, r) => s + r.value, 0);
  const profit = rows.reduce((s, r) => s + r.profit, 0);
  const prevTotal = rows.reduce((s, r) => s + r.value / (1 + r.changePct / 100), 0);
  const changePct = prevTotal > 0 ? (total / prevTotal - 1) * 100 : 0;

  return {
    rows,
    portfolio: { total, profit, changePct },
    live: hasApiKey() && rows.every((r) => r.live),
  };
}
