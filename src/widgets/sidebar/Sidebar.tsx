import type { JSX } from "react";
import { NavLink } from "react-router";
import { Box, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";
import { toolCategoryDefinitions } from "@/core/registry/tool.categories";
import { getToolsByCategory } from "@/core/registry/tool.registry";
import { useWorkspaceStore } from "@/core/workspace/workspace.store";
import { cn } from "@/shared/lib/cn";
import { SidebarGroup } from "./SidebarGroup";

export function Sidebar(): JSX.Element {
  const sidebarCollapsed = useWorkspaceStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);
  const ToggleIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col",
        sidebarCollapsed ? "w-16" : "w-72",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-200",
          sidebarCollapsed ? "justify-center px-2" : "gap-3 px-5",
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-brand text-white shadow-sm shadow-sky-500/20">
          <Box aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className={cn(sidebarCollapsed && "sr-only")}>
          <p className="text-sm font-semibold text-slate-950">Forge</p>
          <p className="text-xs text-slate-500">Developer workstation</p>
        </div>
      </div>

      <nav
        aria-label="Tool navigation"
        className={cn(
          "scrollbar-forge flex-1 overflow-y-auto py-4",
          sidebarCollapsed ? "px-2" : "px-3",
        )}
      >
        <div className="space-y-6">
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
          "border-t border-slate-200 py-3",
          sidebarCollapsed ? "px-2" : "px-3",
        )}
      >
        <div className={cn("flex gap-1", sidebarCollapsed ? "flex-col" : "items-center")}>
          <NavLink
            aria-label="Settings"
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-md text-sm transition",
                sidebarCollapsed ? "justify-center px-0" : "flex-1 gap-3 px-3",
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )
            }
            title={sidebarCollapsed ? "Settings" : undefined}
            to="/settings"
          >
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className={cn(sidebarCollapsed && "sr-only")}>Settings</span>
          </NavLink>
          <button
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
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
