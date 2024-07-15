import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { getAuthSession } from "./auth";

export const action = createSafeActionClient();

export class ActionError extends Error {}

export const authenticatedAction = createSafeActionClient({
  handleReturnedServerError(error) {
    if (error instanceof ActionError) {
      return error.message;
    }

    return "An unexpected error occurred";
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  // Here we await the action execution.
  const result = await next({ ctx: null });

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);

  // And then return the result of the awaited action.
  return result;
});

export const authActionClient = authenticatedAction.use(async ({ next }) => {
  const session = await getAuthSession();

  const user = session?.user;
  const userId = user?.id;

  if (!userId) {
    throw new ActionError("You must be logged in to perform this action");
  }

  return next({
    ctx: {
      userId,
    },
  });
});
