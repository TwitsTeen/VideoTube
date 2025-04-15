import VideoComponent from "@/components/videoComponent";
import { VideoDetails } from "@/interfaces/interfaces";
import { fetchVideoByUserId } from "@/services/fetchVideo";
import { fetchUserById } from "@/services/interactions";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL?.split("/api")[0];

function ProfileView() {
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useFetch(async () =>
    fetchUserById(id as string)
  );

  const {
    data: videos,
    loading: loadingVideos,
    error: errorVideos,
  } = useFetch(async () => fetchVideoByUserId(id as string));

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-gray-100 p-6 rounded-b-3xl shadow-md">
        <View className="items-center">
          <Image
            source={{
              uri: data?.profile_picture
                ? `${baseUrl}/storage/${data?.profile_picture}`
                : `${baseUrl}/storage/profile_pictures/placeholder.avif`,
            }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
          <Text className="text-xl font-bold mt-4">{data?.name}</Text>
          <Text className="text-gray-600 mt-2 text-center px-4">
            {data?.bio}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <FlatList
          data={videos as unknown as VideoDetails[]}
          renderItem={({ item }) => <VideoComponent video={item} />}
          keyExtractor={(item) => item.id.toString()}
          refreshing={loading}
          onRefresh={() => {}}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-4">
              <Text>No videos found</Text>
            </View>
          }
          ListFooterComponent={
            <View className="flex-1 justify-center items-center mt-4 mb-8">
              {loadingVideos ? <Text>Loading...</Text> : null}
              {errorVideos ? <Text>Error: {errorVideos.message}</Text> : null}
            </View>
          }
          ListHeaderComponent={
            <View className="flex-1 justify-center items-center mb-4">
              <Text>Latest videos</Text>
            </View>
          }
          showsVerticalScrollIndicator={Platform.OS === "android"}
          showsHorizontalScrollIndicator={Platform.OS === "android"}
          contentContainerStyle={{ paddingBottom: 20 }}
          numColumns={Platform.OS === "web" ? 6 : 2}
        />
      </View>
    </ScrollView>
  );
}

export default ProfileView;
