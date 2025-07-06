"use server";

import { action } from "@/lib/safe-action";
import { updateProfileService, updateProfileSchema } from "./services";

export const updateProfile = action
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    return await updateProfileService(parsedInput);
  });
