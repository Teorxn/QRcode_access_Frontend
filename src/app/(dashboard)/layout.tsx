"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#f4f7fe]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#4318ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#8f9bba] font-medium">
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#f4f7fe]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-[#f4f7fe] border-b border-[#e2e8f0] px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#1b254b] p-2 rounded-lg border border-[#e2e8f0] bg-white shadow-sm"
            aria-label="Open menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#1b254b]">
            Control Acceso
          </span>
          <div className="w-9" />
        </header>
        <main className="flex-1 bg-[#f4f7fe] p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
}
