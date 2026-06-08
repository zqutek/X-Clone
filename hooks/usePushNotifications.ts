import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { api } from "../convex/_generated/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#1DA1F2",
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermissions.status;

  if (currentPermissions.status !== "granted") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  const token = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();

  return token.data;
}

export default function usePushNotifications() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const savePushToken = useMutation(api.users.savePushToken);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let isMounted = true;

    registerForPushNotificationsAsync()
      .then(async (token) => {
        if (isMounted && token) {
          await savePushToken({ pushToken: token });
        }
      })
      .catch((error) => {
        console.error("Error registering push notifications:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, savePushToken]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (typeof data?.senderId === "string" && data.type === "follow") {
          router.push(`/user/${data.senderId}` as any);
          return;
        }

        if (data?.type === "like" || data?.type === "comment") {
          router.push("/(tabs)/notifications");
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [router]);
}
