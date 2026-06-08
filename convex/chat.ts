import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

function sortParticipants(
  firstId: Id<"users">,
  secondId: Id<"users">
): [Id<"users">, Id<"users">] {
  return firstId < secondId ? [firstId, secondId] : [secondId, firstId];
}

export const getConversations = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const asFirst = await ctx.db
      .query("conversations")
      .withIndex("by_participant_one", (q) =>
        q.eq("participantOneId", currentUser._id)
      )
      .collect();
    const asSecond = await ctx.db
      .query("conversations")
      .withIndex("by_participant_two", (q) =>
        q.eq("participantTwoId", currentUser._id)
      )
      .collect();

    const conversations = [...asFirst, ...asSecond].sort(
      (a, b) => (b.lastMessageAt ?? b._creationTime) - (a.lastMessageAt ?? a._creationTime)
    );

    const enriched = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId =
          conversation.participantOneId === currentUser._id
            ? conversation.participantTwoId
            : conversation.participantOneId;
        const otherUser = await ctx.db.get(otherUserId);
        if (!otherUser) return null;

        return {
          ...conversation,
          otherUser,
        };
      })
    );

    return enriched.filter((conversation) => conversation !== null);
  },
});

export const getOrCreateConversation = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (currentUser._id === args.userId) {
      throw new Error("Cannot message yourself");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) throw new Error("User not found");

    const [participantOneId, participantTwoId] = sortParticipants(
      currentUser._id,
      args.userId
    );

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_both", (q) =>
        q.eq("participantOneId", participantOneId).eq("participantTwoId", participantTwoId)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participantOneId,
      participantTwoId,
    });
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const isParticipant =
      conversation.participantOneId === currentUser._id ||
      conversation.participantTwoId === currentUser._id;
    if (!isParticipant) throw new Error("Not allowed");

    const otherUserId =
      conversation.participantOneId === currentUser._id
        ? conversation.participantTwoId
        : conversation.participantOneId;
    const otherUser = await ctx.db.get(otherUserId);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("desc")
      .collect();

    return {
      currentUser,
      otherUser,
      messages,
    };
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const isParticipant =
      conversation.participantOneId === currentUser._id ||
      conversation.participantTwoId === currentUser._id;
    if (!isParticipant) throw new Error("Not allowed");

    const content = args.content.trim();
    if (!content) throw new Error("Message cannot be empty");

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: currentUser._id,
      content,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessage: content,
      lastMessageAt: Date.now(),
    });

    return messageId;
  },
});
