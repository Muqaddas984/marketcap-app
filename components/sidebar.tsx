"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChartPie,
  House,
  LayoutGrid,
  Menu,
  ScrollText,
  Star,
  Users,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import { signOut } from "@/app/actions";
import { ThemeToggle } from "./theme-toggle";

const mainNav = [
  { label: "Overview", icon: House, href: "/", active: true },
  { label: "Holdings", icon: LayoutGrid, href: "/#my-stock" },
  { label: "Watchlist", icon: Star, href: "/#watchlist" },
  { label: "Analytics", icon: ChartPie, href: "/analytics" },
  { label: "History", icon: ScrollText, href: "/history" },
  { label: "Guide", icon: BookOpen, href: "/guide" },
  { label: "Account", icon: Users, href: "/account" },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 grid-cols-2 gap-[3px] rounded-xl bg-accent p-2">
        <span className="rounded-full bg-white" />
        <span className="rounded-full bg-white" />
        <span className="rounded-full bg-white" />
        <span className="rounded-full bg-white" />
      </div>
      <span className="text-xl font-bold tracking-tight">Marketcap</span>
    </div>
  );
}

export function Sidebar({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-card px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-xl p-2 text-ink hover:bg-background"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Backdrop when the mobile drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-2 border-r border-line bg-card px-5 py-7 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-xl p-1.5 text-muted hover:bg-background hover:text-ink lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {mainNav.map(({ label, icon: Icon, active, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-background font-semibold text-ink"
                  : "text-muted hover:bg-background hover:text-ink"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {email ? (
            <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {email[0].toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium">{email}</span>
              <form action={signOut}>
                <button
                  aria-label="Sign out"
                  className="rounded-md p-1 text-muted hover:bg-card hover:text-ink"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-background"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
