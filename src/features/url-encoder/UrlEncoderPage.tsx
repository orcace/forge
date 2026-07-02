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
import { decodeUrlComponent, encodeUrlComponent } from "./url-encoder.service";

export function UrlEncoderPage(): JSX.Element {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("https://forge.local/tools?name=Markdown Preview");
  const result = useMemo(() => {
    if (mode === "encode") {
      return { value: encodeUrlComponent(input) };
    }

    return decodeUrlComponent(input);
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
            <ToolTitle eyebrow="Encoding" title="URL Encoder" />
            <Button onClick={swapMode} size="sm" variant="secondary">
              <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
              {mode === "encode" ? "Encode URL" : "Decode URL"}
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
            title={mode === "encode" ? "Raw URL or text" : "Encoded URL"}
            tone="emerald"
          />
          <ToolTextarea
            label="URL input"
            onChange={setInput}
            placeholder={
              mode === "encode" ? "Text or URL to encode..." : "Percent-encoded text..."
            }
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
