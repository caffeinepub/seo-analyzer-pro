import { cn } from "@/lib/utils";
import {
  FileText,
  Globe,
  LayoutDashboard,
  Search,
  TrendingUp,
} from "lucide-react";
import type { Page } from "../App";

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "crawler" as Page, label: "Site Crawler", icon: Globe },
  { id: "keywords" as Page, label: "Keyword Analyzer", icon: Search },
  { id: "recommendations" as Page, label: "SEO Reports", icon: FileText },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-sidebar-foreground text-sm leading-tight">
              SEO Analyzer
            </p>
            <p className="text-xs text-muted-foreground">Pro Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            data-ocid={`nav.${id}.link`}
            onClick={() => onNavigate(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left",
              currentPage === id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
