import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) throw new Error("User not found");

  return currentUser;
}

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      bio: args.bio,
      image: args.image,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateProfile = mutation({
  args: {
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    await ctx.db.patch(currentUser._id, {
      fullname: args.fullname.trim(),
      bio: args.bio?.trim() || undefined,
    });

    return true;
  },
});

export const isFollowing = query({
  args: {
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();

    return !!follow;
  },
});

async function updateFollowCounts(
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);

  if (!follower || !following) return;

  await ctx.db.patch(followerId, {
    following: Math.max(0, follower.following + (isFollow ? 1 : -1)),
  });
  await ctx.db.patch(followingId, {
    followers: Math.max(0, following.followers + (isFollow ? 1 : -1)),
  });
}

export const toggleFollow = mutation({
  args: {
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    if (currentUser._id === args.followingId) {
      throw new Error("You cannot follow yourself");
    }

    const targetUser = await ctx.db.get(args.followingId);
    if (!targetUser) throw new Error("User not found");

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();

    if (existingFollow) {
      await ctx.db.delete(existingFollow._id);
      await updateFollowCounts(ctx, currentUser._id, args.followingId, false);
      return false;
    }

    await ctx.db.insert("follows", {
      followerId: currentUser._id,
      followingId: args.followingId,
    });
    await updateFollowCounts(ctx, currentUser._id, args.followingId, true);

    await ctx.db.insert("notifications", {
      receiverId: args.followingId,
      senderId: currentUser._id,
      type: "follow",
    });

    return true;
  },
});

export const getStoriesUsers = query({
  handler: async (ctx) => {
    const now = Date.now();
    const users = await ctx.db.query("users").collect();

    const usersWithStories = await Promise.all(
      users.map(async (user) => {
        const story = await ctx.db
          .query("stories")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.gt(q.field("expiresAt"), now))
          .first();

        return {
          ...user,
          hasStory: !!story,
        };
      })
    );

    return usersWithStories;
  },
});
