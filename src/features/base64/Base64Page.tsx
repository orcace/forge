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
import { decodeBase64, encodeBase64 } from "./base64.service";

export function Base64Page(): JSX.Element {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Forge developer workstation");
  const result = useMemo(() => {
    if (mode === "encode") {
      return { value: encodeBase64(input) };
    }

    return decodeBase64(input);
  }, [input, mode]);

  function swapMode(): void {
    setMode((value) => (value === "encode" ? "decode" : "encode"));
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
            <ToolTitle eyebrow="Encoding" title="Base64" />
            <Button onClick={swapMode} size="sm" variant="secondary">
              <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
              {mode === "encode" ? "Encode" : "Decode"}
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
            title={mode === "encode" ? "Plain text" : "Base64 input"}
            tone="blue"
          />
          <ToolTextarea
            label="Base64 input"
            onChange={setInput}
            placeholder={mode === "encode" ? "Text to encode..." : "Base64 to decode..."}
            value={input}
          />
        </div>
        <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
          <ToolOutput error={result.error} label="Output" value={result.value} />
        </div>
      </div>
    </ToolSurface>
  );
}
