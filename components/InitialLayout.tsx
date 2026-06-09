import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import Loader from "./Loader";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inSSOCallback = segments[0] === "sso-callback";

    if (inSSOCallback) return;

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isLoaded, isSignedIn, router, segments]);

  if (!isLoaded) {
    return <Loader />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
