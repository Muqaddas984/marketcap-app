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
