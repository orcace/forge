import type { JSX } from "react";
import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ResultRow } from "@/shared/components/ToolSurface";
import { createUuidBatch } from "./uuid.service";

export function UuidPage(): JSX.Element {
  const [count, setCount] = useState(5);
  const [values, setValues] = useState(() => createUuidBatch(5));

  function generate(): void {
    setValues(createUuidBatch(count));
  }

  async function copyAll(): Promise<void> {
    await navigator.clipboard.writeText(values.join("\n"));
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03]">
      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-1.5">
        <div className="mr-2 min-w-0">
          <h1 className="truncate text-[15px] font-semibold text-slate-950">
            UUID Generator
          </h1>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Utilities
          </p>
        </div>
        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600">
          Quantity
          <input
            className="h-8 w-20 rounded-md border border-slate-200 px-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            max={100}
            min={1}
            onChange={(event) => setCount(Number(event.target.value))}
            type="number"
            value={count}
          />
        </label>
        <Button onClick={generate} size="sm" variant="secondary">
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Generate
        </Button>
        <Button onClick={() => void copyAll()} size="sm" variant="ghost">
          <Copy aria-hidden="true" className="h-4 w-4" />
          Copy all
        </Button>
      </div>
      <div className="scrollbar-forge min-h-0 flex-1 overflow-auto bg-slate-50/50 p-4">
        <div className="grid gap-2">
          {values.map((value, index) => (
            <ResultRow
              key={value}
              label={`UUID ${index + 1}`}
              onCopy={() => void navigator.clipboard.writeText(value)}
              value={value}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
