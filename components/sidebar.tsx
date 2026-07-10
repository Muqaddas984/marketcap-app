import Link from "next/link";
import {
  House,
  LayoutGrid,
  ChartColumnBig,
  ChartNoAxesColumn,
  Globe,
  Users,
  Folder,
  LogIn,
  LogOut,
  Plus,
} from "lucide-react";
import { signOut } from "@/app/actions";
import { ThemeToggle } from "./theme-toggle";

const mainNav = [
  { label: "Overview", icon: House, href: "/" },
  { label: "My Stock", icon: LayoutGrid, href: "/#my-stock" },
  { label: "Portfolio", icon: ChartColumnBig, href: "/", active: true },
  { label: "Analytic", icon: ChartNoAxesColumn, soon: true },
  { label: "Community", icon: Globe, soon: true },
  { label: "Account", icon: Users, href: "/account" },
];

const files = ["Communication", "Affiliates", "Marketing"];

export function Sidebar({ email }: { email: string | null }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-2 border-r border-line bg-card px-5 py-7 lg:flex">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-9 w-9 grid-cols-2 gap-[3px] rounded-xl bg-accent p-2">
          <span className="rounded-full bg-white" />
          <span className="rounded-full bg-white" />
          <span className="rounded-full bg-white" />
          <span className="rounded-full bg-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Marketcap</span>
      </div>

      <nav className="flex flex-col gap-1">
        {mainNav.map(({ label, icon: Icon, active, href, soon }) => (
          <a
            key={label}
            href={href ?? "#"}
            title={soon ? "Coming soon" : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-background font-semibold text-ink"
                : soon
                  ? "cursor-default text-muted/60"
                  : "text-muted hover:bg-background hover:text-ink"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.8} />
            {label}
            {soon && (
              <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-muted">
                Soon
              </span>
            )}
          </a>
        ))}
      </nav>

      <div className="mt-6 border-t border-line pt-5">
        <div className="mb-2 flex items-center justify-between px-4">
          <span className="text-sm font-semibold">Files</span>
          <button
            aria-label="Add file group"
            className="rounded-md p-1 text-muted hover:bg-background hover:text-ink"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {files.map((label) => (
          <a
            key={label}
            href="#"
            title="Coming soon"
            className="flex cursor-default items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted/60"
          >
            <Folder className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {label}
          </a>
        ))}
      </div>

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
            className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-background"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </Link>
        )}
        <ThemeToggle />
      </div>
    </aside>
  );
}
