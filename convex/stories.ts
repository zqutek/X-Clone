import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

const STORY_DURATION = 24 * 60 * 60 * 1000;

export const createStory = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Story image not found");

    return await ctx.db.insert("stories", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      expiresAt: Date.now() + STORY_DURATION,
      views: 0,
    });
  },
});

export const getActiveStories = query({
  handler: async (ctx) => {
    const now = Date.now();
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_expires_at", (q) => q.gt("expiresAt", now))
      .order("asc")
      .collect();

    const storiesWithAuthors = await Promise.all(
      stories.map(async (story) => {
        const author = await ctx.db.get(story.userId);
        if (!author) return null;

        return {
          ...story,
          author,
        };
      })
    );

    return storiesWithAuthors.filter((story) => story !== null);
  },
});

export const getStoriesByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .order("desc")
      .collect();
  },
});

export const incrementViews = mutation({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) return false;

    await ctx.db.patch(args.storyId, {
      views: story.views + 1,
    });

    return true;
  },
});
