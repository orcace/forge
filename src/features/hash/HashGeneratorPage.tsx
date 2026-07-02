import type { JSX } from "react";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import {
  ResultRow,
  ToolSurface,
  ToolTextarea,
  ToolToolbar,
  ToolTitle,
} from "@/shared/components/ToolSurface";
import { generateHashes, type HashDigest } from "./hash.service";

export function HashGeneratorPage(): JSX.Element {
  const [input, setInput] = useState("Forge developer workstation");
  const [hashes, setHashes] = useState<HashDigest[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function updateHashes(): Promise<void> {
      const nextHashes = input ? await generateHashes(input) : [];

      if (!cancelled) {
        setHashes(nextHashes);
      }
    }

    void updateHashes();

    return () => {
      cancelled = true;
    };
  }, [input]);

  async function copy(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Crypto" title="Hash Generator" />
            <p className="hidden text-[12px] font-medium text-slate-500 md:block">
              SHA digests are generated locally with Web Crypto.
            </p>
          </>
        }
        right={
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
        }
      />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        <ToolTextarea
          label="Hash input"
          onChange={setInput}
          placeholder="Text to hash..."
          value={input}
        />
        <div className="scrollbar-forge min-h-0 overflow-auto border-t border-slate-200 bg-slate-50/50 p-4 lg:border-l lg:border-t-0">
          <div className="grid gap-3">
            {hashes.map((hash) => (
              <ResultRow
                key={hash.algorithm}
                label={hash.algorithm}
                onCopy={() => void copy(hash.value)}
                value={hash.value}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolSurface>
  );
}
