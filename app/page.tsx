import Link from "next/link";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { StockCards } from "@/components/stock-cards";
import { PortfolioValues } from "@/components/portfolio-values";
import { StatisticsChart } from "@/components/statistics-chart";
import { StockTable } from "@/components/stock-table";
import { AutoRefresh } from "@/components/auto-refresh";
import { getDashboardData } from "@/lib/market";
import { getUserPortfolio } from "@/lib/user-data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { email, holdings, isDemo } = await getUserPortfolio();
  const { rows, portfolio, live } = await getDashboardData(holdings);

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
        <StockCards rows={rows} />
        <div className="grid gap-5 lg:grid-cols-[5fr_6fr]">
          <PortfolioValues
            total={portfolio.total}
            profit={portfolio.profit}
            changePct={portfolio.changePct}
            holdingsCount={rows.length}
          />
          <StatisticsChart />
        </div>
        <StockTable rows={rows} editable={!isDemo} />
        <AutoRefresh seconds={60} />
      </main>
    </div>
  );
}
