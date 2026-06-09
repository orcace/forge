import type { JSX } from "react";
import { useState } from "react";
import { NavLink } from "react-router";
import {
  BookOpen,
  Box,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { toolCategoryDefinitions } from "@/core/registry/tool.categories";
import { getToolsByCategory } from "@/core/registry/tool.registry";
import { useWorkspaceStore } from "@/core/workspace/workspace.store";
import { cn } from "@/shared/lib/cn";
import { SidebarGroup } from "./SidebarGroup";

export function Sidebar(): JSX.Element {
  const [helpOpen, setHelpOpen] = useState(false);
  const sidebarCollapsed = useWorkspaceStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);
  const ToggleIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col",
        sidebarCollapsed ? "w-14" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-slate-200",
          sidebarCollapsed ? "justify-center px-2" : "justify-center px-4",
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-brand text-white shadow-sm shadow-sky-500/20">
          <Box aria-hidden="true" className="h-5 w-5" />
        </div>
      </div>

      <nav
        aria-label="Tool navigation"
        className={cn(
          "scrollbar-forge flex-1 overflow-y-auto py-4",
          sidebarCollapsed ? "px-2" : "px-2.5",
        )}
      >
        <div className={cn(sidebarCollapsed ? "space-y-3" : "space-y-4")}>
          {toolCategoryDefinitions.map((category) => {
            const tools = getToolsByCategory(category.id);

            if (tools.length === 0) {
              return null;
            }

            return (
              <SidebarGroup
                category={category}
                key={category.id}
                sidebarCollapsed={sidebarCollapsed}
                tools={tools}
              />
            );
          })}
        </div>
      </nav>

      <div
        className={cn(
          "relative border-t border-slate-200 py-2.5",
          sidebarCollapsed ? "px-2" : "px-2.5",
        )}
      >
        {helpOpen ? (
          <div
            className={cn(
              "absolute bottom-14 z-30 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10",
              sidebarCollapsed ? "left-2 w-48" : "left-2.5 right-2.5",
            )}
          >
            <NavLink
              className="flex h-9 items-center gap-2 rounded-md px-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
              onClick={() => setHelpOpen(false)}
              to="/docs"
            >
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              <span>Documentation</span>
            </NavLink>
          </div>
        ) : null}

        <div
          className={cn(
            "flex gap-1",
            sidebarCollapsed ? "flex-col" : "items-center justify-between",
          )}
        >
          <NavLink
            aria-label="Settings"
            className={({ isActive }) =>
              cn(
                "flex h-9 w-9 items-center justify-center rounded-md transition",
                isActive
                  ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
              )
            }
            title="Settings"
            to="/settings"
          >
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
          </NavLink>
          <button
            aria-expanded={helpOpen}
            aria-label="Help"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition",
              helpOpen
                ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
            )}
            onClick={() => setHelpOpen((value) => !value)}
            title="Help"
            type="button"
          >
            <HelpCircle aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            <ToggleIcon aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
