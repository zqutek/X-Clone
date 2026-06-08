import { useUser } from "@clerk/clerk-expo";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../convex/_generated/api";

function getUsername(email: string, fallback: string) {
  return email.split("@")[0] || fallback;
}

export default function useEnsureConvexUser() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const createAuthenticatedUser = useMutation(api.users.createAuthenticatedUser);
  const lastCreatedClerkId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isAuthenticated || !user) return;
    if (lastCreatedClerkId.current === user.id) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    lastCreatedClerkId.current = user.id;

    createAuthenticatedUser({
      email,
      fullname: user.fullName || user.username || getUsername(email, user.id),
      image: user.imageUrl,
      username: user.username || getUsername(email, user.id),
    }).catch((error) => {
      lastCreatedClerkId.current = null;
      console.error("Error ensuring Convex user:", error);
    });
  }, [createAuthenticatedUser, isAuthenticated, isLoaded, user]);
}
