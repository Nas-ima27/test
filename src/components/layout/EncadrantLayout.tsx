// src/components/layout/EncadrantLayout.tsx
import { Outlet } from "react-router-dom";
import { EncadrantSidebar } from "./EncadrantSidebar";
import { Topbar } from "./Topbar";

export function EncadrantLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <EncadrantSidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}