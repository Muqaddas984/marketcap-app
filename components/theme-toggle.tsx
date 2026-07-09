"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function apply(next: boolean) {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.theme = next ? "dark" : "light";
  }

  return (
    <div className="flex rounded-full bg-background p-1">
      <button
        onClick={() => apply(false)}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors ${
          !dark ? "bg-card shadow-sm" : "text-muted"
        }`}
      >
        <Sun className="h-4 w-4" /> Light
      </button>
      <button
        onClick={() => apply(true)}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors ${
          dark ? "bg-card shadow-sm" : "text-muted"
        }`}
      >
        <Moon className="h-4 w-4" /> Dark
      </button>
    </div>
  );
}
