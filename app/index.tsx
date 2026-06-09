import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import Loader from "../components/Loader";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Loader />;
  }

  return <Redirect href={isSignedIn ? "/(tabs)" : "/(auth)/login"} />;
}
