import type { JSX } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { getToolById } from "@/core/registry/tool.registry";
import { useWorkspaceStore } from "@/core/workspace/workspace.store";
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
