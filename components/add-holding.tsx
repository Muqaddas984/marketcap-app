"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addHolding } from "@/app/actions";

const inputClass =
  "rounded-xl border border-line bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-accent";

export function AddHolding() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> Add holding
      </button>
    );
  }

  return (
    <form
      action={addHolding}
      className="flex flex-wrap items-end gap-3 rounded-2xl bg-background p-4"
    >
      <label className="flex flex-col gap-1 text-xs font-semibold">
        Ticker
        <input name="ticker" required placeholder="AAPL" className={`${inputClass} w-24 uppercase`} />
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
          className={`${inputClass} w-24`}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold">
        Buy price (optional)
        <input
          name="buyPrice"
          type="number"
          step="any"
          min="0"
          placeholder="Current price"
          className={`${inputClass} w-32`}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold">
        Invest date
        <input name="investDate" type="date" className={inputClass} />
      </label>
      <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
        Save
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
