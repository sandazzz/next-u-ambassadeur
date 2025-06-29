"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const updateUserSlotStatusSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  slotId: z.string().min(1, "L'identifiant de la plage horaire est requis"),
  status: z.enum(["confirmed", "rejected", "waiting_list"], {
    required_error: "Le statut est requis",
  }),
});

async function checkAdminAccess() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Non autorisé");
  }

  if (session.user.role !== "admin") {
    throw new Error("Accès non autorisé");
  }
}

export const updateUserSlotStatus = action
  .schema(updateUserSlotStatusSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      const userSlot = await prisma.userSlot.update({
        where: {
          userId_slotId: {
            userId: parsedInput.userId,
            slotId: parsedInput.slotId,
          },
        },
        data: { status: parsedInput.status },
      });

      await revalidatePath(`/admin/events-management/${userSlot.slotId}`);
      return { data: userSlot };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      return { serverError: "Erreur lors de la mise à jour du statut" };
    }
  });
