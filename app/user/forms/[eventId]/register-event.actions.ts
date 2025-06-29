"use server";

import { action } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  eventId: z.string().nonempty("L'identifiant de l'événement est requis"),
  slotIds: z
    .array(z.string())
    .min(1, "Au moins une plage horaire doit être sélectionnée"),
});

export const registerToEvent = action
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: { serverError: "Non autorisé" } };
    }
    const user = session.user.id;

    try {
      const event = await prisma.event.findUnique({
        where: { id: parsedInput.eventId },
        include: {
          slots: true,
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

      // Vérifie si l'utilisateur est déjà inscrit à l'événement
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
      // Vérifie que les slotIds existent bien dans les slots de l'événement
      const validSlotIds = event.slots.map((slot) => slot.id);
      const invalidSlot = parsedInput.slotIds.find(
        (id) => !validSlotIds.includes(id)
      );

      if (invalidSlot) {
        return {
          error: {
            serverError:
              "Une des plages sélectionnées n'appartient pas à l'événement",
          },
        };
      }

      const createdSlots = await Promise.all(
        parsedInput.slotIds.map((slotId) =>
          prisma.userSlot.create({
            data: {
              userId: user,
              slotId,
              status: "waiting_list",
            },
          })
        )
      );
      return { data: createdSlots };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return {
        error: { serverError: "Une erreur est survenue lors de l'inscription" },
      };
    }
  });
