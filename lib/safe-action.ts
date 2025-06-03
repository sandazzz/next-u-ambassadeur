import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  handleServerError: (error: Error) => {
    return error.message;
  },
});
