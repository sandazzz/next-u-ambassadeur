"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "@/lib/auth";

const timeSlotSchema = z.object({
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
});

const createEventSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "Au moins une plage horaire est requise"),
});

type CreateEventInput = z.infer<typeof createEventSchema>;

const updateEventSchema = createEventSchema.extend({
  id: z.string(),
});

const deleteEventSchema = z.object({
  id: z.string(),
});

const updateEventStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "closed", "completed"]),
});

export const createEvent = action
  .schema(createEventSchema)
  .action(async ({ parsedInput }: { parsedInput: CreateEventInput }) => {
    await checkAdminAccess();

    try {
      await prisma.event.create({
        data: {
          title: parsedInput.title,
          description: parsedInput.description,
          date: new Date(parsedInput.date),
          location: parsedInput.location,
          status: "closed",
          slots: {
            create: parsedInput.timeSlots.map((slot) => ({
              startTime: new Date(`${parsedInput.date}T${slot.startTime}`),
              endTime: new Date(`${parsedInput.date}T${slot.endTime}`),
            })),
          },
        },
      });

      return await revalidatePath("/admin/events-management");
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      return { serverError: "Erreur lors de la création de l'événement" };
    }
  });

export const updateEvent = action
  .schema(updateEventSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      // Supprimer toutes les plages horaires existantes
      await prisma.eventSlot.deleteMany({
        where: { eventId: parsedInput.id },
      });

      // Mettre à jour l'événement et créer les nouvelles plages horaires
      const event = await prisma.event.update({
        where: { id: parsedInput.id },
        data: {
          title: parsedInput.title,
          description: parsedInput.description,
          date: new Date(parsedInput.date),
          location: parsedInput.location,
          slots: {
            create: parsedInput.timeSlots.map((slot) => ({
              startTime: new Date(`${parsedInput.date}T${slot.startTime}`),
              endTime: new Date(`${parsedInput.date}T${slot.endTime}`),
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
  });

export const deleteEvent = action
  .schema(deleteEventSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      await prisma.event.delete({
        where: { id: parsedInput.id },
      });

      await revalidatePath("/admin/events-management");
      return { data: { success: true } };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
      return { serverError: "Erreur lors de la suppression de l'événement" };
    }
  });

export const updateEventStatus = action
  .schema(updateEventStatusSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      const event = await prisma.event.update({
        where: { id: parsedInput.id },
        data: { status: parsedInput.status },
      });

      await revalidatePath("/admin/events-management");
      return { data: event };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      return { serverError: "Erreur lors de la mise à jour du statut" };
    }
  });
