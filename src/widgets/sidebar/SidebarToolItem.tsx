import type { JSX } from "react";
import { NavLink } from "react-router";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { cn } from "@/shared/lib/cn";
import { Tooltip } from "@/shared/ui/tooltip";

interface SidebarToolItemProps {
  collapsed?: boolean;
  tool: ToolDefinition;
}

export function SidebarToolItem({
  collapsed = false,
  tool,
}: SidebarToolItemProps): JSX.Element {
  const Icon = tool.icon;

  const item = (
    <NavLink
      className={({ isActive }) =>
        cn("group flex items-center rounded-md text-[13px] font-medium transition", {
          "h-8 justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200":
            collapsed && !isActive,
          "h-8 justify-center bg-sky-50 text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200":
            collapsed && isActive,
          "min-h-8 gap-2 px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-950":
            !collapsed && !isActive,
          "min-h-8 gap-2 bg-sky-50 px-2.5 py-1.5 text-sky-700 ring-1 ring-sky-100":
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

  if (!collapsed) {
    return item;
  }

  return <Tooltip content={tool.name}>{item}</Tooltip>;
}
