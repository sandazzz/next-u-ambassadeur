import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const createUserSchema = z.object({
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

export const updateUserSchema = z.object({
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

export const deleteUserSchema = z.object({
  id: z.string(),
});

export const deleteInvitedUserSchema = z.object({
  email: z.string(),
});

export async function createUserService(
  input: z.infer<typeof createUserSchema>
) {
  await checkAdminAccess();

  const existingUser = await prisma.whitelistEmail.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    return { error: "Cet email est déjà utilisé" };
  }

  const user = await prisma.whitelistEmail.create({
    data: { email: input.email },
  });

  await revalidatePath("/admin");
  return { data: user };
}

export async function updateUserService(
  input: z.infer<typeof updateUserSchema>
) {
  await checkAdminAccess();

  const existingUser = await prisma.user.findUnique({
    where: { id: input.id },
  });

  if (!existingUser) {
    return { error: "Utilisateur non trouvé" };
  }

  if (existingUser.email !== input.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (emailExists) {
      return { error: "Cet email est déjà utilisé" };
    }
  }

  const user = await prisma.user.update({
    where: { id: input.id },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
    },
  });

  await revalidatePath("/admin");
  return { data: user };
}

export async function deleteUserService(
  input: z.infer<typeof deleteUserSchema>
) {
  await checkAdminAccess();

  const existingUser = await prisma.user.findUnique({
    where: { id: input.id },
  });

  if (!existingUser) {
    return { error: "Utilisateur non trouvé" };
  }

  await prisma.user.delete({
    where: { id: input.id },
  });

  if (existingUser.email) {
    await prisma.whitelistEmail.deleteMany({
      where: { email: existingUser.email },
    });
  }

  await revalidatePath("/admin");
  return { data: { success: true } };
}

export async function deleteInvitedUserService(
  input: z.infer<typeof deleteInvitedUserSchema>
) {
  await checkAdminAccess();

  await prisma.whitelistEmail.delete({
    where: { email: input.email },
  });
  revalidatePath("/admin");
}
