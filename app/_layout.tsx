import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/InitialLayout";
import useEnsureConvexUser from "../hooks/useEnsureConvexUser";
import usePushNotifications from "../hooks/usePushNotifications";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    JetBrainsMono: require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkAndConvexProvider>
      <RootContent />
    </ClerkAndConvexProvider>
  );
}

function RootContent() {
  useEnsureConvexUser();
  usePushNotifications();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <InitialLayout />
    </SafeAreaView>
  );
}
