import { redirect } from "next/navigation";
import { ChartPie, TrendingDown, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { BrandLogo } from "@/components/brand-logo";
import { AllocationChart, type Slice } from "@/components/allocation-chart";
import { createClient } from "@/lib/supabase/server";
import { getUserPortfolio } from "@/lib/user-data";
import { getDashboardData } from "@/lib/market";
import { money } from "@/lib/data";

export const metadata = { title: "Analytics — Marketcap" };

type SellTrade = { ticker: string; name: string; profit: number; created_at: string };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { email, holdings, cash } = await getUserPortfolio();
  const [{ rows }, { data: sellData }] = await Promise.all([
    getDashboardData(holdings),
    supabase
      .from("trades")
      .select("ticker, name, profit, created_at")
      .eq("kind", "sell")
      .not("profit", "is", null),
  ]);

  const sells = ((sellData ?? []) as SellTrade[]).map((s) => ({
    ...s,
    profit: Number(s.profit),
  }));

  // Allocation: top 6 holdings + Other + Cash.
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 6).map<Slice>((r) => ({ name: r.ticker, value: r.value }));
  const otherValue = sorted.slice(6).reduce((s, r) => s + r.value, 0);
  const slices: Slice[] = [
    ...top,
    ...(otherValue > 0 ? [{ name: "Other", value: otherValue }] : []),
    { name: "Cash", value: cash, isCash: true },
  ].filter((s) => s.value > 0);

  const wins = sells.filter((s) => s.profit > 0).length;
  const winRate = sells.length ? (wins / sells.length) * 100 : null;
  const realized = sells.reduce((s, x) => s + x.profit, 0);
  const best = sells.length ? sells.reduce((a, b) => (b.profit > a.profit ? b : a)) : null;
  const worst = sells.length ? sells.reduce((a, b) => (b.profit < a.profit ? b : a)) : null;

  const stats: { label: string; value: string; tone?: "pos" | "neg" }[] = [
    {
      label: "Realized profit",
      value: `${realized >= 0 ? "+" : "−"}${money(Math.abs(realized))}`,
      tone: realized >= 0 ? "pos" : "neg",
    },
    { label: "Completed sells", value: String(sells.length) },
    {
      label: "Win rate",
      value: winRate === null ? "—" : `${winRate.toFixed(0)}%`,
      tone: winRate === null ? undefined : winRate >= 50 ? "pos" : "neg",
    },
    { label: "Positions held", value: String(rows.length) },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar email={email} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
              <ChartPie className="h-5 w-5 text-accent" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Portfolio Analytics</h1>
              <p className="text-sm text-muted">Where your virtual money is, and how you trade.</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-background p-4">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd
                  className={`mt-1 text-lg font-bold ${
                    s.tone === "pos" ? "text-positive" : s.tone === "neg" ? "text-negative" : ""
                  }`}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-bold">Allocation</h2>
          <p className="mt-1 text-sm text-muted">
            How your account value is split between stocks and cash.
          </p>
          <div className="mt-5">
            <AllocationChart slices={slices} />
          </div>
        </div>

        {(best || worst) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {best && (
              <div className="rounded-2xl border border-line bg-card p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <TrendingUp className="h-4 w-4 text-positive" /> Best trade
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <BrandLogo ticker={best.ticker} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{best.ticker}</p>
                    <p className="truncate text-xs text-muted">
                      {new Date(best.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-positive">
                    +{money(Math.abs(best.profit))}
                  </span>
                </div>
              </div>
            )}
            {worst && (
              <div className="rounded-2xl border border-line bg-card p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <TrendingDown className="h-4 w-4 text-negative" /> Worst trade
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <BrandLogo ticker={worst.ticker} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{worst.ticker}</p>
                    <p className="truncate text-xs text-muted">
                      {new Date(worst.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-lg font-bold ${worst.profit >= 0 ? "text-positive" : "text-negative"}`}
                  >
                    {worst.profit >= 0 ? "+" : "−"}
                    {money(Math.abs(worst.profit))}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
