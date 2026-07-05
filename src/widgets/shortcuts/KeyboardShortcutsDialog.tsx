import type { JSX } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

interface KeyboardShortcutsDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const shortcutGroups = [
  {
    items: [{ keys: ["Ctrl", "K"], label: "Open command palette" }],
    title: "General",
  },
  {
    items: [
      { keys: ["Esc"], label: "Close dialogs, menus, and flyouts" },
      { keys: ["Up"], label: "Move to previous command palette result" },
      { keys: ["Down"], label: "Move to next command palette result" },
      { keys: ["Enter"], label: "Open selected command palette result" },
    ],
    title: "Navigation",
  },
  {
    items: [
      { keys: ["Ctrl", "A"], label: "Select editor content" },
      { keys: ["Ctrl", "C"], label: "Copy selected content" },
      { keys: ["Tab"], label: "Indent in JSON-style editors" },
    ],
    title: "Editors",
  },
];

export function KeyboardShortcutsDialog({
  onOpenChange,
  open,
}: KeyboardShortcutsDialogProps): JSX.Element | null {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]"
      role="dialog"
    >
      <button
        aria-label="Close keyboard shortcuts"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <section className="relative max-h-[82vh] w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/25">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-[18px] font-semibold tracking-normal text-slate-950">
            Keyboard shortcuts
          </h2>
          <button
            aria-label="Close keyboard shortcuts"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="scrollbar-forge max-h-[calc(82vh-4.5rem)] overflow-auto px-6 py-5">
          <div className="grid gap-5">
            {shortcutGroups.map((group) => (
              <section key={group.title}>
                <h3 className="text-[15px] font-semibold text-slate-950">
                  {group.title}
                </h3>
                <div className="mt-2 grid gap-2">
                  {group.items.map((item) => (
                    <div
                      className="flex items-center justify-between gap-4"
                      key={item.label}
                    >
                      <span className="text-[14px] font-medium text-slate-600">
                        {item.label}
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        {item.keys.map((key, index) => (
                          <span className="flex items-center gap-1" key={key}>
                            {index > 0 ? (
                              <span className="text-[11px] font-semibold text-slate-400">
                                then
                              </span>
                            ) : null}
                            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 shadow-sm">
                              {key}
                            </kbd>
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
