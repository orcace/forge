import type { JSX, ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
}

export function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Inbox aria-hidden="true" className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
