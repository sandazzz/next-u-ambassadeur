"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">admin@next-u.fr</span>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
