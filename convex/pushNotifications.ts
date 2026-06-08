import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const sendPushNotification = internalAction({
  args: {
    pushToken: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {
    if (!args.pushToken.startsWith("ExponentPushToken[")) {
      return { ok: false, reason: "Invalid Expo push token" };
    }

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: args.pushToken,
        sound: "default",
        title: args.title,
        body: args.body,
        data: args.data ?? {},
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        body: await response.text(),
      };
    }

    return {
      ok: true,
      result: await response.json(),
    };
  },
});
