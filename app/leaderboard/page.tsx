import { Trophy } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { createClient, getUser } from "@/lib/supabase/server";
import { money } from "@/lib/data";

export const metadata = { title: "Leaderboard — Marketcap" };

type Row = { trader: string; account_value: number; updated_on: string | null };

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const user = await getUser();

  let rows: Row[] = [];
  if (supabase) {
    const { data } = await supabase.rpc("get_leaderboard");
    rows = (data ?? []) as Row[];
  }

  const myHandle = user?.email?.split("@")[0];

  return (
    <div className="min-h-screen">
      <Sidebar email={user?.email ?? null} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
              <Trophy className="h-5 w-5 text-accent" />
            </span>
            <div>
              <h1 className="text-lg font-bold">Leaderboard</h1>
              <p className="text-sm text-muted">
                Every trader starts with $100,000 of virtual cash — who has grown it the most?
              </p>
            </div>
          </div>

          {rows.length === 0 ? (
            <p className="mt-5 rounded-xl bg-background p-4 text-sm text-muted">
              No traders yet — sign up and make the first trade!
            </p>
          ) : (
            <ol className="mt-4">
              {rows.map((r, i) => {
                const gain = r.account_value - 100000;
                const isMe = r.trader === myHandle;
                return (
                  <li
                    key={`${r.trader}-${i}`}
                    className={`flex items-center gap-4 border-b border-line py-3.5 last:border-b-0 ${
                      isMe ? "-mx-3 rounded-xl bg-accent-soft px-3" : ""
                    }`}
                  >
                    <span className="w-8 shrink-0 text-center text-sm font-bold">
                      {MEDALS[i] ?? i + 1}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {r.trader[0]?.toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">
                        {r.trader}
                        {isMe && <span className="ml-2 text-xs font-semibold text-accent">you</span>}
                      </span>
                      {r.updated_on && (
                        <span className="block text-xs text-muted">
                          updated {new Date(r.updated_on).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-bold">{money(r.account_value)}</span>
                      <span
                        className={`block text-xs font-semibold ${
                          gain >= 0 ? "text-positive" : "text-negative"
                        }`}
                      >
                        {gain >= 0 ? "+" : "−"}
                        {money(Math.abs(gain))}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
          <p className="mt-4 text-xs text-muted">
            Account values update when a trader visits their dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
