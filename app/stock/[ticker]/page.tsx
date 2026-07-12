import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, CircleAlert, CircleCheck } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { BrandLogo } from "@/components/brand-logo";
import { AdvancedChart } from "@/components/advanced-chart";
import { WatchButton } from "@/components/watch-button";
import { buyStock, sellHolding } from "@/app/actions";
import { getQuote, getProfile, getCompanyNews } from "@/lib/finnhub";
import { getUserPortfolio, getWatchRowId } from "@/lib/user-data";
import { money, compactCap } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  return { title: `${ticker.toUpperCase()} — Marketcap` };
}

function timeAgo(unixSeconds: number) {
  const mins = Math.max(1, Math.round((Date.now() / 1000 - unixSeconds) / 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function StockPage({
  params,
  searchParams,
}: {
  params: Promise<{ ticker: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { ticker: raw } = await params;
  const ticker = raw.toUpperCase();
  if (!/^[A-Z.]{1,10}$/.test(ticker)) notFound();
  const { error, message } = await searchParams;

  const [quote, profile, news, { email, holdings, cash, isDemo }, watchId] = await Promise.all([
    getQuote(ticker),
    getProfile(ticker),
    getCompanyNews(ticker),
    getUserPortfolio(),
    getWatchRowId(ticker),
  ]);

  if (!quote) notFound();

  const name = profile?.name ?? ticker;
  const up = quote.changePct >= 0;
  const owned = holdings.find((h) => h.ticker === ticker);

  const stats: [string, string][] = [
    ["Open", money(quote.open)],
    ["Previous close", money(quote.prevClose)],
    ["Day high", money(quote.high)],
    ["Day low", money(quote.low)],
    ["Market cap", profile ? compactCap(profile.marketCapM) : "—"],
  ];

  return (
    <div className="min-h-screen">
      <Sidebar email={email} />
      <main className="flex flex-col gap-5 p-5 sm:p-7 lg:ml-64">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Back to dashboard
        </Link>

        {error && (
          <p className="flex items-center gap-2 rounded-xl bg-negative-soft px-4 py-2.5 text-xs font-medium text-negative">
            <CircleAlert className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
        {message && (
          <p className="flex items-center gap-2 rounded-xl bg-positive-soft px-4 py-2.5 text-xs font-medium text-positive">
            <CircleCheck className="h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex flex-wrap items-center gap-4">
            <BrandLogo ticker={ticker} size={48} />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold">{ticker}</h1>
              <p className="truncate text-sm text-muted">{name}</p>
            </div>
            {!isDemo && <WatchButton ticker={ticker} name={name} watchId={watchId} />}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-extrabold tracking-tight">{money(quote.price)}</span>
            <span
              className={`flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                up ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
              }`}
            >
              {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
              {Math.abs(quote.changePct).toFixed(2)}% today
            </span>
          </div>

          <div className="mt-6">
            <AdvancedChart symbol={ticker} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-5">
            {stats.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="text-lg font-bold">{isDemo ? "Buy" : owned ? "Your position" : "Buy"}</h2>
            {isDemo ? (
              <p className="mt-4 rounded-xl bg-background p-4 text-sm text-muted">
                <Link href="/login" className="font-semibold text-accent underline">
                  Sign in
                </Link>{" "}
                to add {ticker} to your portfolio.
              </p>
            ) : (
              <>
                {owned && (
                  <p className="mt-3 rounded-xl bg-accent-soft p-3 text-sm text-accent">
                    You own <span className="font-bold">{owned.shares}</span> shares — worth{" "}
                    <span className="font-bold">{money(owned.shares * quote.price)}</span> (bought
                    at {money(owned.buyPrice)}).
                  </p>
                )}
                <p className="mt-3 text-sm text-muted">
                  Virtual cash available:{" "}
                  <span className="font-semibold text-ink">{money(cash)}</span> — enough for up to{" "}
                  <span className="font-semibold text-ink">
                    {Math.floor(cash / quote.price)}
                  </span>{" "}
                  shares at the live price.
                </p>
                <form action={buyStock} className="mt-4 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="ticker" value={ticker} />
                  <input type="hidden" name="redirectTo" value={`/stock/${ticker}`} />
                  <label className="flex flex-col gap-1 text-xs font-semibold">
                    Shares
                    <input
                      name="shares"
                      type="number"
                      step="any"
                      min="0.0001"
                      required
                      placeholder="10"
                      className="w-28 rounded-xl border border-line bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-accent"
                    />
                  </label>
                  <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    Buy at {money(quote.price)}
                  </button>
                </form>
                <p className="mt-3 text-xs text-muted">
                  Buys use your virtual cash at the live market price. Practice trading — no real
                  money is involved.
                </p>
                {owned && (
                  <div id="sell" className="mt-5 scroll-mt-6 border-t border-line pt-5">
                    <h3 className="text-sm font-bold">Sell shares</h3>
                    <form action={sellHolding} className="mt-3 flex flex-wrap items-end gap-3">
                      <input type="hidden" name="id" value={owned.id} />
                      <input type="hidden" name="redirectTo" value={`/stock/${ticker}`} />
                      <label className="flex flex-col gap-1 text-xs font-semibold">
                        Shares (you own {owned.shares})
                        <input
                          name="shares"
                          type="number"
                          step="any"
                          min="0.0001"
                          max={owned.shares}
                          required
                          placeholder={String(owned.shares)}
                          className="w-36 rounded-xl border border-line bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-accent"
                        />
                      </label>
                      <button className="rounded-full bg-negative px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                        Sell at {money(quote.price)}
                      </button>
                    </form>
                    <p className="mt-3 text-xs text-muted">
                      Sells at the live market price. The proceeds go back into your virtual cash
                      and your realized profit or loss is recorded on the dashboard.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="text-lg font-bold">News about {ticker}</h2>
            {news.length === 0 ? (
              <p className="mt-4 rounded-xl bg-background p-4 text-sm text-muted">
                No recent news for this company.
              </p>
            ) : (
              <ul className="mt-2">
                {news.map((n) => (
                  <li key={n.url} className="border-b border-line last:border-b-0">
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block py-3"
                    >
                      <span className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-accent">
                        {n.headline}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {n.source} · {timeAgo(n.datetime)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
