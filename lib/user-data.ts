import { holdings as demoHoldings, type Holding } from "./data";
import { createClient } from "./supabase/server";

export type UserPortfolio = {
  email: string | null;
  holdings: Holding[];
  /** True when showing the built-in demo portfolio (signed out or Supabase not set up). */
  isDemo: boolean;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type WatchItem = {
  id: string;
  ticker: string;
  name: string;
  price: number | null;
  changePct: number | null;
};

export async function getWatchlistData(): Promise<WatchItem[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("watchlist")
    .select("id, ticker, name")
    .order("created_at");
  if (!data?.length) return [];

  const { getQuote } = await import("./finnhub");
  return Promise.all(
    data.map(async (r) => {
      const q = await getQuote(r.ticker as string);
      return {
        id: r.id as string,
        ticker: r.ticker as string,
        name: r.name as string,
        price: q?.price ?? null,
        changePct: q?.changePct ?? null,
      };
    })
  );
}

export type HistoryPoint = { date: string; value: number };

/** Upsert today's portfolio total so the history chart accumulates one point per day. */
export async function saveSnapshot(total: number) {
  const supabase = await createClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("portfolio_history")
    .upsert(
      { user_id: user.id, snap_date: new Date().toISOString().slice(0, 10), total },
      { onConflict: "user_id,snap_date" }
    );
}

export async function getHistory(): Promise<HistoryPoint[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("portfolio_history")
    .select("snap_date, total")
    .order("snap_date", { ascending: true })
    .limit(60);

  return (data ?? []).map((r) => ({
    date: new Date(r.snap_date as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: Number(r.total),
  }));
}

export async function getUserPortfolio(): Promise<UserPortfolio> {
  const supabase = await createClient();
  if (!supabase) return { email: null, holdings: demoHoldings, isDemo: true };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { email: null, holdings: demoHoldings, isDemo: true };

  const { data } = await supabase
    .from("holdings")
    .select("id, ticker, name, shares, buy_price, invest_date")
    .order("created_at");

  const holdings: Holding[] = (data ?? []).map((r) => ({
    id: r.id as string,
    ticker: r.ticker as string,
    name: r.name as string,
    shares: Number(r.shares),
    buyPrice: Number(r.buy_price),
    investDate: formatDate(r.invest_date as string),
  }));

  return { email: user.email ?? null, holdings, isDemo: false };
}
