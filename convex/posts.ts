import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image URL not found");

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const posts = await ctx.db.query("posts").order("desc").collect();

    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        if (!author) return null;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        const bookmark = await ctx.db
          .query("bookmarks")
          .withIndex("by_both", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        return {
          ...post,
          author,
          isLiked: !!like,
          isBookmarked: !!bookmark,
        };
      })
    );

    return postsWithAuthors.filter((post) => post !== null);
  },
});

export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likes: Math.max(0, post.likes - 1),
      });
      return false;
    }

    await ctx.db.insert("likes", {
      userId: currentUser._id,
      postId: args.postId,
    });

    await ctx.db.patch(args.postId, {
      likes: post.likes + 1,
    });

    if (post.userId !== currentUser._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "like",
        postId: args.postId,
      });
    }

    return true;
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== currentUser._id) throw new Error("Not allowed");

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    await Promise.all([
      ...likes.map((like) => ctx.db.delete(like._id)),
      ...comments.map((comment) => ctx.db.delete(comment._id)),
      ...bookmarks.map((bookmark) => ctx.db.delete(bookmark._id)),
      ...notifications.map((notification) => ctx.db.delete(notification._id)),
    ]);

    await ctx.storage.delete(post.storageId);
    await ctx.db.delete(args.postId);
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, currentUser.posts - 1),
    });

    return true;
  },
});
