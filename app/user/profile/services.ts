import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  school: z.string().min(1, "L'école est requise"),
  promoYear: z.string().min(1, "L'année de promotion est requise"),
  instagram: z.string().optional(),
  phone: z.string().optional(),
  favoriteMoment: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfileService(input: UpdateProfileInput) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ambassador") {
      return { serverError: "Non autorisé" };
    }

    const userId = session.user.id;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: input.name,
        description: input.description,
        school: input.school,
        promoYear: parseInt(input.promoYear),
        instagram: input.instagram,
        phone: input.phone,
        favoriteMoment: input.favoriteMoment,
      },
    });

    await revalidatePath("/user/profile");
    return { data: updatedUser };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return { serverError: "Erreur lors de la mise à jour du profil" };
  }
}
