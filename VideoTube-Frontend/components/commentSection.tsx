import { CommentInterface } from "@/interfaces/interfaces";
import { AuthContext } from "@/providers/AuthProvider";
import { fetchCommentsByVideoId, postComment } from "@/services/interactions";
import useFetch from "@/services/useFetch";
import { Link } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";

const storageUrl = process.env.EXPO_PUBLIC_STORAGE_API_URL;

function CommentSection({ videoId }: { videoId: string }) {
  const { userToken } = useContext(AuthContext);

  const { data, loading, error, refetch } = useFetch(
    async () => await fetchCommentsByVideoId(videoId)
  );

  const [newComment, setNewComment] = useState("");

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View>
        <Text>An error occurred: {error.message}</Text>
      </View>
    );
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    await postComment(videoId, userToken!, newComment);
    setNewComment("");
    refetch();
  };

  return (
    <View style={{ marginBottom: 50 }}>
      <Text className="text-2xl text-gray-300 p-6">Comments</Text>

      <View className="flex-row items-start px-6 gap-2">
        <TextInput
          placeholder="Write a comment"
          placeholderTextColor="#848081"
          className="border border-gray-300 rounded-md p-2 text-gray-300 flex-1"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={3}
          editable={!!userToken}
        />
        <TouchableOpacity
          className="bg-accent rounded-md px-4 py-2 justify-center items-center"
          onPress={handlePostComment}
        >
          <Text className="text-white">Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16, maxHeight: 400 }}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <View className="p-4 rounded-md bg-secondary mb-2 mx-8">
            <Link href={`/profile/${item.user_id}`}>
              <View className="flex-row items-center mb-2">
                <Image
                  source={{
                    uri: item?.user_profile_picture
                      ? `${storageUrl}/${item?.user_profile_picture}`
                      : `${storageUrl}/profile_pictures/placeholder.avif`,
                  }}
                  style={{ width: 30, height: 30, borderRadius: 60 }}
                />
                <Text className="text-gray-300 text-xl px-4">
                  {item.user_name}
                </Text>
              </View>
            </Link>
            <Text className="text-gray-400 text-sm">
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <View className="h-px bg-gray-600 my-2" />

            <Text className="text-gray-300">{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default CommentSection;
