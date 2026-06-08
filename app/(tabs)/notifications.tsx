import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { FlatList, Text, View } from "react-native";
import Loader from "../../components/Loader";
import NotificationItem from "../../components/NotificationItem";
import { api } from "../../convex/_generated/api";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/notifications.styles";

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
