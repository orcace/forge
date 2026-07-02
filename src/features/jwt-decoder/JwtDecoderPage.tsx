import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Copy, RotateCcw, ShieldCheck } from "lucide-react";
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
import { decodeJwt } from "./jwt-decoder.service";

export function JwtDecoderPage(): JSX.Element {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => decodeJwt(token), [token]);

  async function copyPayload(): Promise<void> {
    await navigator.clipboard.writeText(decoded.payload);
  }

  return (
    <ToolSurface>
      <ToolToolbar
        left={
          <>
            <ToolTitle eyebrow="Data" title="JWT Decoder" />
            <p className="hidden items-center gap-2 text-[12px] font-medium text-slate-500 md:flex">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-sky-600" />
              Local decode, no persistence.
            </p>
          </>
        }
        right={
          <>
            <span
              className={
                decoded.error
                  ? "rounded-md bg-red-50 px-2 py-1 text-[12px] font-semibold text-red-700 ring-1 ring-red-100"
                  : decoded.payload
                    ? "rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-100"
                    : "rounded-md bg-slate-50 px-2 py-1 text-[12px] font-semibold text-slate-500 ring-1 ring-slate-100"
              }
            >
              {decoded.error ? "Invalid JWT" : decoded.payload ? "Valid JWT" : "Waiting"}
            </span>
            <Tooltip content="Copy payload" side="bottom">
              <Button
                aria-label="Copy payload"
                disabled={!decoded.payload}
                onClick={() => void copyPayload()}
                size="icon"
                variant="ghost"
              >
                <Copy aria-hidden="true" className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Reset" side="bottom">
              <Button
                aria-label="Reset"
                onClick={() => setToken("")}
                size="icon"
                variant="ghost"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
              </Button>
            </Tooltip>
          </>
        }
      />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1fr_1.2fr]">
        <div className="flex min-h-0 flex-col">
          <PaneHeader title="Encoded token" tone="violet" />
          <ToolTextarea
            label="JWT input"
            onChange={setToken}
            placeholder="Paste JWT..."
            value={token}
          />
        </div>
        <div className="grid min-h-0 border-t border-slate-200 lg:border-l lg:border-t-0">
          <ToolOutput error={decoded.error} label="Decoded token">
            <div className="grid gap-3 p-4">
              <pre className="overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-[13px] leading-6 text-slate-900">
                {decoded.header || "Header"}
              </pre>
              <pre className="overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-[13px] leading-6 text-slate-900">
                {decoded.payload || "Payload"}
              </pre>
              <p className="break-all font-mono text-[12px] leading-5 text-slate-500">
                {decoded.signature || "Signature"}
              </p>
            </div>
          </ToolOutput>
        </div>
      </div>
    </ToolSurface>
  );
}
