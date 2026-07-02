import type { JSX } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { getToolById } from "@/core/registry/tool.registry";
import { Base64Page } from "@/features/base64";
import { CaseConverterPage } from "@/features/case-converter";
import { DiffCheckerPage } from "@/features/diff-checker";
import { HashGeneratorPage } from "@/features/hash";
import { useWorkspaceStore } from "@/core/workspace/workspace.store";
import { HtmlPreviewPage } from "@/features/html-preview";
import { JsonToolsPage } from "@/features/json";
import { JsonYamlPage } from "@/features/json-yaml";
import { JwtDecoderPage } from "@/features/jwt-decoder";
import { MarkdownPreviewPage } from "@/features/markdown-preview";
import { PasswordGeneratorPage } from "@/features/password-generator";
import { RegexTesterPage } from "@/features/regex-tester";
import { SlugifyPage } from "@/features/slugify";
import { TimestampPage } from "@/features/timestamp";
import { UrlEncoderPage } from "@/features/url-encoder";
import { UuidPage } from "@/features/uuid";
import { ToolLayout } from "@/layouts/ToolLayout";
import { EmptyState } from "@/shared/components/EmptyState";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";

export function ToolPlaceholderPage(): JSX.Element {
  const { toolId } = useParams();
  const setActiveTool = useWorkspaceStore((state) => state.setActiveTool);
  const trackRecentTool = useWorkspaceStore((state) => state.trackRecentTool);
  const tool = toolId ? getToolById(toolId) : undefined;

  useEffect(() => {
    if (!tool) {
      setActiveTool(null);
      return;
    }

    setActiveTool(tool.id);
    trackRecentTool(tool.id);

    return () => setActiveTool(null);
  }, [setActiveTool, tool, trackRecentTool]);

  if (!tool) {
    return <NotFoundPage />;
  }

  if (tool.id === "markdown-preview") {
    return (
      <ToolLayout showHeader={false} tool={tool}>
        <MarkdownPreviewPage />
      </ToolLayout>
    );
  }

  if (tool.id === "html-preview") {
    return (
      <ToolLayout showHeader={false} tool={tool}>
        <HtmlPreviewPage />
      </ToolLayout>
    );
  }

  const toolPages: Record<string, JSX.Element> = {
    base64: <Base64Page />,
    "case-converter": <CaseConverterPage />,
    "diff-checker": <DiffCheckerPage />,
    "hash-generator": <HashGeneratorPage />,
    "json-formatter": <JsonToolsPage />,
    "json-yaml": <JsonYamlPage />,
    "jwt-decoder": <JwtDecoderPage />,
    "password-generator": <PasswordGeneratorPage />,
    "regex-tester": <RegexTesterPage />,
    slugify: <SlugifyPage />,
    timestamp: <TimestampPage />,
    "url-encoder": <UrlEncoderPage />,
    uuid: <UuidPage />,
  };

  if (toolPages[tool.id]) {
    return (
      <ToolLayout showHeader={false} tool={tool}>
        {toolPages[tool.id]}
      </ToolLayout>
    );
  }

  return (
    <ToolLayout tool={tool}>
      <EmptyState
        action={
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-brand px-4 text-sm font-medium text-white shadow-sm shadow-sky-500/20 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            to="/docs"
          >
            View implementation guide
          </Link>
        }
        description="The registry, navigation, and tool shell are in place. Tool-specific service logic and UI will be implemented in the next milestones."
        title={`${tool.name} is queued for implementation`}
      />
    </ToolLayout>
  );
}
