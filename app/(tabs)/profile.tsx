import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Loader from "../../components/Loader";
import { FeedPost } from "../../components/Post";
import { api } from "../../convex/_generated/api";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/profile.styles";

function NoPostsFound() {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="grid-off" size={44} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptyText}>Posts you share will appear on your profile.</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEnsuringProfile, setIsEnsuringProfile] = useState(false);

  const shouldLoadProfile = isAuthLoaded && isSignedIn && isAuthenticated;
  const hasClerkIdForFallback = shouldLoadProfile && !!user?.id;
  const currentUser = useQuery(
    api.users.getCurrentUser,
    shouldLoadProfile ? {} : "skip"
  );
  const userByClerkId = useQuery(
    api.users.getUserByClerkId,
    hasClerkIdForFallback ? { clerkId: user.id } : "skip"
  );
  const profile = currentUser ?? userByClerkId;
  const isCurrentUserLoading = shouldLoadProfile && currentUser === undefined;
  const isUserByClerkIdLoading =
    hasClerkIdForFallback && userByClerkId === undefined;
  const isProfileLookupLoading =
    !profile && (isCurrentUserLoading || isUserByClerkIdLoading);
  const profileLookupsFinished =
    shouldLoadProfile &&
    currentUser !== undefined &&
    (!hasClerkIdForFallback || userByClerkId !== undefined);
  const profileNotFound =
    profileLookupsFinished &&
    currentUser === null &&
    (!hasClerkIdForFallback || userByClerkId === null);
  const posts = useQuery(api.posts.getPostsByUser, profile ? {} : "skip");
  const createAuthenticatedUser = useMutation(api.users.createAuthenticatedUser);
  const updateProfile = useMutation(api.users.updateProfile);

  useEffect(() => {
    console.log("[profile-debug] Clerk useUser", {
      isUserLoaded,
      isAuthLoaded,
      isSignedIn,
      clerkUserId: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
    });
  }, [
    isAuthLoaded,
    isSignedIn,
    isUserLoaded,
    user?.id,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  useEffect(() => {
    console.log("[profile-debug] api.users.getCurrentUser result", {
      state:
        currentUser === undefined
          ? "loading"
          : currentUser === null
            ? "null"
            : "found",
      convexUserId: currentUser?._id,
      clerkId: currentUser?.clerkId,
      email: currentUser?.email,
    });
  }, [currentUser]);

  useEffect(() => {
    console.log("[profile-debug] api.users.getUserByClerkId result", {
      clerkUserId: user?.id,
      state:
        userByClerkId === undefined
          ? "loading"
          : userByClerkId === null
            ? "null"
            : "found",
      convexUserId: userByClerkId?._id,
      clerkId: userByClerkId?.clerkId,
      email: userByClerkId?.email,
    });
  }, [userByClerkId, user?.id]);

  useEffect(() => {
    if (!shouldLoadProfile || !isUserLoaded || !user || !profileNotFound) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email || isEnsuringProfile) return;

    setIsEnsuringProfile(true);
    createAuthenticatedUser({
      email,
      fullname: user.fullName || user.username || email.split("@")[0],
      image: user.imageUrl,
      username: user.username || email.split("@")[0],
    })
      .catch((error) => {
        console.error("Error creating missing profile:", error);
      })
      .finally(() => {
        setIsEnsuringProfile(false);
      });
  }, [
    createAuthenticatedUser,
    isEnsuringProfile,
    isUserLoaded,
    profileNotFound,
    shouldLoadProfile,
    user,
  ]);

  useEffect(() => {
    if (profile) {
      setFullname(profile.fullname);
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  const openEditModal = () => {
    if (!profile) return;
    setFullname(profile.fullname);
    setBio(profile.bio ?? "");
    setEditVisible(true);
  };

  const handleSave = async () => {
    if (!fullname.trim() || isSaving) return;

    try {
      setIsSaving(true);
      await updateProfile({
        fullname: fullname.trim(),
        bio: bio.trim() || undefined,
      });
      setEditVisible(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!profile) return;
    await Share.share({
      message: `Check out @${profile.username} on X Clone`,
    });
  };

  if (
    !isAuthLoaded ||
    !isUserLoaded ||
    isLoading ||
    isEnsuringProfile ||
    isProfileLookupLoading ||
    (profile && posts === undefined)
  ) {
    return <Loader />;
  }

  if (profileNotFound) {
    console.log("[profile-debug] Profile not found branch", {
      isAuthenticated,
      isAuthLoaded,
      isSignedIn,
      isUserLoaded,
      clerkUserId: user?.id,
      getCurrentUserState:
        currentUser === undefined
          ? "loading"
          : currentUser === null
            ? "null"
            : "found",
      getUserByClerkIdState:
        userByClerkId === undefined
          ? "loading"
          : userByClerkId === null
            ? "null"
            : "found",
    });

    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Profile not found</Text>
          <Text style={styles.emptyText}>Sign in again to reload your profile.</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return <Loader />;
  }

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.headerTitle}>
          @{profile.username}
        </Text>
        <TouchableOpacity onPress={() => signOut()} style={styles.iconButton}>
          <MaterialIcons name="logout" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.topRow}>
          <Image source={profile.image} style={styles.avatar} contentFit="cover" />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <Text style={styles.fullname}>{profile.fullname}</Text>
        <Text style={profile.bio ? styles.bio : styles.mutedText}>
          {profile.bio || "No bio yet."}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={openEditModal} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <MaterialIcons name="ios-share" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/chats" as any)}
            style={styles.shareButton}
          >
            <MaterialIcons name="chat-bubble-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={<NoPostsFound />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContent}
        data={(posts ?? []) as FeedPost[]}
        keyExtractor={(item) => item._id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSelectedPost(item)}
            style={styles.gridItem}
          >
            <Image source={item.imageUrl} style={styles.gridImage} contentFit="cover" />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
        visible={!!selectedPost}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Post</Text>
            <TouchableOpacity
              onPress={() => setSelectedPost(null)}
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          {!!selectedPost && (
            <View style={styles.postModalContent}>
              <Image
                source={selectedPost.imageUrl}
                style={styles.modalImage}
                contentFit="contain"
              />
              {!!selectedPost.caption && (
                <Text style={styles.modalCaption}>{selectedPost.caption}</Text>
              )}
            </View>
          )}
        </View>
      </Modal>

      <Modal
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
        transparent
        visible={editVisible}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.editModalOverlay}
          >
            <View style={styles.editModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={() => setEditVisible(false)}
                  style={styles.iconButton}
                >
                  <MaterialIcons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.form}>
                <View>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    onChangeText={setFullname}
                    placeholder="Your name"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                    value={fullname}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Bio</Text>
                  <TextInput
                    multiline
                    onChangeText={setBio}
                    placeholder="Write a short bio"
                    placeholderTextColor={COLORS.textMuted}
                    style={[styles.input, styles.bioInput]}
                    value={bio}
                  />
                </View>
                <TouchableOpacity
                  disabled={isSaving || !fullname.trim()}
                  onPress={handleSave}
                  style={[
                    styles.saveButton,
                    (isSaving || !fullname.trim()) && styles.saveButtonDisabled,
                  ]}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
