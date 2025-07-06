"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "@/lib/auth";

const createUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  role: z.enum(["admin", "ambassador"]),
});

export const createUser = action
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      const user = await prisma.user.create({
        data: {
          name: parsedInput.name,
          email: parsedInput.email,
          role: parsedInput.role,
          credit: 0, // Crédits initiaux
        },
      });

      await revalidatePath("/admin/");
      return { data: user };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      return { serverError: "Erreur lors de la création de l'utilisateur" };
    }
  });
