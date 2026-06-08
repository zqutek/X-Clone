import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Id } from "../convex/_generated/dataModel";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/notifications.styles";

type NotificationType = "like" | "comment" | "follow";

function getNotificationMeta(type: NotificationType) {
  if (type === "like") {
    return {
      icon: "favorite",
      color: COLORS.primary,
      text: "liked your post",
    };
  }

  if (type === "comment") {
    return {
      icon: "chat-bubble",
      color: "#3B82F6",
      text: "commented on your post",
    };
  }

  return {
    icon: "person-add-alt-1",
    color: "#8B5CF6",
    text: "started following you",
  };
}

type NotificationItemProps = {
  notification: {
    _id: Id<"notifications">;
    _creationTime: number;
    type: NotificationType;
    sender: {
      _id: Id<"users">;
      clerkId: string;
      username: string;
      image: string;
    };
    post?: {
      imageUrl: string;
    } | null;
    comment?: {
      content: string;
    } | null;
  };
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { user } = useUser();
  const meta = getNotificationMeta(notification.type);

  const openSenderProfile = () => {
    if (notification.sender.clerkId === user?.id) {
      router.push("/(tabs)/profile");
      return;
    }

    router.push(`/user/${notification.sender._id}` as any);
  };

  return (
    <View style={styles.notificationItem}>
      <TouchableOpacity onPress={openSenderProfile} style={styles.avatarWrap}>
        <Image
          source={notification.sender.image}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={[styles.iconBadge, { backgroundColor: meta.color }]}>
          <MaterialIcons name={meta.icon as any} size={13} color={COLORS.text} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openSenderProfile}
        style={styles.itemBody}
      >
        <Text style={styles.itemText}>
          <Text style={styles.username}>@{notification.sender.username}</Text>{" "}
          {meta.text}
        </Text>
        {notification.type === "comment" && !!notification.comment?.content && (
          <Text numberOfLines={2} style={styles.commentText}>
            "{notification.comment.content}"
          </Text>
        )}
        <Text style={styles.timeText}>
          {formatDistanceToNow(new Date(notification._creationTime), {
            addSuffix: true,
          })}
        </Text>
      </TouchableOpacity>

      {!!notification.post?.imageUrl && (
        <Image
          source={notification.post.imageUrl}
          style={styles.postThumb}
          contentFit="cover"
        />
      )}
    </View>
  );
}
