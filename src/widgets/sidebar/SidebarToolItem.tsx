import type { JSX } from "react";
import { NavLink } from "react-router";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { cn } from "@/shared/lib/cn";

interface SidebarToolItemProps {
  collapsed?: boolean;
  tool: ToolDefinition;
}

export function SidebarToolItem({
  collapsed = false,
  tool,
}: SidebarToolItemProps): JSX.Element {
  const Icon = tool.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "group flex min-h-8 items-center rounded-md py-1.5 text-[13px] font-medium transition",
          collapsed ? "justify-center px-0" : "gap-2 px-2.5",
          isActive
            ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        )
      }
      title={collapsed ? tool.name : undefined}
      to={tool.route}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className={cn("min-w-0 flex-1 truncate", collapsed && "sr-only")}>
        {tool.name}
      </span>
    </NavLink>
  );
}
