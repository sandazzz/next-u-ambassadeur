"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updateUserSlotStatus(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    return;
  }

  try {
    const userId = formData.get("userId") as string;
    const slotId = formData.get("slotId") as string;
    const status = formData.get("status") as
      | "confirmed"
      | "rejected"
      | "waiting_list";

    if (!userId || !slotId || !status) {
      return;
    }

    await prisma.userSlot.update({
      where: {
        userId_slotId: {
          userId,
          slotId,
        },
      },
      data: { status },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
  }
}
