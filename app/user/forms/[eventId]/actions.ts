"use server";

import { action } from "@/lib/safe-action";
import { registerToEventService, registerSchema } from "./services";

export const registerToEvent = action
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    return await registerToEventService(parsedInput);
  });
