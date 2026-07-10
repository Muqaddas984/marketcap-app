"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getQuote, getProfile } from "@/lib/finnhub";

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function addHolding(formData: FormData) {
  const { supabase, user } = await requireUser();

  const ticker = String(formData.get("ticker") ?? "").trim().toUpperCase();
  const shares = Number(formData.get("shares"));
  const buyPriceRaw = String(formData.get("buyPrice") ?? "").trim();
  const investDate = String(formData.get("investDate") ?? "").trim();

  if (!/^[A-Z.]{1,10}$/.test(ticker)) redirect("/?error=Enter a valid ticker symbol");
  if (!Number.isFinite(shares) || shares <= 0) redirect("/?error=Shares must be a positive number");

  const [quote, profile] = await Promise.all([getQuote(ticker), getProfile(ticker)]);
  if (!quote) redirect(`/?error=Could not find a live quote for ${ticker}`);

  const buyPrice = buyPriceRaw ? Number(buyPriceRaw) : quote.price;
  if (!Number.isFinite(buyPrice) || buyPrice < 0) redirect("/?error=Buy price must be a number");

  const { error } = await supabase.from("holdings").upsert(
    {
      user_id: user.id,
      ticker,
      name: profile?.name ?? ticker,
      shares,
      buy_price: buyPrice,
      invest_date: investDate || new Date().toISOString().slice(0, 10),
    },
    { onConflict: "user_id,ticker" }
  );
  if (error) redirect(`/?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/");
  redirect("/");
}

export async function deleteHolding(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("holdings").delete().eq("id", id);
  revalidatePath("/");
}

export async function addToWatchlist(ticker: string, name: string) {
  const { supabase, user } = await requireUser();
  if (!/^[A-Z.]{1,10}$/.test(ticker)) return;
  await supabase
    .from("watchlist")
    .upsert({ user_id: user.id, ticker, name }, { onConflict: "user_id,ticker" });
  revalidatePath("/");
}

export async function removeFromWatchlist(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("watchlist").delete().eq("id", id);
  revalidatePath("/");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
