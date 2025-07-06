import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "@/lib/auth";

export const adjustCreditsSchema = z.object({
  userId: z.string().min(1, "userId ne peut pas être vide"),
  type: z.enum(["add", "remove"]),
});

type AdjustCreditsInput = z.infer<typeof adjustCreditsSchema>;

export async function adjustCreditsService(input: AdjustCreditsInput) {
  await checkAdminAccess();
  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      return { serverError: "Utilisateur non trouvé" };
    }

    const finalAmount = input.type === "add" ? 1 : -1;
    const newCredits = Math.max(0, (user.credit ?? 0) + finalAmount);

    const updatedUser = await prisma.user.update({
      where: { id: input.userId },
      data: { credit: newCredits },
    });

    await revalidatePath("/admin/credits-management");
    return { data: updatedUser };
  } catch (error) {
    console.error("Erreur lors de l'ajustement des crédits:", error);
    return { serverError: "Erreur lors de l'ajustement des crédits" };
  }
}
