import type { JSX } from "react";
import {
  ArrowDown,
  Check,
  Fingerprint,
  KeyRound,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";

const firstViewportSignals = [
  {
    label: "Private by posture",
    value: "Local-first",
  },
  {
    label: "Surface language",
    value: "One Forge rhythm",
  },
  {
    label: "Daily intent",
    value: "Inspect, shape, copy",
  },
];

const workbenchSignals = [
  {
    icon: ShieldCheck,
    label: "Tokens",
    text: "Decode claims, check signatures, and keep secrets out of random tabs.",
  },
  {
    icon: Fingerprint,
    label: "Payloads",
    text: "Format, compare, encode, convert, and make rough text readable again.",
  },
  {
    icon: KeyRound,
    label: "Secrets",
    text: "Generate strong values with clear controls and copy actions close at hand.",
  },
];

const before = [
  "One page for JSON, another for JWTs, another for diffing, another for encoding.",
  "Every tool has a different copy button, contrast level, shortcut habit, and trust model.",
  "The work feels small, but the context switching keeps stealing attention.",
];

const after = [
  "One workspace keeps the messy middle close to the code you are already writing.",
  "Every tool shares the same pane language, result rhythm, validation tone, and copy flow.",
  "The sensitive snippet stays temporary, readable, and under your control.",
];

const storySteps = [
  {
    eyebrow: "01 / Capture",
    text: "A token from logs, a payload from an API, a config block from review. Forge treats the input as a working note, not a permanent artifact.",
    title: "The fragment lands.",
  },
  {
    eyebrow: "02 / Shape",
    text: "The interface stays dense and calm while the tool does the mechanical work: format, decode, compare, generate, normalize.",
    title: "The noise becomes legible.",
  },
  {
    eyebrow: "03 / Return",
    text: "The result is ready to copy, export, or inspect. The point is not to keep you inside Forge; it is to get you back to the real task faster.",
    title: "The thread continues.",
  },
];

export function HomePage(): JSX.Element {
  return (
    <main className="scrollbar-forge min-h-0 flex-1 overflow-auto bg-[#fbfaf8] px-4 pb-10 text-slate-950 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden">
        <section className="flex min-h-[calc(100vh-3.5rem)] min-w-0 max-w-full flex-col py-5 md:py-7">
          <div className="grid gap-2 border-b border-slate-200 pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400 sm:flex sm:items-center sm:justify-between sm:text-[11px]">
            <span>Forge / Developer Workstation</span>
            <span className="hidden sm:inline">Built for the in-between work</span>
          </div>

          <div className="grid min-w-0 flex-1 content-center gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end lg:py-10">
            <div className="home-hero-copy min-w-0">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                A quieter bench for developer fragments
              </p>
              <h1 className="mt-4 max-w-full text-[clamp(2.1rem,7vw,6.9rem)] font-black leading-[0.92] tracking-normal text-slate-950 sm:leading-[0.9]">
                <span className="block">Where rough</span>
                <span className="block bg-brand-gradient bg-clip-text text-transparent">
                  input becomes
                </span>
                <span className="block bg-brand-gradient bg-clip-text text-transparent">
                  usable work.
                </span>
              </h1>
              <p className="home-hero-copy mt-5 text-[15px] leading-7 text-slate-600 md:text-base md:leading-8 lg:max-w-3xl">
                Forge is the small room between coding and shipping: the place for JSON
                that needs structure, tokens that need inspection, diffs that need calm,
                and values that should stay close to your machine.
              </p>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm shadow-slate-950/[0.03]">
              <div className="grid gap-px overflow-hidden rounded-md border border-slate-200 bg-slate-200">
                {firstViewportSignals.map((signal) => (
                  <div className="bg-white px-4 py-3" key={signal.label}>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-slate-950">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-3">
            {workbenchSignals.map((item) => {
              const Icon = item.icon;

              return (
                <article className="bg-white/80 p-4" key={item.label}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold tracking-normal text-slate-950">
                    {item.label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
            More below the fold
          </div>
        </section>

        <section className="grid gap-4 py-10 lg:grid-cols-2">
          <ComparisonCard
            items={before}
            marker="minus"
            subtitle="A chain of borrowed utilities"
            title="Before"
          />
          <ComparisonCard
            items={after}
            marker="check"
            subtitle="A product language of its own"
            title="With Forge"
          />
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {storySteps.map((step) => (
              <article key={step.title}>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {step.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-10">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Forge character
            </p>
            <div>
              <h2 className="text-3xl font-semibold tracking-normal text-slate-950">
                A workstation should feel steady enough for secrets and light enough for
                tiny tasks.
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
                Forge keeps the interface close to the material: editors, panes, toggles,
                copy buttons, validation states, and exports stay where a developer
                expects them. The personality comes from restraint, rhythm, and the
                feeling that every small tool belongs to the same bench.
              </p>
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-[12px] font-semibold text-slate-500">
          <span>Forge is local-first by design.</span>
          <div className="flex items-center gap-3">
            <Link className="transition hover:text-slate-950" to="/privacy">
              Privacy
            </Link>
            <Link className="transition hover:text-slate-950" to="/terms">
              Terms
            </Link>
            <a
              className="transition hover:text-slate-950"
              href="https://github.com/orcace/forge/issues"
              rel="noreferrer"
              target="_blank"
            >
              Issues
            </a>
          </div>
        </footer>
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
          <div
            className="flex gap-3 text-[14px] font-medium leading-6 text-slate-700"
            key={item}
          >
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
