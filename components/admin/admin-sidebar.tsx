"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Users, Calendar, Coins, Building2 } from "lucide-react";

const menuItems = [
  {
    title: "Gestion des utilisateurs",
    icon: Users,
    key: "users",
  },
  {
    title: "Gestion des événements",
    icon: Calendar,
    key: "events",
  },
  {
    title: "Gestion des crédits",
    icon: Coins,
    key: "credits",
  },
];

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AdminSidebar({
  activeSection,
  setActiveSection,
}: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">Next-u Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.key)}
                    isActive={activeSection === item.key}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
