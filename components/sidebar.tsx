import {
  House,
  LayoutGrid,
  ChartColumnBig,
  ChartNoAxesColumn,
  Globe,
  Users,
  Folder,
  Plus,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const mainNav = [
  { label: "Overview", icon: House },
  { label: "My Stock", icon: LayoutGrid },
  { label: "Portfolio", icon: ChartColumnBig, active: true },
  { label: "Analytic", icon: ChartNoAxesColumn },
  { label: "Community", icon: Globe },
  { label: "Account", icon: Users },
];

const files = ["Communication", "Affiliates", "Marketing"];

export function Sidebar() {
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
        {mainNav.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
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
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:bg-background hover:text-ink"
          >
            <Folder className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {label}
          </a>
        ))}
      </div>

      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </aside>
  );
}
