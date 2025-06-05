"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  eventId: z.string(),
  slotId: z.string().min(1, "Veuillez sélectionner une plage horaire"),
});

export const registerToEvent = action
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: { serverError: "Non autorisé" } };
    }

    try {
      const event = await prisma.event.findUnique({
        where: { id: parsedInput.eventId },
        include: {
          slots: {
            where: { id: parsedInput.slotId },
          },
        },
      });

      if (!event) {
        return { error: { serverError: "Événement non trouvé" } };
      }

      if (event.status !== "open") {
        return {
          error: {
            serverError: "Les inscriptions sont fermées pour cet événement",
          },
        };
      }

      if (event.slots.length === 0) {
        return {
          error: {
            serverError: "La plage horaire sélectionnée n'est pas disponible",
          },
        };
      }

      // Vérifier si l'utilisateur est déjà inscrit à une plage horaire de cet événement
      const existingRegistration = await prisma.userSlot.findFirst({
        where: {
          userId: session.user.id,
          slot: {
            eventId: parsedInput.eventId,
          },
        },
      });

      if (existingRegistration) {
        return {
          error: {
            serverError:
              "Vous êtes déjà inscrit à une plage horaire de cet événement",
          },
        };
      }

      // Créer l'inscription à la plage horaire
      const userSlot = await prisma.userSlot.create({
        data: {
          userId: session.user.id,
          slotId: parsedInput.slotId,
          status: "waiting_list",
        },
      });
      redirect("/user/forms");
      return { data: userSlot };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return {
        error: { serverError: "Une erreur est survenue lors de l'inscription" },
      };
    }
  });
