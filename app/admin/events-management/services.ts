import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "@/lib/auth";

export const timeSlotSchema = z.object({
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
});

export const createEventSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "Au moins une plage horaire est requise"),
});

export const updateEventSchema = createEventSchema.extend({
  id: z.string(),
});

export const deleteEventSchema = z.object({
  id: z.string(),
});

export const updateEventStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "closed", "completed"]),
});

type CreateEventInput = z.infer<typeof createEventSchema>;

type UpdateEventInput = z.infer<typeof updateEventSchema>;

type DeleteEventInput = z.infer<typeof deleteEventSchema>;

type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>;

export const createEventService = async (input: CreateEventInput) => {
  await checkAdminAccess();

  try {
    await prisma.event.create({
      data: {
        title: input.title,
        description: input.description,
        date: new Date(input.date),
        location: input.location,
        status: "closed",
        slots: {
          create: input.timeSlots.map((slot) => ({
            startTime: new Date(`${input.date}T${slot.startTime}`),
            endTime: new Date(`${input.date}T${slot.endTime}`),
          })),
        },
      },
    });

    return await revalidatePath("/admin/events-management");
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    return { serverError: "Erreur lors de la création de l'événement" };
  }
};

export const updateEventService = async (input: UpdateEventInput) => {
  await checkAdminAccess();

  try {
    // Supprimer toutes les plages horaires existantes
    await prisma.eventSlot.deleteMany({
      where: { eventId: input.id },
    });

    // Mettre à jour l'événement et créer les nouvelles plages horaires
    const event = await prisma.event.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description,
        date: new Date(input.date),
        location: input.location,
        slots: {
          create: input.timeSlots.map((slot) => ({
            startTime: new Date(`${input.date}T${slot.startTime}`),
            endTime: new Date(`${input.date}T${slot.endTime}`),
          })),
        },
      },
      include: {
        slots: true,
      },
    });

    await revalidatePath("/admin/events-management");
    return { data: event };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    return { serverError: "Erreur lors de la mise à jour de l'événement" };
  }
};

export const deleteEventService = async (input: DeleteEventInput) => {
  await checkAdminAccess();

  try {
    await prisma.event.delete({
      where: { id: input.id },
    });

    await revalidatePath("/admin/events-management");
    return { data: { success: true } };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    return { serverError: "Erreur lors de la suppression de l'événement" };
  }
};

export const updateEventStatusService = async (
  input: UpdateEventStatusInput
) => {
  await checkAdminAccess();

  try {
    const event = await prisma.event.update({
      where: { id: input.id },
      data: { status: input.status },
    });

    await revalidatePath("/admin/events-management");
    return { data: event };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return { serverError: "Erreur lors de la mise à jour du statut" };
  }
};
