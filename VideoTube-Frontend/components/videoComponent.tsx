import React, { useEffect } from "react";
import { Video } from "../interfaces/interfaces";
import { View, Text, Image } from "react-native";
import { Link } from "expo-router";

const storageUrl =
  process.env.EXPO_PUBLIC_BASE_API_URL?.split("/api")[0] + "/storage";

function videoComponent({ video }: { video: Video }) {
  useEffect(() => {
    console.log("Video component mounted:", video);
  }, [video]);
  return (
    <Link href={`/video/${video.id}`}>
      <View className="p-4 bg-white rounded-lg shadow-md w-52 m-2">
        <Image
          source={{
            uri: `${storageUrl}/${video.thumbnail_url}`,
          }}
          className="w-full h-64 rounded-md mb-4"
          resizeMode="contain"
        />
        <Text className="text-lg font-bold mb-2" numberOfLines={2}>
          {video.title}
        </Text>
        <View className="flex-row items-center mb-2">
          <Image
            source={{
              uri: video.user_profile_picture
                ? `${storageUrl}/${video?.user_profile_picture}`
                : `${storageUrl}/profile_pictures/placeholder.avif`,
            }}
            style={{ width: 30, height: 30, borderRadius: 60 }}
          />
          <Text className="text-gray-600 mb-2 mx-4" numberOfLines={2}>
            {video.user_name}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 text-sm">
            {new Date(video.created_at).toLocaleDateString()}
          </Text>
          <Text className="text-gray-500 ">{video.view_count} views</Text>
        </View>
      </View>
    </Link>
  );
}

export default videoComponent;
