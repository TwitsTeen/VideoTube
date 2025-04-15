import VideoComponent from "@/components/videoComponent";
import { fetchVideos } from "@/services/fetchVideo";
import useFetch from "@/services/useFetch";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FlatList } from "react-native-gesture-handler";

export default function Index() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { width } = useWindowDimensions();
  const [selectedSort, setSelectedSort] = useState("latest");
  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Most Viewed", value: "most_viewed" },
    { label: "Most Liked", value: "most_liked" },
    { label: "Oldest", value: "oldest" },
  ];

  const { data, loading, error, reset, setFetchFunction } = useFetch(async () =>
    fetchVideos({ query: search, page: page, sort: selectedSort })
  );

  useEffect(() => {
    setLimit(data?.last_page || 1);
  }, [data]);

  // Set columns responsively
  const numColumns =
    width >= 1280 ? 6 : width >= 1024 ? 4 : width >= 768 ? 2 : 1;

  const nextPage = async () => {
    if (page < data?.last_page) {
      const next = page + 1;
      setPage(next);
      setFetchFunction(() =>
        fetchVideos({ query: search, page: next, sort: selectedSort })
      );
    }
  };

  const prevPage = async () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      setFetchFunction(() =>
        fetchVideos({ query: search, page: prev, sort: selectedSort })
      );
    }
  };

  useEffect(() => {
    setFetchFunction(() =>
      fetchVideos({ query: search, page, sort: selectedSort })
    );
  }, [selectedSort]);

  return (
    <View className="flex-1 bg-primary pt-8">
      <View className="w-full px-4 max-w-screen-xl mx-auto">
        <TextInput
          placeholder="Search videos..."
          placeholderTextColor="#848081"
          className="border border-gray-600 rounded-md px-4 py-2 text-gray-300 mb-4"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => {
            reset();
            setPage(1);
            setFetchFunction(() => fetchVideos({ query: search, page: 1 }));
          }}
        />
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-300 text-lg">Sort by:</Text>
          <Picker
            selectedValue={selectedSort}
            onValueChange={(itemValue, _) => setSelectedSort(itemValue)}
            style={{
              color: "#d1d5db",
              backgroundColor: "#1f2937",
              borderWidth: 1,
              borderColor: "#4b5563",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            {sortOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      <FlatList
        data={data?.videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <VideoComponent video={item} />}
        numColumns={numColumns}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: "space-between" } : undefined
        }
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: width >= 768 ? 16 : 8,
          maxWidth: 1280,
          alignSelf: "center",
        }}
        ListHeaderComponent={
          <Text className="text-gray-300 text-center text-lg mb-4">
            {search
              ? `Search results for "${search}"`
              : `${
                  selectedSort.charAt(0).toUpperCase() +
                  selectedSort.replace(/_/g, " ").slice(1)
                } videos`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-8">
              <Text className="text-gray-300">No videos found.</Text>
            </View>
          ) : (
            <View className="items-center mt-8">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="text-gray-300 mt-2">Loading...</Text>
            </View>
          )
        }
        ListFooterComponent={
          <View className="flex-row justify-center items-center space-x-4 mt-6">
            <TouchableOpacity onPress={prevPage} disabled={page === 1}>
              <MaterialIcons name="arrow-back-ios" size={32} color="#848081" />
            </TouchableOpacity>

            <Text className="text-gray-300 text-base">
              Page {page} of {limit}
            </Text>

            <TouchableOpacity
              onPress={nextPage}
              disabled={page === limit || !data?.videos?.length}
            >
              <MaterialIcons
                name="arrow-forward-ios"
                size={32}
                color="#848081"
              />
            </TouchableOpacity>
          </View>
        }
        refreshing={loading}
        onRefresh={() => {
          setPage(1);
          reset();
          setFetchFunction(() => fetchVideos({ query: search, page: 1 }));
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
