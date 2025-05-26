"use client";

import type React from "react";

import { useState } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulating logged in state

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleViewEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveSection("event-details");
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    setActiveSection("events");
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
        <DashboardHeader onLogout={() => setIsLoggedIn(false)} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.endsWith("@next-u.fr")) {
      onLogin();
    } else {
      alert("Veuillez utiliser votre email Next-u");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Utilisez votre email Next-u pour vous connecter
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email Next-u"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
