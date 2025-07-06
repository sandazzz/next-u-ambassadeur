import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/features/admin/layout/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/features/admin/layout/admin-sidebar";

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-6">
          {children}
          {modal}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
