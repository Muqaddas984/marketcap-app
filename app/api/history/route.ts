import { NextResponse, type NextRequest } from "next/server";
import { getCandles, CHART_INTERVALS, type ChartInterval } from "@/lib/price-history";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() ?? "";
  const interval = request.nextUrl.searchParams.get("interval") ?? "";

  if (!/^[A-Z.]{1,10}$/.test(symbol) || !CHART_INTERVALS.includes(interval as ChartInterval)) {
    return NextResponse.json({ candles: [] }, { status: 400 });
  }

  const candles = await getCandles(symbol, interval as ChartInterval);
  return NextResponse.json({ candles });
}
