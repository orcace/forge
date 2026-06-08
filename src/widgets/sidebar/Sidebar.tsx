import type { JSX } from "react";
import { NavLink } from "react-router";
import { Box, FileText, Home, Settings } from "lucide-react";
import { toolCategoryDefinitions } from "@/core/registry/tool.categories";
import { getToolsByCategory } from "@/core/registry/tool.registry";
import { cn } from "@/shared/lib/cn";
import { SidebarGroup } from "./SidebarGroup";

const primaryLinks = [
  { icon: Home, label: "Home", to: "/" },
  { icon: FileText, label: "Docs", to: "/docs" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function Sidebar(): JSX.Element {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-brand text-white shadow-sm shadow-sky-500/20">
          <Box aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Forge</p>
          <p className="text-xs text-slate-500">Developer workstation</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5 space-y-1">
          {primaryLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition",
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )
                }
                key={link.to}
                to={link.to}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="space-y-6">
          {toolCategoryDefinitions.map((category) => {
            const tools = getToolsByCategory(category.id);

            if (tools.length === 0) {
              return null;
            }

            return <SidebarGroup category={category} key={category.id} tools={tools} />;
          })}
        </div>
      </nav>
    </aside>
  );
}
