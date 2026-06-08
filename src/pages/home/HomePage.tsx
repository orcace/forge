import type { JSX } from "react";
import { ArrowRight, Boxes, Cpu, Database, Shield } from "lucide-react";
import { Link } from "react-router";
import { toolCategoryDefinitions } from "@/core/registry/tool.categories";
import { toolRegistry } from "@/core/registry/tool.registry";
import { MainLayout } from "@/layouts/MainLayout";
import { Badge } from "@/shared/ui/badge";

const highlights = [
  {
    icon: Boxes,
    label: "Registry-driven",
    value: "Single source of truth for tools",
  },
  {
    icon: Shield,
    label: "Private by default",
    value: "Core workflows run locally",
  },
  {
    icon: Cpu,
    label: "Fast foundation",
    value: "Vite, strict TypeScript, CI",
  },
];

export function HomePage(): JSX.Element {
  return (
    <MainLayout
      eyebrow="Forge foundation"
      subtitle="A focused workstation for everyday developer utilities, designed around a tool registry and local-first workflows."
      title="Developer tools that behave like one product"
    >
      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-gradient-soft px-6 py-8">
            <Badge tone="accent">{toolRegistry.length} planned tools</Badge>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950">
              Build, inspect, convert, and validate without leaving the browser.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              The first milestone establishes navigation, registry metadata, and a
              polished white-first interface before deeper tool logic is added.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gradient-brand px-4 text-sm font-medium text-white shadow-sm shadow-sky-500/20 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                to="/tools/json-formatter"
              >
                Open JSON Formatter
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground shadow-sm transition hover:border-sky-200 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                to="/docs"
              >
                Read project docs
              </Link>
            </div>
          </div>

          <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div className="bg-white p-5" key={item.label}>
                  <Icon aria-hidden="true" className="h-5 w-5 text-sky-500" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-950">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Database aria-hidden="true" className="h-5 w-5 text-purple-500" />
            <h2 className="text-base font-semibold text-slate-950">Categories</h2>
          </div>
          <div className="mt-5 space-y-4">
            {toolCategoryDefinitions.map((category) => {
              const Icon = category.icon;
              const count = toolRegistry.filter(
                (tool) => tool.category === category.id,
              ).length;

              return (
                <div className="flex gap-3" key={category.id}>
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-950">{category.id}</p>
                      <span className="text-xs text-slate-400">{count}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {category.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
