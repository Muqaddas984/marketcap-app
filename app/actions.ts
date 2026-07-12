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
  const backRaw = String(formData.get("redirectTo") ?? "/");
  const back = backRaw.startsWith("/") ? backRaw : "/";

  if (!/^[A-Z.]{1,10}$/.test(ticker)) redirect(`${back}?error=Enter a valid ticker symbol`);
  if (!Number.isFinite(shares) || shares <= 0)
    redirect(`${back}?error=Shares must be a positive number`);

  const [quote, profile] = await Promise.all([getQuote(ticker), getProfile(ticker)]);
  if (!quote) redirect(`${back}?error=Could not find a live quote for ${ticker}`);

  const buyPrice = buyPriceRaw ? Number(buyPriceRaw) : quote.price;
  if (!Number.isFinite(buyPrice) || buyPrice < 0)
    redirect(`${back}?error=Buy price must be a number`);

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
  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/");
  revalidatePath(back);
  redirect(back);
}

export async function sellHolding(formData: FormData) {
  const { supabase, user } = await requireUser();

  const id = String(formData.get("id") ?? "");
  const sharesToSell = Number(formData.get("shares"));
  const priceRaw = String(formData.get("sellPrice") ?? "").trim();
  const backRaw = String(formData.get("redirectTo") ?? "/");
  const back = backRaw.startsWith("/") ? backRaw : "/";

  const { data: holding } = await supabase
    .from("holdings")
    .select("id, ticker, name, shares, buy_price")
    .eq("id", id)
    .maybeSingle();
  if (!holding) redirect(`${back}?error=Holding not found`);

  const owned = Number(holding.shares);
  if (!Number.isFinite(sharesToSell) || sharesToSell <= 0)
    redirect(`${back}?error=Shares to sell must be a positive number`);
  if (sharesToSell > owned + 1e-9)
    redirect(`${back}?error=You only own ${owned} shares of ${holding.ticker}`);

  const quote = await getQuote(holding.ticker as string);
  const sellPrice = priceRaw ? Number(priceRaw) : quote?.price;
  if (!sellPrice || !Number.isFinite(sellPrice) || sellPrice <= 0)
    redirect(`${back}?error=Could not determine a sell price for ${holding.ticker}`);

  const buyPrice = Number(holding.buy_price);
  const profit = (sellPrice - buyPrice) * sharesToSell;

  const { error } = await supabase.from("sales").insert({
    user_id: user.id,
    ticker: holding.ticker,
    name: holding.name,
    shares: sharesToSell,
    buy_price: buyPrice,
    sell_price: sellPrice,
    profit,
  });
  if (error) redirect(`${back}?error=${encodeURIComponent(error.message)}`);

  const remaining = owned - sharesToSell;
  if (remaining > 1e-9) {
    await supabase.from("holdings").update({ shares: remaining }).eq("id", id);
  } else {
    await supabase.from("holdings").delete().eq("id", id);
  }

  revalidatePath("/", "layout");
  const sign = profit >= 0 ? "profit" : "loss";
  redirect(
    `${back}?message=${encodeURIComponent(
      `Sold ${sharesToSell} ${holding.ticker} at $${sellPrice.toFixed(2)} — ${sign} $${Math.abs(profit).toFixed(2)}`
    )}`
  );
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
  revalidatePath("/", "layout");
}

export async function removeFromWatchlist(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("watchlist").delete().eq("id", id);
  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
