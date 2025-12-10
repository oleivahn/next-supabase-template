import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// - Query to get all contact submissions
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactUs").order("desc").collect();
  },
});

// - Mutation to create a new contact submission with backend validation
export const create = mutation({
  args: {
    name: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // - Backend validation
    const trimmedName = args.name.trim();
    const trimmedMessage = args.message.trim();

    // - Validate name (minimum 2 characters)
    if (trimmedName.length < 2) {
      throw new Error("Name must be at least 2 characters.");
    }

    // - Validate message (cannot be empty)
    if (trimmedMessage.length === 0) {
      throw new Error("The message area cannot be empty, please add a message.");
    }

    // - Optional: Maximum length validation to prevent abuse
    if (trimmedName.length > 100) {
      throw new Error("Name cannot exceed 100 characters.");
    }

    if (trimmedMessage.length > 5000) {
      throw new Error("Message cannot exceed 5000 characters.");
    }

    // - Insert the contact submission
    const contactId = await ctx.db.insert("contactUs", {
      name: trimmedName,
      message: trimmedMessage,
      createdAt: Date.now(),
    });

    return contactId;
  },
});

