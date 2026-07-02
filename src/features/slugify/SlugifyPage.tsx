import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  ToolOutput,
  ToolSurface,
  ToolTextarea,
  ToolToolbar,
  ToolTitle,
} from "@/shared/components/ToolSurface";
import { createSlug } from "./slugify.service";

export function SlugifyPage(): JSX.Element {
  const [input, setInput] = useState("Forge Markdown Preview Design Language");
  const slug = useMemo(() => createSlug(input), [input]);

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Utilities" title="Slugify" />
            <p className="hidden text-[12px] font-medium text-slate-500 md:block">
              Create lowercase URL-safe slugs.
            </p>
          </>
        }
        right={
          <>
            <Button
              disabled={!slug}
              onClick={() => void navigator.clipboard.writeText(slug)}
              size="sm"
              variant="ghost"
            >
              <Copy aria-hidden="true" className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={() => setInput("")} size="sm" variant="ghost">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reset
            </Button>
          </>
        }
      />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        <ToolTextarea
          label="Slug input"
          onChange={setInput}
          placeholder="Text to slugify..."
          value={input}
        />
        <div className="border-t border-slate-200 lg:border-l lg:border-t-0">
          <ToolOutput label="Slug" value={slug} />
        </div>
      </div>
    </ToolSurface>
  );
}
