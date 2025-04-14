import React from "react";
import { Video } from "../interfaces/interfaces";
import { View, Text, Image } from "react-native";
import { Link } from "expo-router";

const storageUrl = process.env.EXPO_PUBLIC_BASE_API_URL?.split("/api")[0];

function videoComponent({ video }: { video: Video }) {
  return (
    <Link href={`/video/${video.id}`}>
      <View className="p-4 bg-white rounded-lg shadow-md w-52 m-2">
        <Image
          source={{
            uri: `${storageUrl}/storage/${video.thumbnail_url}`,
          }}
          className="w-full h-64 rounded-md mb-4"
          resizeMode="contain"
        />
        <Text className="text-lg font-bold mb-2" numberOfLines={2}>
          {video.title}
        </Text>
        <Text className="text-gray-600 mb-2" numberOfLines={2}>
          {video.user_name}
        </Text>
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
