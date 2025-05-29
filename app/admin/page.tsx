"use client";

import type React from "react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { UsersManagement } from "@/components/admin/users-management";
import { EventsManagement } from "@/components/admin/events-management";
import { EventDetails } from "@/components/admin/event-details";
import { CreditsManagement } from "@/components/admin/credits-management";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("users");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleViewEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveSection("event-details");
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    setActiveSection("events");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UsersManagement />;
      case "events":
        return <EventsManagement onViewEventDetails={handleViewEventDetails} />;
      case "event-details":
        return selectedEventId ? (
          <EventDetails eventId={selectedEventId} onBack={handleBackToEvents} />
        ) : (
          <EventsManagement onViewEventDetails={handleViewEventDetails} />
        );
      case "credits":
        return <CreditsManagement />;
      default:
        return <UsersManagement />;
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <SidebarInset>
        <DashboardHeader onLogout={handleLogout} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
