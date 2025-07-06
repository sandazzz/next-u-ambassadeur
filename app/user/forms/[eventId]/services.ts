import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const registerSchema = z.object({
  eventId: z.string().nonempty("L'identifiant de l'événement est requis"),
  slotIds: z
    .array(z.string())
    .min(1, "Au moins une plage horaire doit être sélectionnée"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export async function registerToEventService(input: RegisterInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: { serverError: "Non autorisé" } };
    }

    const userId = session.user.id;
    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
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
        userId: userId,
        slot: {
          eventId: input.eventId,
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
    const invalidSlot = input.slotIds.find((id) => !validSlotIds.includes(id));

    if (invalidSlot) {
      return {
        error: {
          serverError:
            "Une des plages sélectionnées n'appartient pas à l'événement",
        },
      };
    }

    const createdSlots = await Promise.all(
      input.slotIds.map((slotId) =>
        prisma.userSlot.create({
          data: {
            userId: userId,
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
}
