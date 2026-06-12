import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const searchUsers = query({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.searchQuery.trim();
    if (!searchQuery) return [];

    const currentUser = await getAuthenticatedUser(ctx);

    const byUsername = await ctx.db
      .query("users")
      .withSearchIndex("search_by_username", (q) =>
        q.search("username", searchQuery)
      )
      .take(10);

    const byFullname = await ctx.db
      .query("users")
      .withSearchIndex("search_by_fullname", (q) =>
        q.search("fullname", searchQuery)
      )
      .take(10);

    const seen = new Set<string>();
    const users = [...byUsername, ...byFullname].filter((user) => {
      if (seen.has(user._id) || user._id === currentUser._id) return false;
      seen.add(user._id);
      return true;
    });

    return await Promise.all(
      users.map(async (user) => {
        const follow = await ctx.db
          .query("follows")
          .withIndex("by_both", (q) =>
            q.eq("followerId", currentUser._id).eq("followingId", user._id)
          )
          .first();

        return {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          image: user.image,
          followers: user.followers,
          isFollowing: !!follow,
        };
      })
    );
  },
});

export const searchPosts = query({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.searchQuery.trim();
    if (!searchQuery) return [];

    const currentUser = await getAuthenticatedUser(ctx);

    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_by_caption", (q) =>
        q.search("caption", searchQuery)
      )
      .take(20);

    const results = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        if (!author) return null;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        return {
          _id: post._id,
          imageUrl: post.imageUrl,
          likes: post.likes,
          author: {
            username: author.username,
          },
          isLiked: !!like,
        };
      })
    );

    return results.filter((post) => post !== null);
  },
});

export const getExplorePosts = query({
  handler: async (ctx) => {
    await getAuthenticatedUser(ctx);

    const posts = await ctx.db.query("posts").order("desc").take(50);
    const popularPosts = posts.sort((a, b) => b.likes - a.likes).slice(0, 30);

    const results = await Promise.all(
      popularPosts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        if (!author) return null;

        return {
          _id: post._id,
          imageUrl: post.imageUrl,
          likes: post.likes,
          author: {
            username: author.username,
          },
        };
      })
    );

    return results.filter((post) => post !== null);
  },
});
