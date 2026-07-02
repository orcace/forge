import type { JSX } from "react";
import { useMemo, useState } from "react";
import { ArrowLeftRight, Copy, RotateCcw } from "lucide-react";
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
import { convertJsonYaml, type JsonYamlDirection } from "./json-yaml.service";

export function JsonYamlPage(): JSX.Element {
  const [direction, setDirection] = useState<JsonYamlDirection>("json-to-yaml");
  const [input, setInput] = useState(
    '{"name":"Forge","category":"Developer tools","local":true}',
  );
  const result = useMemo(() => convertJsonYaml(input, direction), [direction, input]);

  function swapDirection(): void {
    setDirection((value) => (value === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml"));
    setInput(result.value);
  }

  async function copyOutput(): Promise<void> {
    await navigator.clipboard.writeText(result.value);
  }

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Data" title="JSON YAML Converter" />
            <Button onClick={swapDirection} size="sm" variant="secondary">
              <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
              {direction === "json-to-yaml" ? "JSON to YAML" : "YAML to JSON"}
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
          <PaneHeader
            title={direction === "json-to-yaml" ? "JSON input" : "YAML input"}
            tone={direction === "json-to-yaml" ? "blue" : "violet"}
          />
          <ToolTextarea
            label="Converter input"
            onChange={setInput}
            placeholder={
              direction === "json-to-yaml" ? "Paste JSON..." : "Paste simple YAML..."
            }
            value={input}
          />
        </div>
        <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
          <ToolOutput
            error={result.error}
            label={direction === "json-to-yaml" ? "YAML output" : "JSON output"}
          >
            <pre className="min-h-full whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-6 text-slate-900">
              {result.value.split("\n").map((line, index) => (
                <span className="block" key={`${line}-${index}`}>
                  <span className="text-violet-700">
                    {line.includes(":") ? line.slice(0, line.indexOf(":") + 1) : ""}
                  </span>
                  <span className="text-slate-800">
                    {line.includes(":") ? line.slice(line.indexOf(":") + 1) : line}
                  </span>
                </span>
              ))}
            </pre>
          </ToolOutput>
        </div>
      </div>
    </ToolSurface>
  );
}
