import { Sidebar } from "@/components/sidebar";
import { StockCards } from "@/components/stock-cards";
import { PortfolioValues } from "@/components/portfolio-values";
import { StatisticsChart } from "@/components/statistics-chart";
import { StockTable } from "@/components/stock-table";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <StockCards />
        <div className="grid gap-5 lg:grid-cols-[5fr_6fr]">
          <PortfolioValues />
          <StatisticsChart />
        </div>
        <StockTable />
      </main>
    </div>
  );
}
