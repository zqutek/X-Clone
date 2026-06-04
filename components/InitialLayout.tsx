import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isLoaded, isSignedIn, router, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
