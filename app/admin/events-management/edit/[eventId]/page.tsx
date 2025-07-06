import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/auth";
import { notFound } from "next/navigation";
import { EditEventForm } from "@/components/features/admin/events-management/edit-event-form";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  // Vérifier les permissions admin
  await checkAdminAccess();

  // Récupérer l'événement avec ses plages horaires
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      slots: {
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  // Si l'événement n'existe pas, afficher la page 404
  if (!event) {
    notFound();
  }

  return <EditEventForm event={event} />;
}
