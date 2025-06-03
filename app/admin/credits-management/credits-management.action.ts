"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const adjustCreditsSchema = z.object({
  userId: z.string(),
  type: z.enum(["add", "remove"]),
});

async function checkAdminAccess() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "admin") {
    throw new Error("Accès non autorisé");
  }
}

export const adjustCredits = action
  .schema(adjustCreditsSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      const user = await prisma.user.findUnique({
        where: { id: parsedInput.userId },
      });

      if (!user) {
        return { serverError: "Utilisateur non trouvé" };
      }

      const finalAmount = parsedInput.type === "add" ? 1 : -1;
      const newCredits = Math.max(0, (user.credit ?? 0) + finalAmount);

      const updatedUser = await prisma.user.update({
        where: { id: parsedInput.userId },
        data: { credit: newCredits },
      });

      await revalidatePath("/admin/credits-management");
      return { data: updatedUser };
    } catch (error) {
      console.error("Erreur lors de l'ajustement des crédits:", error);
      return { serverError: "Erreur lors de l'ajustement des crédits" };
    }
  });
