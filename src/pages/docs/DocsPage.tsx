import type { JSX } from "react";
import { BookOpen, FileCode2, GitPullRequest, Map } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";

const docs = [
  {
    href: "/docs/architecture.md",
    icon: BookOpen,
    title: "Architecture",
    text: "Layering, dependency rules, registry ownership, and product boundaries.",
  },
  {
    href: "/docs/adding-a-new-tool.md",
    icon: FileCode2,
    title: "Adding a new tool",
    text: "Feature folder shape, registry metadata, persistence rules, and tests.",
  },
  {
    href: "/docs/contributing.md",
    icon: GitPullRequest,
    title: "Contributing",
    text: "Local setup, commits, pull request expectations, and review standards.",
  },
  {
    href: "/docs/roadmap.md",
    icon: Map,
    title: "Roadmap",
    text: "Milestones for shell, editors, data tools, utilities, and stable release.",
  },
];

export function DocsPage(): JSX.Element {
  return (
    <MainLayout
      eyebrow="Project docs"
      subtitle="Core documentation is kept small and operational so contributors can understand where changes belong."
      title="Documentation"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((doc) => {
          const Icon = doc.icon;

          return (
            <a
              className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:border-sky-200 hover:shadow-sm"
              href={doc.href}
              key={doc.href}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-600">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-950">{doc.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{doc.text}</p>
            </a>
          );
        })}
      </div>
    </MainLayout>
  );
}
