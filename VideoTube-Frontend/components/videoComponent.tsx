import React, { useEffect } from "react";
import { Video } from "../interfaces/interfaces";
import { View, Text, Image } from "react-native";
import { Link } from "expo-router";

const storageUrl =
  process.env.EXPO_PUBLIC_BASE_API_URL?.split("/api")[0] + "/storage";

function VideoComponent({ video }: { video: Video }) {
  useEffect(() => {
    console.log("Video component mounted:", video);
  }, [video]);

  return (
    <Link href={`/video/${video.id}`}>
      <View
        className="bg-tertiary rounded-lg shadow-md m-2"
        style={{ width: 208, height: 380, padding: 16 }}
      >
        <Image
          source={{
            uri: `${storageUrl}/${video.thumbnail_url}`,
          }}
          style={{
            width: "100%",
            height: 210,
            borderRadius: 8,
            marginBottom: 16,
          }}
          resizeMode="cover"
        />
        <Text
          className="text-lg font-bold text-gray-200"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {video.title}
        </Text>
        <View className="flex-row items-center my-2">
          <Image
            source={{
              uri: video.user_profile_picture
                ? `${storageUrl}/${video?.user_profile_picture}`
                : `${storageUrl}/profile_pictures/placeholder.avif`,
            }}
            style={{ width: 30, height: 30, borderRadius: 60 }}
          />
          <Text
            className="text-gray-300 mx-4 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {video.user_name}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-auto">
          <Text className="text-gray-400 text-sm">
            {new Date(video.created_at).toLocaleDateString()}
          </Text>
          <Text className="text-gray-400 text-sm">
            {video.view_count} views
          </Text>
        </View>
      </View>
    </Link>
  );
}

export default VideoComponent;
