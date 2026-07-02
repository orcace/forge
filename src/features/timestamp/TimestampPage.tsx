import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Clock3, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ResultRow } from "@/shared/components/ToolSurface";
import { convertTimestampInput } from "./timestamp.service";

export function TimestampPage(): JSX.Element {
  const [input, setInput] = useState("");
  const conversion = useMemo(() => convertTimestampInput(input), [input]);

  return (
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.03]">
      <div>
        <h1 className="text-[15px] font-semibold text-slate-950">Timestamp Converter</h1>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Utilities
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Timestamp or date</span>
          <input
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Unix seconds, milliseconds, or date string..."
            value={input}
          />
        </label>
        <Button
          onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}
          size="sm"
          variant="secondary"
        >
          <Clock3 aria-hidden="true" className="h-4 w-4" />
          Now
        </Button>
        <Button onClick={() => setInput("")} size="sm" variant="ghost">
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Reset
        </Button>
      </div>
      {conversion ? (
        <div className="grid gap-2">
          <ResultRow
            label="Unix seconds"
            onCopy={() => void navigator.clipboard.writeText(String(conversion.seconds))}
            value={String(conversion.seconds)}
          />
          <ResultRow
            label="Unix milliseconds"
            onCopy={() =>
              void navigator.clipboard.writeText(String(conversion.milliseconds))
            }
            value={String(conversion.milliseconds)}
          />
          <ResultRow
            label="ISO 8601"
            onCopy={() => void navigator.clipboard.writeText(conversion.iso)}
            value={conversion.iso}
          />
          <ResultRow
            label="UTC"
            onCopy={() => void navigator.clipboard.writeText(conversion.utc)}
            value={conversion.utc}
          />
          <ResultRow
            label="Local"
            onCopy={() => void navigator.clipboard.writeText(conversion.local)}
            value={conversion.local}
          />
        </div>
      ) : (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          Unable to parse that timestamp or date.
        </div>
      )}
    </section>
  );
}
