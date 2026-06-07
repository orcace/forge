import type { JSX } from "react";

export function App(): JSX.Element {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Developer workstation
          </p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">Forge</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            A fast, privacy-first developer toolbox built with React, TypeScript, and a
            registry-driven tool architecture.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <h2 className="text-base font-semibold">Registry first</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tools register once and power navigation, search, routing, and workspace
              behavior.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <h2 className="text-base font-semibold">Local by default</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Core tools run in the browser without sending developer data to a backend.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <h2 className="text-base font-semibold">Contributor friendly</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Strict conventions keep new tools predictable and maintainable.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
