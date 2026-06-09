import type { JSX, ReactNode } from "react";

interface ToolHeaderProps {
  actions?: ReactNode;
  description: string;
  title: string;
}

export function ToolHeader({
  actions,
  description,
  title,
}: ToolHeaderProps): JSX.Element {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {actions}
    </header>
  );
}
