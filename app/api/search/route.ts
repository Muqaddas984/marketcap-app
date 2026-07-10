import { NextResponse, type NextRequest } from "next/server";
import { searchSymbols } from "@/lib/finnhub";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ hits: [] });
  const hits = await searchSymbols(q);
  return NextResponse.json({ hits });
}
