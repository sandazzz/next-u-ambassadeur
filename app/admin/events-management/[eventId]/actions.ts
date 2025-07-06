"use server";

import { action } from "@/lib/safe-action";
import {
  updateUserSlotStatusSchema,
  updateUserSlotStatusService,
} from "./services";

export const updateUserSlotStatus = action
  .schema(updateUserSlotStatusSchema)
  .action(async ({ parsedInput }) => {
    return await updateUserSlotStatusService(parsedInput);
  });
