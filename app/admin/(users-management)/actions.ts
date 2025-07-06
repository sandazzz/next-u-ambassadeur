"use server";
import { action } from "@/lib/safe-action";

import {
  createUserService,
  updateUserService,
  deleteUserService,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  deleteInvitedUserSchema,
  deleteInvitedUserService,
} from "./services";

export const createUser = action
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => await createUserService(parsedInput));

export const updateUser = action
  .schema(updateUserSchema)
  .action(async ({ parsedInput }) => await updateUserService(parsedInput));

export const deleteUser = action
  .schema(deleteUserSchema)
  .action(async ({ parsedInput }) => await deleteUserService(parsedInput));

export const deleteInvitedUser = action
  .schema(deleteInvitedUserSchema)
  .action(async ({ parsedInput }) => {
    await deleteInvitedUserService(parsedInput);
  });
