import type { ChangeEvent, JSX, UIEvent } from "react";
import { useEffect, useMemo, useRef } from "react";
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  FilePlus2,
  PanelRight,
  RotateCcw,
  X,
} from "lucide-react";
import { usePersistedToolState } from "@/core/storage/use-persisted-tool-state";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import {
  MarkdownPreviewStateSchema,
  type MarkdownPreviewState,
  type MarkdownPreviewTab,
} from "./markdown-preview.schema";
import {
  createMarkdownPreviewState,
  createMarkdownPreviewTab,
  estimateMarkdownReadTime,
  renderMarkdownToHtml,
} from "./markdown-preview.service";

export function MarkdownPreviewPage(): JSX.Element {
  const [storedState, setState] = usePersistedToolState<MarkdownPreviewState>(
    "markdown-preview",
    createMarkdownPreviewState(),
  );
  const parsedState = MarkdownPreviewStateSchema.safeParse(storedState);
  const state = parsedState.success ? parsedState.data : createMarkdownPreviewState();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const activeTab =
    state.tabs.find((tab) => tab.id === state.activeTabId) ?? state.tabs[0];
  const renderedHtml = useMemo(
    () => renderMarkdownToHtml(activeTab.content),
    [activeTab.content],
  );
  const readTime = useMemo(
    () => estimateMarkdownReadTime(activeTab.content),
    [activeTab.content],
  );

  useEffect(() => {
    if (!parsedState.success) {
      setState(state);
    }
  }, [parsedState.success, setState, state]);

  function updateState(nextState: MarkdownPreviewState): void {
    setState(nextState);
  }

  function updateActiveTab(nextTab: MarkdownPreviewTab): void {
    updateState({
      ...state,
      tabs: state.tabs.map((tab) => (tab.id === nextTab.id ? nextTab : tab)),
    });
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    updateActiveTab({
      ...activeTab,
      content: event.target.value,
      updatedAt: Date.now(),
    });
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>): void {
    updateActiveTab({
      ...activeTab,
      title: event.target.value || "Untitled",
      updatedAt: Date.now(),
    });
  }

  function addTab(): void {
    const tab = createMarkdownPreviewTab(state.tabs.length + 1);

    updateState({
      ...state,
      activeTabId: tab.id,
      tabs: [...state.tabs, tab],
    });
  }

  function closeTab(tabId: string): void {
    if (state.tabs.length === 1) {
      return;
    }

    const nextTabs = state.tabs.filter((tab) => tab.id !== tabId);
    const nextActiveTab =
      nextTabs.find((tab) => tab.id === state.activeTabId) ?? nextTabs[0];

    updateState({
      ...state,
      activeTabId: nextActiveTab.id,
      tabs: nextTabs,
    });
  }

  function resetActiveTab(): void {
    updateActiveTab({
      ...activeTab,
      content: "",
      updatedAt: Date.now(),
    });
  }

  async function copyMarkdown(): Promise<void> {
    await navigator.clipboard.writeText(activeTab.content);
  }

  function exportHtml(): void {
    const documentHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${activeTab.title}</title>
</head>
<body>
${renderedHtml}
</body>
</html>`;
    const blob = new Blob([documentHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${activeTab.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "markdown-preview"}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleEditorScroll(event: UIEvent<HTMLTextAreaElement>): void {
    if (!state.syncScroll || !previewRef.current) {
      return;
    }

    const source = event.currentTarget;
    const scrollable = source.scrollHeight - source.clientHeight;
    const ratio = scrollable <= 0 ? 0 : source.scrollTop / scrollable;
    const targetScrollable =
      previewRef.current.scrollHeight - previewRef.current.clientHeight;

    previewRef.current.scrollTop = targetScrollable * ratio;
  }

  return (
    <section className="flex min-h-[calc(100vh-11rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03]">
      <div className="flex min-h-11 items-center gap-1 border-b border-slate-100 px-2">
        <div className="scrollbar-forge flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {state.tabs.map((tab) => (
            <button
              className={cn(
                "group flex h-8 max-w-48 shrink-0 items-center gap-2 rounded-md px-2.5 text-[13px] font-semibold transition",
                tab.id === activeTab.id
                  ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
              key={tab.id}
              onClick={() => updateState({ ...state, activeTabId: tab.id })}
              type="button"
            >
              <span className="truncate">{tab.title}</span>
              {state.tabs.length > 1 ? (
                <span
                  aria-label={`Close ${tab.title}`}
                  className="rounded p-0.5 text-slate-400 opacity-0 transition hover:bg-white hover:text-slate-700 group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </button>
          ))}
          <Tooltip content="New tab" side="bottom">
            <Button
              aria-label="New tab"
              className="h-8 w-8 shrink-0"
              onClick={addTab}
              size="icon"
              variant="ghost"
            >
              <FilePlus2 aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Tooltip
            content={state.syncScroll ? "Disable sync scroll" : "Enable sync scroll"}
            side="bottom"
          >
            <Button
              aria-label="Toggle sync scroll"
              className={cn(state.syncScroll && "bg-sky-50 text-sky-700")}
              onClick={() => updateState({ ...state, syncScroll: !state.syncScroll })}
              size="icon"
              variant="ghost"
            >
              <PanelRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip
            content={state.previewVisible ? "Hide preview" : "Show preview"}
            side="bottom"
          >
            <Button
              aria-label="Toggle preview"
              onClick={() =>
                updateState({ ...state, previewVisible: !state.previewVisible })
              }
              size="icon"
              variant="ghost"
            >
              {state.previewVisible ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </Button>
          </Tooltip>
          <Tooltip content="Copy Markdown" side="bottom">
            <Button
              aria-label="Copy Markdown"
              onClick={() => {
                void copyMarkdown();
              }}
              size="icon"
              variant="ghost"
            >
              <Copy aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Export HTML" side="bottom">
            <Button
              aria-label="Export HTML"
              onClick={exportHtml}
              size="icon"
              variant="ghost"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Reset tab" side="bottom">
            <Button
              aria-label="Reset tab"
              onClick={resetActiveTab}
              size="icon"
              variant="ghost"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-2">
        <input
          aria-label="Document title"
          className="h-8 min-w-0 flex-1 rounded-md border border-transparent bg-slate-50 px-2.5 text-[13px] font-semibold text-slate-900 outline-none transition focus:border-sky-200 focus:bg-white focus:ring-2 focus:ring-sky-100"
          onChange={handleTitleChange}
          value={activeTab.title}
        />
        <p className="shrink-0 text-[12px] font-medium text-slate-500">
          {activeTab.content.length.toLocaleString()} chars · {readTime} min read
        </p>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1",
          state.previewVisible ? "lg:grid-cols-2" : "grid-cols-1",
        )}
      >
        <label className="flex min-h-0 flex-col">
          <span className="sr-only">Markdown input</span>
          <textarea
            className="scrollbar-forge min-h-[520px] flex-1 resize-none border-0 bg-white p-4 font-mono text-[13px] leading-6 text-slate-900 outline-none placeholder:text-slate-400"
            onChange={handleContentChange}
            onScroll={handleEditorScroll}
            placeholder="# Start writing Markdown..."
            ref={editorRef}
            spellCheck={false}
            value={activeTab.content}
          />
        </label>

        {state.previewVisible ? (
          <div
            className="scrollbar-forge min-h-[520px] overflow-auto border-t border-slate-100 bg-slate-50/60 p-5 lg:border-l lg:border-t-0"
            ref={previewRef}
          >
            <div
              className="forge-markdown mx-auto max-w-3xl rounded-md bg-white p-6 shadow-sm shadow-slate-950/[0.04]"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
