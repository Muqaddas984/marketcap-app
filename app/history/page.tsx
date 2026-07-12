import { redirect } from "next/navigation";
import { ScrollText } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { money } from "@/lib/data";

export const metadata = { title: "History — Marketcap" };

type Trade = {
  id: string;
  kind: "buy" | "sell";
  ticker: string;
  name: string;
  shares: number;
  price: number;
  total: number;
  profit: number | null;
  created_at: string;
};

export default async function HistoryPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("trades")
    .select("id, kind, ticker, name, shares, price, total, profit, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const trades = (data ?? []) as Trade[];

  return (
    <div className="min-h-screen">
      <Sidebar email={user.email ?? null} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
              <ScrollText className="h-5 w-5 text-accent" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Transaction History</h1>
              <p className="text-sm text-muted">Every buy and sell on your account.</p>
            </div>
          </div>

          {trades.length === 0 ? (
            <p className="mt-5 rounded-xl bg-background p-4 text-sm text-muted">
              No trades yet — buy your first stock and it will show up here.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-155 text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-3 font-semibold">Stock</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 font-semibold">Shares</th>
                    <th className="py-3 font-semibold">Price</th>
                    <th className="py-3 text-right font-semibold">Total</th>
                    <th className="py-3 text-right font-semibold">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-b border-line last:border-b-0">
                      <td className="py-3.5">
                        <a href={`/stock/${t.ticker}`} className="flex items-center gap-3 hover:opacity-80">
                          <BrandLogo ticker={t.ticker} size={32} />
                          <span>
                            <span className="block font-bold">{t.ticker}</span>
                            <span className="block max-w-40 truncate text-xs text-muted">{t.name}</span>
                          </span>
                        </a>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                            t.kind === "buy"
                              ? "bg-accent-soft text-accent"
                              : "bg-negative-soft text-negative"
                          }`}
                        >
                          {t.kind}
                        </span>
                      </td>
                      <td className="py-3.5 font-medium">
                        {new Date(t.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 font-medium">{Number(t.shares)}</td>
                      <td className="py-3.5 font-medium">{money(Number(t.price))}</td>
                      <td className="py-3.5 text-right font-semibold">{money(Number(t.total))}</td>
                      <td className="py-3.5 text-right">
                        {t.profit === null ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              Number(t.profit) >= 0 ? "text-positive" : "text-negative"
                            }`}
                          >
                            {Number(t.profit) >= 0 ? "+" : "−"}
                            {money(Math.abs(Number(t.profit)))}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
