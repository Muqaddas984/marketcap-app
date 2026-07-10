import Link from "next/link";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { StockCards } from "@/components/stock-cards";
import { StockSearch } from "@/components/stock-search";
import { PortfolioValues } from "@/components/portfolio-values";
import { StatisticsChart } from "@/components/statistics-chart";
import { StockTable } from "@/components/stock-table";
import { AutoRefresh } from "@/components/auto-refresh";
import { NewsFeed } from "@/components/news-feed";
import { Watchlist } from "@/components/watchlist";
import { getDashboardData } from "@/lib/market";
import { getUserPortfolio, getWatchlistData, getHistory, saveSnapshot } from "@/lib/user-data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { email, holdings, isDemo } = await getUserPortfolio();
  const { rows, portfolio, live } = await getDashboardData(holdings);

  let watchItems: Awaited<ReturnType<typeof getWatchlistData>> = [];
  let history: Awaited<ReturnType<typeof getHistory>> = [];
  if (!isDemo) {
    await saveSnapshot(portfolio.total);
    [watchItems, history] = await Promise.all([getWatchlistData(), getHistory()]);
  }

  return (
    <div className="min-h-screen">
      <Sidebar email={email} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        {error && (
          <p className="flex items-center gap-2 rounded-xl bg-negative-soft px-4 py-2.5 text-xs font-medium text-negative">
            <CircleAlert className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
        {!live && (
          <p className="flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-xs font-medium text-muted">
            <TriangleAlert className="h-4 w-4 shrink-0 text-negative" />
            Showing demo prices — add your free Finnhub API key to .env.local and restart to go
            live.
          </p>
        )}
        {isDemo && supabaseConfigured() && (
          <p className="flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-2.5 text-xs font-medium text-accent">
            This is a demo portfolio —{" "}
            <Link href="/login" className="font-semibold underline">
              sign in
            </Link>{" "}
            to build your own.
          </p>
        )}
        <StockSearch editable={!isDemo} />
        <StockCards rows={rows} />
        <div className="grid gap-5 lg:grid-cols-[5fr_6fr]">
          <PortfolioValues
            total={portfolio.total}
            profit={portfolio.profit}
            changePct={portfolio.changePct}
            rows={rows}
          />
          <StatisticsChart history={history} />
        </div>
        <StockTable rows={rows} editable={!isDemo} />
        <div className="grid gap-5 lg:grid-cols-2">
          {!isDemo && <Watchlist items={watchItems} />}
          <div className={isDemo ? "lg:col-span-2" : ""}>
            <NewsFeed />
          </div>
        </div>
        <AutoRefresh seconds={60} />
      </main>
    </div>
  );
}
