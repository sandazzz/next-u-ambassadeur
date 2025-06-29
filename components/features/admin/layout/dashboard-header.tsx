"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/features/theme/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
