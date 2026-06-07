import type { JSX, ReactNode } from "react";

interface ToolActionsProps {
  children: ReactNode;
}

export function ToolActions({ children }: ToolActionsProps): JSX.Element {
  return <div className="flex items-center gap-2">{children}</div>;
}
