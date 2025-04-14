import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { Video as VideoType } from "@/interfaces/interfaces";
import useFetch from "@/services/useFetch";
import { fetchVideoById } from "@/services/fetchVideo";

const Watch = () => {
  const { id } = useLocalSearchParams();
  const [videoSource, setVideoSource] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: video, loading } = useFetch<VideoType>(async () =>
    fetchVideoById(id as string)
  );

  useEffect(() => {
    if (video && video.video_url) {
      const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL?.split("/api")[0];
      if (!baseUrl) {
        setError("Base URL is not defined in environment variables.");
        return;
      }
      const constructedVideoUrl = `${baseUrl}/storage/${video.video_url}`;
      setVideoSource(constructedVideoUrl);
    }
  }, [video]);

  const [status, setStatus] = useState({});

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video not found.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.videoContainer}>
          {videoSource && !error ? (
            <Video
              style={styles.video}
              source={{
                uri: videoSource,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={setStatus}
              shouldPlay
              onError={(err: any) => {
                console.error("Video playback error:", err);
                setError(
                  "Failed to play video.  Please check the video source and your network connection."
                );
              }}
            />
          ) : (
            <View style={styles.video}>
              <Text>No video source available.</Text>
            </View>
          )}
        </View>

        <View className="p-4">
          <Text className="text-white text-lg font-bold">{video.title}</Text>
          <Text className="text-gray-400 text-sm">{video.user_name}</Text>
          <Text className="text-gray-400 text-sm mt-1">
            {video.view_count.toLocaleString()} views ·{" "}
            {new Date(video.created_at).toLocaleDateString()}
          </Text>
          <View className="h-px bg-gray-600 my-4" />
          <Text className="text-white text-sm">{video.description}</Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#f00",
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    width: "70%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    marginTop: 30,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default Watch;
