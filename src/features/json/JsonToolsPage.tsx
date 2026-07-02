import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Braces, Copy, RotateCcw, Rows3 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import {
  PaneHeader,
  ToolOutput,
  ToolSurface,
  ToolTextarea,
  ToolToolbar,
  ToolTitle,
} from "@/shared/components/ToolSurface";
import { formatJson, minifyJson, sortJsonKeys } from "./json.service";

export function JsonToolsPage(): JSX.Element {
  const [input, setInput] = useState(
    '{"name":"Forge","tools":["json","markdown"],"local":true}',
  );
  const [mode, setMode] = useState<"format" | "minify" | "sort">("format");
  const result = useMemo(() => {
    if (mode === "minify") {
      return minifyJson(input);
    }

    if (mode === "sort") {
      return sortJsonKeys(input);
    }

    return formatJson(input);
  }, [input, mode]);

  async function copyOutput(): Promise<void> {
    await navigator.clipboard.writeText(result.value);
  }

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Data" title="JSON Formatter" />
            <Button
              onClick={() => setMode("format")}
              size="sm"
              variant={mode === "format" ? "secondary" : "ghost"}
            >
              <Braces aria-hidden="true" className="h-4 w-4" />
              Format
            </Button>
            <Button
              onClick={() => setMode("minify")}
              size="sm"
              variant={mode === "minify" ? "secondary" : "ghost"}
            >
              <Rows3 aria-hidden="true" className="h-4 w-4" />
              Minify
            </Button>
            <Button
              onClick={() => setMode("sort")}
              size="sm"
              variant={mode === "sort" ? "secondary" : "ghost"}
            >
              <Braces aria-hidden="true" className="h-4 w-4" />
              Sort keys
            </Button>
          </>
        }
        right={
          <>
            <Tooltip content="Copy output" side="bottom">
              <Button
                aria-label="Copy output"
                disabled={!result.value}
                onClick={() => void copyOutput()}
                size="icon"
                variant="ghost"
              >
                <Copy aria-hidden="true" className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Reset" side="bottom">
              <Button
                aria-label="Reset"
                onClick={() => setInput("")}
                size="icon"
                variant="ghost"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
              </Button>
            </Tooltip>
          </>
        }
      />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        <div className="flex min-h-0 flex-col">
          <PaneHeader title="JSON input" tone="blue" />
          <ToolTextarea
            label="JSON input"
            onChange={setInput}
            placeholder="Paste JSON..."
            value={input}
          />
        </div>
        <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
          <ToolOutput error={result.error} label="Formatted output">
            <JsonPreview value={result.value} />
          </ToolOutput>
        </div>
      </div>
    </ToolSurface>
  );
}

function JsonPreview({ value }: { value: string }): JSX.Element {
  const highlighted = value.split(
    /("(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|true|false|null|-?\d+(?:\.\d+)?)/g,
  );

  return (
    <pre className="min-h-full whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-6 text-slate-900">
      {highlighted.map((part, index) => {
        const className = part.match(/^".*"(?=\s*$)/)
          ? "text-emerald-700"
          : /^(true|false|null)$/.test(part)
            ? "text-violet-700 font-semibold"
            : /^-?\d/.test(part)
              ? "text-orange-700"
              : "text-slate-900";

        return (
          <span
            className={
              part.endsWith('"') && value.includes(`${part}:`)
                ? "text-sky-700"
                : className
            }
            key={`${part}-${index}`}
          >
            {part}
          </span>
        );
      })}
    </pre>
  );
}
