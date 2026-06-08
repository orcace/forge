import type { JSX, ReactNode } from "react";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { Badge } from "@/shared/ui/badge";

interface ToolLayoutProps {
  actions?: ReactNode;
  children: ReactNode;
  tool: ToolDefinition;
}

export function ToolLayout({ actions, children, tool }: ToolLayoutProps): JSX.Element {
  const Icon = tool.icon;

  return (
    <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-sm shadow-sky-500/20">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
                  {tool.name}
                </h1>
                <Badge tone={tool.status === "available" ? "success" : "neutral"}>
                  {tool.status === "available" ? "Available" : "Planned"}
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {tool.description}
              </p>
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}
