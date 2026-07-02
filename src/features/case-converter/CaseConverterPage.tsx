import type { JSX } from "react";
import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  ResultRow,
  ToolSurface,
  ToolTextarea,
  ToolToolbar,
  ToolTitle,
} from "@/shared/components/ToolSurface";
import { convertCases } from "./case-converter.service";

export function CaseConverterPage(): JSX.Element {
  const [input, setInput] = useState("Forge developer workstation");
  const variants = useMemo(() => convertCases(input), [input]);

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Utilities" title="Case Converter" />
            <p className="hidden text-[12px] font-medium text-slate-500 md:block">
              Convert text into common naming conventions.
            </p>
          </>
        }
        right={
          <Button
            aria-label="Reset"
            onClick={() => setInput("")}
            size="sm"
            variant="ghost"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset
          </Button>
        }
      />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        <ToolTextarea
          label="Case input"
          onChange={setInput}
          placeholder="Text to convert..."
          value={input}
        />
        <div className="scrollbar-forge min-h-0 overflow-auto border-t border-slate-200 bg-slate-50/50 p-4 lg:border-l lg:border-t-0">
          <div className="grid gap-2">
            {variants.map((variant) => (
              <ResultRow
                key={variant.label}
                label={variant.label}
                onCopy={() => void navigator.clipboard.writeText(variant.value)}
                value={variant.value}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolSurface>
  );
}
