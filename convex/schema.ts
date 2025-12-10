import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  testTasks: defineTable({
    taskTest: v.string(),
  }),
  contactUs: defineTable({
    name: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),
});
