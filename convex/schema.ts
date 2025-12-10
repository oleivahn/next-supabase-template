import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  testTaskTable: defineTable({
    taskTest: v.string(),
  }),
});
