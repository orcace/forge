import type { ChangeEvent, JSX } from "react";
import { useEffect } from "react";
import {
  Code2,
  Copy,
  Download,
  Eye,
  Minimize2,
  Play,
  RotateCcw,
  Wand2,
} from "lucide-react";
import { usePersistedToolState } from "@/core/storage/use-persisted-tool-state";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import { HtmlPreviewStateSchema, type HtmlPreviewState } from "./html-preview.schema";
import {
  beautifyHtml,
  createHtmlPreviewDocument,
  createHtmlPreviewState,
  minifyHtml,
} from "./html-preview.service";

export function HtmlPreviewPage(): JSX.Element {
  const [storedState, setState] = usePersistedToolState<HtmlPreviewState>(
    "html-preview",
    createHtmlPreviewState(),
  );
  const parsedState = HtmlPreviewStateSchema.safeParse(storedState);
  const state = parsedState.success ? parsedState.data : createHtmlPreviewState();

  useEffect(() => {
    if (!parsedState.success) {
      setState(state);
    }
  }, [parsedState.success, setState, state]);

  function updateHtml(nextHtml: string): void {
    setState({
      ...state,
      html: nextHtml,
      previewHtml: state.autoUpdate ? nextHtml : state.previewHtml,
    });
  }

  function handleHtmlChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    updateHtml(event.target.value);
  }

  function runPreview(): void {
    setState({
      ...state,
      previewHtml: state.html,
    });
  }

  function toggleAutoUpdate(): void {
    setState({
      ...state,
      autoUpdate: !state.autoUpdate,
      previewHtml: !state.autoUpdate ? state.html : state.previewHtml,
    });
  }

  function resetHtml(): void {
    const nextState = createHtmlPreviewState();
    setState(nextState);
  }

  function applyBeautify(): void {
    updateHtml(beautifyHtml(state.html));
  }

  function applyMinify(): void {
    updateHtml(minifyHtml(state.html));
  }

  async function copyHtml(): Promise<void> {
    await navigator.clipboard.writeText(state.html);
  }

  function downloadHtml(): void {
    const blob = new Blob([createHtmlPreviewDocument(state.html)], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "forge-preview.html";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="flex min-h-[calc(100vh-11rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03]">
      <div className="flex min-h-11 flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
            <Code2 aria-hidden="true" className="h-4 w-4" />
          </div>
          <p className="truncate text-[13px] font-semibold text-slate-800">
            Sandboxed local HTML viewer
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            className={cn(
              "flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] font-semibold transition",
              state.autoUpdate
                ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
            )}
            onClick={toggleAutoUpdate}
            type="button"
          >
            <Eye aria-hidden="true" className="h-4 w-4" />
            Auto update
          </button>
          <Tooltip content="Run preview" side="bottom">
            <Button
              aria-label="Run preview"
              onClick={runPreview}
              size="icon"
              variant="ghost"
            >
              <Play aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Beautify HTML" side="bottom">
            <Button
              aria-label="Beautify HTML"
              onClick={applyBeautify}
              size="icon"
              variant="ghost"
            >
              <Wand2 aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Minify HTML" side="bottom">
            <Button
              aria-label="Minify HTML"
              onClick={applyMinify}
              size="icon"
              variant="ghost"
            >
              <Minimize2 aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Copy HTML" side="bottom">
            <Button
              aria-label="Copy HTML"
              onClick={() => {
                void copyHtml();
              }}
              size="icon"
              variant="ghost"
            >
              <Copy aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Download HTML" side="bottom">
            <Button
              aria-label="Download HTML"
              onClick={downloadHtml}
              size="icon"
              variant="ghost"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Reset" side="bottom">
            <Button aria-label="Reset" onClick={resetHtml} size="icon" variant="ghost">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <label className="flex min-h-0 flex-col">
          <span className="sr-only">HTML input</span>
          <textarea
            className="scrollbar-forge min-h-[520px] flex-1 resize-none border-0 bg-white p-4 font-mono text-[13px] leading-6 text-slate-900 outline-none placeholder:text-slate-400"
            onChange={handleHtmlChange}
            placeholder="Paste or write HTML..."
            spellCheck={false}
            value={state.html}
          />
        </label>

        <div className="min-h-[520px] border-t border-slate-100 bg-slate-50/60 p-3 lg:border-l lg:border-t-0">
          <iframe
            className="h-full min-h-[496px] w-full rounded-md border border-slate-200 bg-white"
            sandbox="allow-forms allow-modals allow-popups allow-same-origin"
            srcDoc={createHtmlPreviewDocument(state.previewHtml)}
            title="HTML preview output"
          />
        </div>
      </div>
    </section>
  );
}
