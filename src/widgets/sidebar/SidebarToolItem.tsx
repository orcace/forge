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
        cn("group flex items-center text-[13px] font-medium transition", {
          "h-8 justify-center text-slate-400 hover:text-slate-950 focus-visible:outline-none":
            collapsed && !isActive,
          "h-8 justify-center text-slate-700 hover:text-slate-950 focus-visible:outline-none":
            collapsed && isActive,
          "min-h-8 gap-2 rounded-md px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-950":
            !collapsed && !isActive,
          "min-h-8 gap-2 rounded-md bg-sky-50 px-2.5 py-1.5 text-sky-700 ring-1 ring-inset ring-sky-200":
            !collapsed && isActive,
        })
      }
      to={tool.route}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className={cn("min-w-0 flex-1 truncate", collapsed && "sr-only")}>
        {tool.name}
      </span>
    </NavLink>
  );
}
