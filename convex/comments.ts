import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.userId);
        if (!author) return null;

        return {
          ...comment,
          author,
        };
      })
    );

    return commentsWithAuthors.filter((comment) => comment !== null);
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const content = args.content.trim();
    if (!content) throw new Error("Comment cannot be empty");

    const commentId = await ctx.db.insert("comments", {
      userId: currentUser._id,
      postId: args.postId,
      content,
    });

    await ctx.db.patch(args.postId, {
      comments: post.comments + 1,
    });

    if (post.userId !== currentUser._id) {
      const receiver = await ctx.db.get(post.userId);

      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId: args.postId,
        commentId,
      });

      if (receiver?.pushToken) {
        await ctx.scheduler.runAfter(
          0,
          internal.pushNotifications.sendPushNotification,
          {
            pushToken: receiver.pushToken,
            title: "New reply",
            body: `@${currentUser.username}: ${content}`,
            data: {
              type: "comment",
              postId: args.postId,
              commentId,
              senderId: currentUser._id,
            },
          }
        );
      }
    }

    return commentId;
  },
});
