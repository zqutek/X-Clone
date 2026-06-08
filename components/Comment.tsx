import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { styles } from "../styles/feed.styles";

type CommentProps = {
  comment: {
    _creationTime: number;
    content: string;
    author: {
      username: string;
      image: string;
    };
  };
};

export default function Comment({ comment }: CommentProps) {
  return (
    <View style={styles.commentContainer}>
      <Image source={comment.author.image} style={styles.avatar} contentFit="cover" />
      <View style={styles.commentBody}>
        <Text style={styles.fullname}>@{comment.author.username}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.timeText}>
          {formatDistanceToNow(new Date(comment._creationTime), { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
