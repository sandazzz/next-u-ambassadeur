"use server";

import { action } from "@/lib/safe-action";
import { adjustCreditsSchema, adjustCreditsService } from "./services";

export const adjustCredits = action
  .schema(adjustCreditsSchema)
  .action(async ({ parsedInput }) => {
    return await adjustCreditsService(parsedInput);
  });
