import { NextResponse, type NextRequest } from "next/server";
import { getCandles, CHART_RANGES, type ChartRange } from "@/lib/price-history";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() ?? "";
  const range = request.nextUrl.searchParams.get("range") ?? "";

  if (!/^[A-Z.]{1,10}$/.test(symbol) || !CHART_RANGES.includes(range as ChartRange)) {
    return NextResponse.json({ candles: [] }, { status: 400 });
  }

  const candles = await getCandles(symbol, range as ChartRange);
  return NextResponse.json({ candles });
}
