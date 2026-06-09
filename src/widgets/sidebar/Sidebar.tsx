import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import {
  AlertTriangle,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Keyboard,
  MessageCircle,
  Newspaper,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { toolCategoryDefinitions } from "@/core/registry/tool.categories";
import { getToolsByCategory } from "@/core/registry/tool.registry";
import { useWorkspaceStore } from "@/core/workspace/workspace.store";
import { cn } from "@/shared/lib/cn";
import { Tooltip } from "@/shared/ui/tooltip";
import { SidebarGroup } from "./SidebarGroup";

export function Sidebar(): JSX.Element {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const sidebarCollapsed = useWorkspaceStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);
  const ToggleIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  useEffect(() => {
    if (!helpOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        event.target instanceof Node &&
        helpRef.current &&
        !helpRef.current.contains(event.target)
      ) {
        setHelpOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [helpOpen]);

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 bg-white transition-[width] duration-200 lg:flex lg:flex-col",
        sidebarCollapsed ? "w-14" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center",
          sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-3",
        )}
      >
        <Link
          aria-label="Go to home"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition hover:bg-slate-100"
          to="/"
        >
          <img alt="" className="h-6 w-6 object-contain" src="/favicon.svg" />
        </Link>
        <div className={cn(sidebarCollapsed && "sr-only")}>
          <p className="text-[14px] font-bold leading-5 text-slate-950">Forge</p>
          <p className="text-[11px] font-medium text-slate-500">Developer Workstation</p>
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
        className={cn("relative py-2.5", sidebarCollapsed ? "px-2" : "px-2.5")}
        ref={helpRef}
      >
        {helpOpen ? (
          <div
            className={cn(
              "absolute bottom-14 z-30 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-950/10",
              sidebarCollapsed ? "left-2 w-64" : "left-2.5 w-64",
            )}
          >
            <div className="p-2">
              <p className="px-2 pb-1 text-[11px] font-semibold text-slate-500">
                Support
              </p>
              <HelpMenuItem icon={MessageCircle} label="Ask a question" />
              <HelpMenuItem icon={AlertTriangle} label="Report an issue" />
              <HelpMenuItem icon={HeartHandshake} label="Share feedback" />
            </div>
            <div className="border-t border-slate-100 p-2">
              <p className="px-2 pb-1 text-[11px] font-semibold text-slate-500">
                Documentation
              </p>
              <HelpMenuItem
                icon={BookOpen}
                label="Product docs"
                onSelect={() => setHelpOpen(false)}
                to="/docs"
              />
              <HelpMenuItem icon={Route} label="Guides" />
              <HelpMenuItem icon={GraduationCap} label="Academy" />
              <HelpMenuItem icon={Newspaper} label="Changelog" />
              <HelpMenuItem icon={Keyboard} label="Keyboard shortcuts" />
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "flex gap-1",
            sidebarCollapsed ? "flex-col" : "items-center justify-between",
          )}
        >
          <Tooltip content="Settings" side="top">
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
              to="/settings"
            >
              <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
            </NavLink>
          </Tooltip>
          <Tooltip content="Help" side="top">
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
              type="button"
            >
              <HelpCircle aria-hidden="true" className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip
            content={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            side="top"
          >
            <button
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
              onClick={toggleSidebar}
              type="button"
            >
              <ToggleIcon aria-hidden="true" className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}

interface HelpMenuItemProps {
  icon: LucideIcon;
  label: string;
  onSelect?: () => void;
  to?: string;
}

function HelpMenuItem({
  icon: Icon,
  label,
  onSelect,
  to,
}: HelpMenuItemProps): JSX.Element {
  const className =
    "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700";

  if (to) {
    return (
      <NavLink className={className} onClick={onSelect} to={to}>
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </NavLink>
    );
  }

  return (
    <button className={className} onClick={onSelect} type="button">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
