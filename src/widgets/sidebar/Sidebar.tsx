import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  AlertTriangle,
  BookOpen,
  HeartHandshake,
  Keyboard,
  MessageCircle,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  ScrollText,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { toolCategoryDefinitions } from "@/core/registry/tool.categories";
import { getToolsByCategory } from "@/core/registry/tool.registry";
import { useThemeStore } from "@/core/theme/theme.store";
import type { ThemeMode } from "@/core/theme/theme.types";
import { useWorkspaceStore } from "@/core/workspace/workspace.store";
import { cn } from "@/shared/lib/cn";
import { SidebarGroup } from "./SidebarGroup";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  onOpenShortcuts: () => void;
}

export function Sidebar({
  mobileOpen,
  onMobileOpenChange,
  onOpenShortcuts,
}: SidebarProps): JSX.Element {
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const themeMode = useThemeStore((state) => state.mode);
  const sidebarCollapsed = useWorkspaceStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);
  const ToggleIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;
  const effectiveCollapsed = sidebarCollapsed && !mobileOpen;
  const [systemTheme, setSystemTheme] = useState<Exclude<ThemeMode, "system">>(
    "light",
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateSystemTheme(): void {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    }

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  const isDarkTheme =
    themeMode === "dark" || (themeMode === "system" && systemTheme === "dark");

  useEffect(() => {
    onMobileOpenChange(false);
    setHelpOpen(false);
  }, [location.pathname, onMobileOpenChange]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onMobileOpenChange(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onMobileOpenChange]);

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
    <>
      {mobileOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => onMobileOpenChange(false)}
          type="button"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-dvh shrink-0 flex-col bg-white transition-[transform,width] duration-200 lg:static lg:z-auto lg:h-screen",
          effectiveCollapsed ? "w-14" : "w-64 lg:w-56 xl:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-slate-200",
            effectiveCollapsed ? "justify-center px-2" : "gap-2.5 px-3",
          )}
        >
          <Link
            aria-label="Go to home"
            className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition hover:bg-slate-100 dark:hover:bg-white/10"
            to="/"
          >
            <img
              alt=""
              className="h-5.5 w-5.5 object-contain opacity-95 transition group-hover:opacity-100"
              src={isDarkTheme ? "/forge-white.svg" : "/forge-black.svg"}
            />
          </Link>
          <Link
            className={cn(
              "min-w-0 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              effectiveCollapsed && "sr-only",
            )}
            to="/"
          >
            <p className="text-[14px] font-bold leading-5 text-slate-950">Forge</p>
            <p className="text-[11px] font-medium text-slate-500">
              Developer Workstation
            </p>
          </Link>
        </div>

        <nav
          aria-label="Tool navigation"
          className={cn(
            "scrollbar-forge flex-1 overflow-y-auto py-4",
            effectiveCollapsed ? "px-2" : "px-2.5",
          )}
        >
          <div className={cn(effectiveCollapsed ? "space-y-2" : "space-y-3")}>
            {toolCategoryDefinitions.map((category) => {
              const tools = getToolsByCategory(category.id);

              if (tools.length === 0) {
                return null;
              }

              return (
                <SidebarGroup
                  category={category}
                  key={category.id}
                  sidebarCollapsed={effectiveCollapsed}
                  tools={tools}
                />
              );
            })}
          </div>
        </nav>

        <div
          className={cn("relative py-2.5", effectiveCollapsed ? "px-2" : "px-2.5")}
          ref={helpRef}
        >
          {helpOpen ? (
              <div
              className={cn(
                "absolute bottom-14 z-30 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-pink-400/20 dark:bg-[#100b18] dark:shadow-black/40",
                effectiveCollapsed ? "left-2 w-64" : "left-2.5 w-64",
              )}
            >
              <div className="p-2">
                <p className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-pink-300">
                  Support
                </p>
                <HelpMenuItem
                  icon={MessageCircle}
                  label="Ask a question"
                  onSelect={() => setHelpOpen(false)}
                  to="/support/ask"
                />
                <HelpMenuItem
                  icon={AlertTriangle}
                  label="Report an issue"
                  onSelect={() => setHelpOpen(false)}
                  href="https://github.com/orcace/forge/issues"
                />
                <HelpMenuItem
                  icon={HeartHandshake}
                  label="Share feedback"
                  onSelect={() => setHelpOpen(false)}
                  to="/support/feedback"
                />
              </div>
              <div className="border-t border-slate-100 p-2 dark:border-pink-400/15">
                <p className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-pink-300">
                  Documentation
                </p>
                <HelpMenuItem
                  icon={BookOpen}
                  label="Product docs"
                  onSelect={() => setHelpOpen(false)}
                  to="/docs"
                />
                <HelpMenuItem
                  icon={Route}
                  label="Guides"
                  onSelect={() => setHelpOpen(false)}
                  to="/docs/guides"
                />
                <HelpMenuItem
                  icon={Keyboard}
                  label="Keyboard shortcuts"
                  onSelect={() => {
                    setHelpOpen(false);
                    onOpenShortcuts();
                  }}
                />
              </div>
              <div className="border-t border-slate-100 p-2 dark:border-pink-400/15">
                <p className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-pink-300">
                  Trust
                </p>
                <HelpMenuItem
                  icon={ShieldCheck}
                  label="Privacy"
                  onSelect={() => setHelpOpen(false)}
                  to="/privacy"
                />
                <HelpMenuItem
                  icon={ScrollText}
                  label="Terms"
                  onSelect={() => setHelpOpen(false)}
                  to="/terms"
                />
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "flex gap-1",
              effectiveCollapsed ? "flex-col" : "items-center justify-between",
            )}
          >
              <NavLink
              aria-label="Settings"
              className={({ isActive }) =>
                cn("flex h-9 w-9 items-center justify-center transition", {
                  "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none dark:text-pink-200/70 dark:hover:bg-pink-400/10 dark:hover:text-pink-200":
                    effectiveCollapsed && !isActive,
                  "rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none dark:text-pink-200 dark:hover:bg-pink-400/10 dark:hover:text-pink-200":
                    effectiveCollapsed && isActive,
                  "rounded-md bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-pink-400/12 dark:text-pink-200 dark:ring-pink-300/25":
                    !effectiveCollapsed && isActive,
                  "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-pink-200/70 dark:hover:bg-pink-400/10 dark:hover:text-pink-200":
                    !effectiveCollapsed && !isActive,
                })
              }
              to="/settings"
            >
              <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
            </NavLink>
            <button
              aria-expanded={helpOpen}
              aria-label="Help"
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center transition",
                {
                  "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none dark:text-pink-200/70 dark:hover:bg-pink-400/10 dark:hover:text-pink-200":
                    effectiveCollapsed && !helpOpen,
                  "rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none dark:text-pink-200 dark:hover:bg-pink-400/10 dark:hover:text-pink-200":
                    effectiveCollapsed && helpOpen,
                  "rounded-md bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-pink-400/12 dark:text-pink-200 dark:ring-pink-300/25":
                    !effectiveCollapsed && helpOpen,
                  "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-pink-200/70 dark:hover:bg-pink-400/10 dark:hover:text-pink-200":
                    !effectiveCollapsed && !helpOpen,
                },
              )}
              onClick={() => setHelpOpen((value) => !value)}
              type="button"
            >
              <HelpCircle aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "hidden h-9 w-9 shrink-0 items-center justify-center transition lg:flex",
                effectiveCollapsed
                  ? "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none dark:text-pink-200/70 dark:hover:bg-pink-400/10 dark:hover:text-pink-200"
                  : "rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-pink-200/70 dark:hover:bg-pink-400/10 dark:hover:text-pink-200",
              )}
              onClick={toggleSidebar}
              type="button"
            >
              <ToggleIcon aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

interface HelpMenuItemProps {
  icon: LucideIcon;
  href?: string;
  label: string;
  onSelect?: () => void;
  to?: string;
}

function HelpMenuItem({
  href,
  icon: Icon,
  label,
  onSelect,
  to,
}: HelpMenuItemProps): JSX.Element {
  const className =
    "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 [&.active]:bg-sky-50 [&.active]:text-sky-700 [&.active]:ring-1 [&.active]:ring-inset [&.active]:ring-sky-200 dark:text-pink-50 dark:hover:bg-pink-400/12 dark:hover:text-pink-200 dark:[&.active]:bg-pink-400/14 dark:[&.active]:text-pink-200 dark:[&.active]:ring-1 dark:[&.active]:ring-inset dark:[&.active]:ring-pink-300/20";

  if (to) {
    return (
      <NavLink className={className} end onClick={onSelect} to={to}>
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </NavLink>
    );
  }

  if (href) {
    return (
      <a
        className={className}
        href={href}
        onClick={onSelect}
        rel="noreferrer"
        target="_blank"
      >
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button className={className} onClick={onSelect} type="button">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
