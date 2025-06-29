"use server";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const deleteInvitedUserSchema = z.object({
  email: z.string(),
});

export const deleteInvitedUser = action
  .schema(deleteInvitedUserSchema)
  .action(async ({ parsedInput }) => {
    await checkAdminAccess();
    const { email } = parsedInput;

    await prisma.whitelistEmail.delete({
      where: { email },
    });

    revalidatePath("/admin/users-management");
  });
