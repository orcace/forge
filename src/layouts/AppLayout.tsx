import type { JSX } from "react";
import { Outlet } from "react-router";
import { Header } from "@/widgets/header/Header";
import { Sidebar } from "@/widgets/sidebar/Sidebar";

export function AppLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
