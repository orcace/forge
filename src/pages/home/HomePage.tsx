import type { JSX } from "react";
import { ArrowDown, Check, Minus } from "lucide-react";

const notes = [
  {
    eyebrow: "Context",
    text: "Small developer tasks rarely deserve a full context switch, but they happen all day.",
    title: "A payload arrives messy.",
  },
  {
    eyebrow: "Workspace",
    text: "Forge keeps previews, formatters, encoders, decoders, and generators in one calm surface.",
    title: "The tool stays close.",
  },
  {
    eyebrow: "Output",
    text: "The final value is easy to inspect, copy, export, and bring back to the work that mattered.",
    title: "You leave with the result.",
  },
];

const before = [
  "One tab for formatting.",
  "Another for decoding.",
  "A third for comparing text.",
  "Different buttons, colors, shortcuts, and trust models.",
];

const after = [
  "One navigation model.",
  "One toolbar language.",
  "One copy/export pattern.",
  "Local-first workflows for sensitive text.",
];

export function HomePage(): JSX.Element {
  return (
    <main className="scrollbar-forge min-h-0 flex-1 overflow-auto bg-[#fbfaf8] px-4 pb-10 text-slate-950 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="min-h-[calc(100vh-4.5rem)] py-10">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
            <span>Forge / Developer Workstation</span>
            <span>Local-first tools</span>
          </div>

          <div className="grid gap-10 py-14 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
            <div>
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                For the in-between work
              </p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.75rem,9vw,8.8rem)] font-black leading-[0.88] tracking-normal text-slate-950">
                Developer tools
                <span className="block bg-brand-gradient bg-clip-text text-transparent">
                  without the tab drift.
                </span>
              </h1>
            </div>

            <div className="border-l border-slate-200 pl-5">
              <p className="text-[15px] leading-7 text-slate-600">
                Forge is the quiet place between writing code and shipping it: the moment
                you need to inspect a token, shape JSON, compare text, generate a secret,
                test a regex, or turn rough input into something usable.
              </p>
              <div className="mt-6 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
                Scroll the story
              </div>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-3">
            {notes.map((note) => (
              <article className="bg-white/80 p-5" key={note.title}>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {note.eyebrow}
                </p>
                <h2 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
                  {note.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{note.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 pb-10 lg:grid-cols-2">
          <ComparisonCard
            items={before}
            marker="minus"
            title="Before"
            subtitle="A chain of unrelated pages"
          />
          <ComparisonCard
            items={after}
            marker="check"
            title="With Forge"
            subtitle="One product language"
          />
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Design language
            </p>
            <div>
              <h2 className="text-3xl font-semibold tracking-normal text-slate-950">
                The interface is intentionally quiet because the input is usually noisy.
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
                Tool screens use dense panes, restrained borders, clear copy actions, and
                predictable controls. The home page is the front door; the tools are the
                workshop. Both should feel like they belong to the same place.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ComparisonCard({
  items,
  marker,
  subtitle,
  title,
}: {
  items: string[];
  marker: "check" | "minus";
  subtitle: string;
  title: string;
}): JSX.Element {
  const Icon = marker === "check" ? Check : Minus;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.03]">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {subtitle}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
        {title}
      </h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div className="flex gap-3 text-[14px] font-medium text-slate-700" key={item}>
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
