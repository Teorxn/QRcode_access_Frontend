"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#f4f7fe]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#4318ff] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#8f9bba] font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-grow bg-[#f4f7fe] p-8 overflow-y-auto flex flex-col gap-6">
        {children}
      </main>
    </div>
  );
}
