"use server";
import { action } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { checkAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const createUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .email("Email invalide")
    .refine(
      (email) => email.endsWith("@next-u.fr"),
      "L'email doit être un email Next-u"
    ),
  role: z.enum(["admin", "ambassador"]),
});

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .email("Email invalide")
    .refine(
      (email) => email.endsWith("@next-u.fr"),
      "L'email doit être un email Next-u"
    ),
  role: z.enum(["admin", "ambassador"]),
});

const deleteUserSchema = z.object({
  id: z.string(),
});

export const createUser = action
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      // Vérifier si l'email existe déjà dans la white list
      const existingUser = await prisma.whitelistEmail.findUnique({
        where: { email: parsedInput.email },
      });

      if (existingUser) {
        return { error: "Cet email est déjà utilisé" };
      }

      // Ajouter l'email à la whitelist
      const user = await prisma.whitelistEmail.create({
        data: {
          email: parsedInput.email,
        },
      });

      // Revalider tous les chemins qui pourraient afficher les utilisateurs
      await revalidatePath("/admin");
      return { data: user };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      return {
        error: "Une erreur est survenue lors de la création de l'utilisateur",
      };
    }
  });

export const updateUser = action
  .schema(updateUserSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: parsedInput.id },
      });

      if (!existingUser) {
        return { error: "Utilisateur non trouvé" };
      }

      // Vérifier si le nouvel email est déjà utilisé par un autre utilisateur
      if (existingUser.email !== parsedInput.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: parsedInput.email },
        });

        if (emailExists) {
          return { error: "Cet email est déjà utilisé" };
        }
      }

      // Mettre à jour l'utilisateur
      const user = await prisma.user.update({
        where: { id: parsedInput.id },
        data: {
          name: parsedInput.name,
          email: parsedInput.email,
          role: parsedInput.role,
        },
      });

      await revalidatePath("/admin");
      return { data: user };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return {
        error:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      };
    }
  });

export const deleteUser = action
  .schema(deleteUserSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();

    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: parsedInput.id },
      });

      if (!existingUser) {
        return { error: "Utilisateur non trouvé" };
      }

      // Supprimer l'utilisateur
      await prisma.user.delete({
        where: { id: parsedInput.id },
      });

      await revalidatePath("/admin");
      return { data: { success: true } };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      return {
        error:
          "Une erreur est survenue lors de la suppression de l'utilisateur",
      };
    }
  });
