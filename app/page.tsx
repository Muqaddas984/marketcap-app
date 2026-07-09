import { TriangleAlert } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { StockCards } from "@/components/stock-cards";
import { PortfolioValues } from "@/components/portfolio-values";
import { StatisticsChart } from "@/components/statistics-chart";
import { StockTable } from "@/components/stock-table";
import { AutoRefresh } from "@/components/auto-refresh";
import { getDashboardData } from "@/lib/market";

export const revalidate = 60;

export default async function Home() {
  const { rows, portfolio, live } = await getDashboardData();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        {!live && (
          <p className="flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-xs font-medium text-muted">
            <TriangleAlert className="h-4 w-4 shrink-0 text-negative" />
            Showing demo prices — add your free Finnhub API key to .env.local and restart to go
            live.
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
        <StockTable rows={rows} />
        <AutoRefresh seconds={60} />
      </main>
    </div>
  );
}
