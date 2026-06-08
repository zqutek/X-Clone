import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .order("desc")
      .collect();

    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await ctx.db.get(notification.senderId);
        const post = notification.postId
          ? await ctx.db.get(notification.postId)
          : null;
        const comment = notification.commentId
          ? await ctx.db.get(notification.commentId)
          : null;

        if (!sender) return null;

        return {
          ...notification,
          sender,
          post,
          comment,
        };
      })
    );

    return enrichedNotifications.filter(
      (notification) => notification !== null
    );
  },
});
