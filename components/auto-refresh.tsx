"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-fetches server data every `seconds` so prices stay current while viewing. */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);

  return null;
}
