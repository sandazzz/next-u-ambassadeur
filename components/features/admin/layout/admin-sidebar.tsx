"use client";

import { useRouter } from "next/navigation";
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
    path: "/admin/",
  },
  {
    title: "Gestion des événements",
    icon: Calendar,
    key: "events",
    path: "/admin/events-management",
  },
  {
    title: "Gestion des crédits",
    icon: Coins,
    key: "credits",
    path: "/admin/credits-management",
  },
];

export function AdminSidebar() {
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">Next-U Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton onClick={() => router.push(item.path)}>
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
