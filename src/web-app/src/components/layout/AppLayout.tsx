import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";
import { isAuthenticated } from "@/api/client";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} title="" />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
