import type { JSX } from "react";
import { Route, Routes } from "react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { DocsPage } from "@/pages/docs/DocsPage";
import { HomePage } from "@/pages/home/HomePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { SupportPage } from "@/pages/support/SupportPage";
import { ToolPlaceholderPage } from "@/pages/tools/ToolPlaceholderPage";

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<HomePage />} index />
        <Route element={<DocsPage />} path="docs" />
        <Route element={<DocsPage />} path="docs/:docId" />
        <Route element={<SettingsPage />} path="settings" />
        <Route element={<SupportPage />} path="support" />
        <Route element={<SupportPage />} path="support/:mode" />
        <Route element={<ToolPlaceholderPage />} path="tools/:toolId" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}
