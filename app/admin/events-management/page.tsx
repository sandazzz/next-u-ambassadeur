import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { EventStats } from "@/components/features/admin/events-management/event-stats";
import { EventsTable } from "@/components/features/admin/events-management/events-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function EventsManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const events = await prisma.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des événements
          </h1>
          <p className="text-muted-foreground">
            Créez et gérez les événements de la plateforme
          </p>
        </div>
        <CreateEventModal />
      </div>
      <EventStats events={events} />
      <EventsTable events={events} />
    </div>
  );
}

const CreateEventModal = () => {
  return (
    <Link href="/admin/events-management/create">
      <Button className="cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Créer un événement
      </Button>
    </Link>
  );
};
