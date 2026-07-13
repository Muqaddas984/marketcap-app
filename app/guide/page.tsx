import Link from "next/link";
import {
  BookOpen,
  Search,
  ChartCandlestick,
  ShoppingCart,
  LayoutGrid,
  Banknote,
  ChartPie,
  Lightbulb,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { getUser } from "@/lib/supabase/server";

export const metadata = { title: "How to Trade — Marketcap" };

const steps = [
  {
    icon: Search,
    title: "1. Find a stock",
    body: "Use the search bar on the dashboard — type a company name or ticker, like “Tesla” or “AAPL”. Or browse Market Movers to see today's top gainers, losers, and most-traded stocks.",
  },
  {
    icon: ChartCandlestick,
    title: "2. Research it",
    body: "Click any stock to open its page: the live price, a chart with intervals from 5 minutes to weekly, key stats, and the latest news. Switch to Candles view — green candles mean the price rose in that interval, red means it fell. The thin wicks show the highest and lowest prices touched.",
  },
  {
    icon: ShoppingCart,
    title: "3. Buy with virtual cash",
    body: "Every account starts with $100,000 of virtual money. On a stock's page, enter how many shares and press Buy — it purchases at the real live market price and the cost comes out of your cash. You can never spend more than you have, and no real money is ever involved.",
  },
  {
    icon: LayoutGrid,
    title: "4. Track your holdings",
    body: "Your dashboard shows every stock you own with its live value and today's change. Account Value = your cash + your investments; the green or red number tells you how far you are from your $100,000 start. Star stocks you don't own yet to follow them in your Watchlist.",
  },
  {
    icon: Banknote,
    title: "5. Sell to lock in profit",
    body: "When a stock has gone up (or you want out), open it and use Sell shares. The sale happens at the live price, the money returns to your cash, and your profit or loss on that trade is recorded forever. Buy low, sell high — that's the game.",
  },
  {
    icon: ChartPie,
    title: "6. Review and improve",
    body: "History lists every trade you've made with its result. Analytics shows your win rate, best and worst trades, and how your money is split between stocks and cash. Over time, your Portfolio History chart shows whether you're growing your $100k.",
  },
];

const tips = [
  "Don't put everything in one stock — spreading your money (diversifying) protects you when one pick goes wrong.",
  "Prices only move while the US market is open: 9:30 AM–4:00 PM New York time (7:30 PM–2:00 AM Pakistan time), Monday to Friday.",
  "A falling stock isn't automatically a bargain, and a rising one isn't automatically a winner — read the news on its page before trading.",
  "Use the Watchlist to observe a stock for a few days before buying it.",
  "Selling in a panic locks in your loss. Since this is practice money, experiment: what happens if you hold instead?",
];

export default async function GuidePage() {
  const user = await getUser();

  return (
    <div className="min-h-screen">
      <Sidebar email={user?.email ?? null} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
              <BookOpen className="h-5 w-5 text-accent" />
            </span>
            <div>
              <h1 className="text-lg font-bold">How to Trade on Marketcap</h1>
              <p className="text-sm text-muted">
                Practice investing with $100,000 of virtual cash and real live market prices —
                completely risk-free.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {steps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-card p-6">
              <h2 className="flex items-center gap-2.5 text-sm font-bold">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <Icon className="h-4 w-4 text-accent" />
                </span>
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="flex items-center gap-2.5 text-sm font-bold">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
              <Lightbulb className="h-4 w-4 text-accent" />
            </span>
            Trading tips for beginners
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {!user && (
          <div className="rounded-2xl bg-accent-soft p-6 text-center">
            <p className="text-sm font-semibold text-accent">
              Ready to start? Create your free account and get $100,000 in virtual cash.
            </p>
            <Link
              href="/login"
              className="mt-3 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start trading
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
