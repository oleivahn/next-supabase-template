import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// - Query to get all test tasks
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("testTasks").collect();
  },
});

// - Mutation to create a new test task
export const create = mutation({
  args: {
    taskTest: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("testTasks", {
      taskTest: args.taskTest,
    });
    return taskId;
  },
});

// - Mutation to update an existing test task
export const update = mutation({
  args: {
    id: v.id("testTasks"),
    taskTest: v.string(),
  },
  handler: async (ctx, args) => {
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

// - Mutation to delete a test task
export const remove = mutation({
  args: {
    id: v.id("testTasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});