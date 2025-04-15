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

const storageUrl =
  process.env.EXPO_PUBLIC_BASE_API_URL?.split("/api")[0] + "/storage";

function CommentSection({ videoId }: { videoId: string }) {
  const { userToken } = useContext(AuthContext);

  const { data, loading, error } = useFetch(async () => {
    return await fetchCommentsByVideoId(videoId);
  });
  const [newComment, setNewComment] = useState("");

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View>
        <Text>An error occured : {error.message}</Text>
      </View>
    );
  }
  return (
    <View>
      <Text className="text-2xl text-gray-300 p-6">Comments</Text>
      <View className="flex-row items-center mb-2 mx-6">
        <TextInput
          placeholder="Write a comment"
          placeholderTextColor={"#848081"}
          className="border border-gray-300 rounded-md p-2 w-full mb-4 text-gray-300 mx-6"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={4}
          enabled={!!userToken}
          onSubmitEditing={async () => {
            postComment(videoId, userToken!, newComment);
            setNewComment("");
          }}
        />
        <TouchableOpacity
          className="bg-accent rounded-md p-2 mb-4 mx-6 h-4/5 justify-center w-1/12 items-center"
          onPress={async () => {
            await postComment(videoId, userToken!, newComment);
            setNewComment("");
          }}
        >
          <Text className="text-gray-300">Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList<CommentInterface>
        data={data || []}
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

            <Text className="text-gray-300">{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default CommentSection;
