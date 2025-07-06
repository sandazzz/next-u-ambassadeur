import { z } from "zod";
import { checkAdminAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateUserSlotStatusSchema = z.object({
  userId: z.string().min(1, "L'identifiant de l'utilisateur est requis"),
  slotId: z.string().min(1, "L'identifiant de la plage horaire est requis"),
  status: z.enum(["confirmed", "rejected", "waiting_list"], {
    required_error: "Le statut est requis",
  }),
});

export const updateUserSlotStatusService = async (
  input: z.infer<typeof updateUserSlotStatusSchema>
) => {
  await checkAdminAccess();
  {
    try {
      const userSlot = await prisma.userSlot.update({
        where: {
          userId_slotId: {
            userId: input.userId,
            slotId: input.slotId,
          },
        },
        data: { status: input.status },
      });

      await revalidatePath(`/admin/events-management/${userSlot.slotId}`);
      return { data: userSlot };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      return { serverError: "Erreur lors de la mise à jour du statut" };
    }
  }
};
