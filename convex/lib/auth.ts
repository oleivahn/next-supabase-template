import { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Checks if the user is authenticated and returns their identity.
 * Throws an error if the user is not signed in.
 *
 * Usage:
 * const identity = await requireAuth(ctx);
 */
export const requireAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("You must be signed in to perform this action.");
  }
  return identity;
};

/**
 * Checks if the user is authenticated without throwing an error.
 * Returns the identity if authenticated, null otherwise.
 *
 * Usage:
 * const identity = await getAuthOrNull(ctx);
 * if (identity) { ... }
 */
export const getAuthOrNull = async (ctx: QueryCtx | MutationCtx) => {
  return await ctx.auth.getUserIdentity();
};
