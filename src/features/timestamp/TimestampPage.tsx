import type { JSX } from "react";

export function TimestampPage(): JSX.Element {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase text-sky-600">Tool module</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-950">Timestamp Converter</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Convert between timestamps and readable dates.
      </p>
    </section>
  );
}
