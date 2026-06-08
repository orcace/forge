import type { JSX } from "react";
import { MonitorCog } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { Badge } from "@/shared/ui/badge";

export function SettingsPage(): JSX.Element {
  return (
    <MainLayout
      eyebrow="Workspace"
      subtitle="Settings are intentionally minimal in this milestone. Theme persistence and user preferences will be implemented after the shell stabilizes."
      title="Settings"
    >
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-600">
            <MonitorCog aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-slate-950">
                Preferences foundation
              </h2>
              <Badge>Planned</Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              The white-first visual system is active. Dark mode, workspace persistence,
              custom shortcuts, and import/export settings will be added in later
              milestones.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
