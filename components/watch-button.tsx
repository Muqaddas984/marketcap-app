"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { addToWatchlist, removeFromWatchlist } from "@/app/actions";

export function WatchButton({
  ticker,
  name,
  watchId,
}: {
  ticker: string;
  name: string;
  watchId: string | null;
}) {
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();
  const watched = optimistic ?? watchId !== null;

  function toggle() {
    setOptimistic(!watched);
    startTransition(async () => {
      if (watched && watchId) await removeFromWatchlist(watchId);
      else await addToWatchlist(ticker, name);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
        watched
          ? "border-accent bg-accent-soft text-accent"
          : "border-line text-ink hover:bg-background"
      }`}
    >
      <Star className={`h-4 w-4 ${watched ? "fill-accent" : ""}`} />
      {watched ? "Watching" : "Watch"}
    </button>
  );
}
