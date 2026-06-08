import { FlatList, View } from "react-native";
import { STORIES } from "../constants/mock-data";
import { styles } from "../styles/feed.styles";
import Story from "./Story";

export default function StoriesSection() {
  return (
    <View style={styles.storiesContainer}>
      <FlatList
        contentContainerStyle={styles.storiesContent}
        data={STORIES}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Story story={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
