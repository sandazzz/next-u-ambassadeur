"use server";

import { action } from "@/lib/safe-action";
import {
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
  updateEventStatusSchema,
  createEventService,
  updateEventService,
  deleteEventService,
  updateEventStatusService,
} from "./services";

export const createEvent = action
  .schema(createEventSchema)
  .action(async ({ parsedInput }) => {
    return await createEventService(parsedInput);
  });

export const updateEvent = action
  .schema(updateEventSchema)
  .action(async ({ parsedInput }) => {
    return await updateEventService(parsedInput);
  });

export const deleteEvent = action
  .schema(deleteEventSchema)
  .action(async ({ parsedInput }) => {
    return await deleteEventService(parsedInput);
  });

export const updateEventStatus = action
  .schema(updateEventStatusSchema)
  .action(async ({ parsedInput }) => {
    return await updateEventStatusService(parsedInput);
  });
