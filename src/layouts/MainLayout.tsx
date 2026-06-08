import type { JSX, ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
}

export function MainLayout({
  children,
  eyebrow,
  subtitle,
  title,
}: MainLayoutProps): JSX.Element {
  return (
    <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase text-gradient-brand">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}
