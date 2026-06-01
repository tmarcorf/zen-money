import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authenticated, sessionStatus } = useAuth();

  // Show a loading indicator while the initial session check is in progress.
  // This prevents protected routes from flashing when the backend is offline.
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!authenticated) {
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
