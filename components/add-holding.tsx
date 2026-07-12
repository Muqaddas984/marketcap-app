"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { buyStock } from "@/app/actions";

export function AddHolding() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> Buy stock
      </button>
    );
  }

  return (
    <form
      action={buyStock}
      className="flex flex-wrap items-end gap-3 rounded-2xl bg-background p-4"
    >
      <label className="flex flex-col gap-1 text-xs font-semibold">
        Ticker
        <input
          name="ticker"
          required
          placeholder="AAPL"
          className="w-24 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-normal uppercase outline-none focus:border-accent"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold">
        Shares
        <input
          name="shares"
          type="number"
          step="any"
          min="0.0001"
          required
          placeholder="10"
          className="w-24 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-normal outline-none focus:border-accent"
        />
      </label>
      <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
        Buy at live price
      </button>
      <button
        type="button"
        aria-label="Cancel"
        onClick={() => setOpen(false)}
        className="rounded-full p-2 text-muted hover:bg-card hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
