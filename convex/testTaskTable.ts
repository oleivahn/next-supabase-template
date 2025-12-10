import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// - Query to get all test tasks
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("testTaskTable").collect();
  },
});

// - Mutation to create a new test task
export const create = mutation({
  args: {
    taskTest: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("testTaskTable", {
      taskTest: args.taskTest,
    });
    return taskId;
  },
});
