import type { JSX } from "react";
import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  ToolOutput,
  ToolSurface,
  ToolTextarea,
  ToolToolbar,
  ToolTitle,
} from "@/shared/components/ToolSurface";
import { testRegex } from "./regex-tester.service";

export function RegexTesterPage(): JSX.Element {
  const [pattern, setPattern] = useState("\\bForge\\b");
  const [flags, setFlags] = useState("gi");
  const [sample, setSample] = useState(
    "Forge includes Markdown Preview, HTML Preview, and more Forge tools.",
  );
  const result = useMemo(
    () => testRegex(pattern, flags, sample),
    [flags, pattern, sample],
  );

  function toggleFlag(flag: string): void {
    setFlags((value) =>
      value.includes(flag) ? value.replace(flag, "") : `${value}${flag}`,
    );
  }

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Utilities" title="Regex Tester" />
            <label className="min-w-0 flex-1">
              <span className="sr-only">Pattern</span>
              <input
                className="h-9 w-full rounded-md border border-slate-200 px-3 font-mono text-[13px] outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                onChange={(event) => setPattern(event.target.value)}
                placeholder="Regular expression pattern..."
                value={pattern}
              />
            </label>
          </>
        }
        right={
          <>
            {["g", "i", "m", "s", "u"].map((flag) => (
              <button
                aria-pressed={flags.includes(flag)}
                className={
                  flags.includes(flag)
                    ? "h-8 rounded-md bg-sky-50 px-2 font-mono text-xs font-semibold text-sky-700 ring-1 ring-sky-100"
                    : "h-8 rounded-md px-2 font-mono text-xs font-semibold text-slate-600 hover:bg-slate-100"
                }
                key={flag}
                onClick={() => toggleFlag(flag)}
                type="button"
              >
                {flag}
              </button>
            ))}
            <Button
              aria-label="Reset"
              onClick={() => {
                setPattern("");
                setSample("");
              }}
              size="icon"
              variant="ghost"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </Button>
          </>
        }
      />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        <ToolTextarea
          label="Sample text"
          onChange={setSample}
          placeholder="Text to test..."
          value={sample}
        />
        <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
          <ToolOutput error={result.error} label={`${result.matches.length} matches`}>
            <div className="grid gap-2 p-4">
              {result.matches.length === 0 && !result.error ? (
                <p className="text-sm text-slate-500">No matches.</p>
              ) : null}
              {result.matches.map((match, index) => (
                <div
                  className="rounded-md border border-slate-200 bg-white p-3"
                  key={`${match.index}-${index}`}
                >
                  <p className="text-[12px] font-semibold text-slate-500">
                    Index {match.index}
                  </p>
                  <p className="mt-1 break-all font-mono text-[13px] text-slate-950">
                    {match.match || "(empty match)"}
                  </p>
                  {match.groups.length > 0 ? (
                    <p className="mt-2 text-[12px] text-slate-500">
                      Groups: {match.groups.join(", ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </ToolOutput>
        </div>
      </div>
    </ToolSurface>
  );
}
