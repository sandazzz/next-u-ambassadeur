"use server";

import { action } from "@/lib/safe-action";
import {
  createUserImpl,
  updateUserImpl,
  deleteUserImpl,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "./users-management.logic";

export const createUser = action
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => await createUserImpl(parsedInput));

export const updateUser = action
  .schema(updateUserSchema)
  .action(async ({ parsedInput }) => await updateUserImpl(parsedInput));

export const deleteUser = action
  .schema(deleteUserSchema)
  .action(async ({ parsedInput }) => await deleteUserImpl(parsedInput));
