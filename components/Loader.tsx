import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/feed.styles";

export default function Loader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );
}
