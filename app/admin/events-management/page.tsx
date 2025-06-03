import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateEventDialog } from "./CreateEventDialog";
import { EventStats } from "./EventStats";
import { EventsTable } from "./EventsTable";

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
        <CreateEventDialog />
      </div>
      <EventStats events={events} />
      <EventsTable events={events} />
    </div>
  );
}
