import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { FlatList, Text, View } from "react-native";
import Loader from "../../components/Loader";
import { api } from "../../convex/_generated/api";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/notifications.styles";

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

function NoNotificationsFound() {
  return (
    <View style={styles.centered}>
      <MaterialIcons name="notifications-none" size={44} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No notifications yet</Text>
      <Text style={styles.emptyText}>
        Likes, comments, and follows will show up here.
      </Text>
    </View>
  );
}

type NotificationItemProps = {
  notification: {
    _creationTime: number;
    type: NotificationType;
    sender: {
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

function NotificationItem({ notification }: NotificationItemProps) {
  const meta = getNotificationMeta(notification.type);

  return (
    <View style={styles.notificationItem}>
      <View style={styles.avatarWrap}>
        <Image
          source={notification.sender.image}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={[styles.iconBadge, { backgroundColor: meta.color }]}>
          <MaterialIcons name={meta.icon as any} size={13} color={COLORS.text} />
        </View>
      </View>

      <View style={styles.itemBody}>
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
      </View>

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

export default function NotificationsScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const notifications = useQuery(
    api.notifications.getNotifications,
    isAuthenticated ? {} : "skip"
  );

  if (isLoading || (isAuthenticated && notifications === undefined)) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {!isAuthenticated || !notifications?.length ? (
        <NoNotificationsFound />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
