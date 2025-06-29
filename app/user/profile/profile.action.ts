"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  school: z.string().min(1, "L'école est requise"),
  promoYear: z.string().min(1, "L'année de promotion est requise"),
  instagram: z.string().optional(),
  phone: z.string().optional(),
  favoriteMoment: z.string().optional(),
});

export const updateProfile = action
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();

    if (!session || session.user.role !== "ambassador") {
      return { serverError: "Non autorisé" };
    }

    try {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: parsedInput.name,
          description: parsedInput.description,
          school: parsedInput.school,
          promoYear: parseInt(parsedInput.promoYear),
          instagram: parsedInput.instagram,
          phone: parsedInput.phone,
          favoriteMoment: parsedInput.favoriteMoment,
        },
      });

      await revalidatePath("/user/profile");
      return { data: { success: true } };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return { serverError: "Erreur lors de la mise à jour du profil" };
    }
  });
