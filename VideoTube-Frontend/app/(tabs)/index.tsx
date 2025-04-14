import VideoComponent from "@/components/videoComponent";
import { fetchVideos } from "@/services/fetchVideo";
import useFetch from "@/services/useFetch";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function Index() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, loading, error, refetch, reset, setFetchFunction } = useFetch(
    async () => fetchVideos({ query: search })
  );

  const nextPage = async () => {
    if (page < data?.last_page) {
      setPage(page + 1);
      setFetchFunction(async () => fetchVideos({ query: search, page: page }));
    }
  };

  const prevPage = async () => {
    if (page > 1) {
      setPage(page - 1);
      setFetchFunction(async () => fetchVideos({ query: search, page: page }));
    }
  };

  useEffect(() => {
    setLimit(data?.last_page);
  }, [data]);

  return (
    <View className="flex-1 justify-center items-center space-y-4">
      <View className="w-full p-4">
        <TextInput
          placeholder="Search videos..."
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => {
            console.log("Search submitted:", search);
            reset();
            setPage(1);
            setFetchFunction(async () =>
              fetchVideos({ query: search, page: 1 })
            );
          }}
        />
      </View>
      <FlatList
        data={data?.videos}
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
            {loading ? <Text>Loading...</Text> : null}
            {error ? <Text>Error: {error.message}</Text> : null}
            <View className="flex-row space-x-4 mt-4">
              <TouchableOpacity onPress={prevPage}>
                <MaterialIcons name="arrow-left" size={64} color="#848081" />
              </TouchableOpacity>
              <Text className="text-gray-500">
                Page {page} of {limit}
              </Text>
              <TouchableOpacity onPress={nextPage}>
                <MaterialIcons name="arrow-right" size={64} color="#848081" />
              </TouchableOpacity>
            </View>
          </View>
        }
        ListHeaderComponent={
          <View className="flex-1 justify-center items-center mb-4">
            <Text>
              {search != "" ? `Search for ${search}` : "Latest videos"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={Platform.OS === "android"}
        showsHorizontalScrollIndicator={Platform.OS === "android"}
        contentContainerStyle={{ paddingBottom: 20 }}
        numColumns={Platform.OS === "web" ? 6 : 2}
      />
    </View>
  );
}
