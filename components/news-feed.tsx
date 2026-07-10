import { getMarketNews } from "@/lib/finnhub";

function timeAgo(unixSeconds: number) {
  const mins = Math.max(1, Math.round((Date.now() / 1000 - unixSeconds) / 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export async function NewsFeed() {
  const news = await getMarketNews();

  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <h2 className="text-lg font-bold">Market News</h2>
      {news.length === 0 ? (
        <p className="mt-4 rounded-xl bg-background p-4 text-sm text-muted">
          News is unavailable right now — check back in a minute.
        </p>
      ) : (
        <ul className="mt-2">
          {news.map((n) => (
            <li key={n.url} className="border-b border-line last:border-b-0">
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-3.5"
              >
                {n.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.image}
                    alt=""
                    className="h-14 w-20 shrink-0 rounded-xl bg-background object-cover"
                  />
                ) : (
                  <span className="h-14 w-20 shrink-0 rounded-xl bg-background" />
                )}
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-accent">
                    {n.headline}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {n.source} · {timeAgo(n.datetime)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
