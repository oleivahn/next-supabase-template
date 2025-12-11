import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib/auth";

// - Query to get all test tasks (requires authentication)
export const get = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("testTasks"),
      _creationTime: v.number(),
      taskTest: v.string(),
    })
  ),
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("testTasks").collect();
  },
});

// - Mutation to create a new test task (requires authentication)
export const create = mutation({
  args: {
    taskTest: v.string(),
  },
  returns: v.id("testTasks"),
  handler: async (ctx, args) => {
    // Check if user is authenticated
    await requireAuth(ctx);

    const taskId = await ctx.db.insert("testTasks", {
      taskTest: args.taskTest,
    });
    return taskId;
  },
});

// - Mutation to update an existing test task (requires authentication)
export const update = mutation({
  args: {
    id: v.id("testTasks"),
    taskTest: v.string(),
  },
  returns: v.id("testTasks"),
  handler: async (ctx, args) => {
    // Check if user is authenticated
    await requireAuth(ctx);

    const trimmedTaskTest = args.taskTest.trim();

    // - Validate that taskTest is not empty
    if (trimmedTaskTest.length === 0) {
      throw new Error("Task name cannot be empty.");
    }

    await ctx.db.patch(args.id, {
      taskTest: trimmedTaskTest,
    });

    return args.id;
  },
});

// - Mutation to delete a test task (requires authentication)
export const remove = mutation({
  args: {
    id: v.id("testTasks"),
  },
  returns: v.id("testTasks"),
  handler: async (ctx, args) => {
    // Check if user is authenticated
    await requireAuth(ctx);

    await ctx.db.delete(args.id);
    return args.id;
  },
});
