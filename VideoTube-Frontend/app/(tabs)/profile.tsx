import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { AuthContext } from "../../providers/AuthProvider";
import AuthScreen from "@/components/authScreen";
import { editProfile, getProfileMe } from "@/services/interactions";
import useFetch from "@/services/useFetch";
import * as ImagePicker from "expo-image-picker";

function Profile() {
  const { userToken, logout } = useContext(AuthContext);
  const [tmpBio, setTmpBio] = useState("");
  const storageUrl = process.env.EXPO_PUBLIC_STORAGE_API_URL;
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null
  );

  const { data, loading, error, refetch } = useFetch(async () => {
    if (userToken) {
      const res = await getProfileMe(userToken);
      console.log(res);
      return res;
    }
  }, false);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  useEffect(() => {
    if (data?.bio !== undefined) {
      setTmpBio(data.bio);
    }
  }, [data]);

  useEffect(() => {
    if (userToken) {
      refetch();
    }
  }, [userToken]);

  const handleEditProfile = async () => {
    if (!userToken) {
      console.log("You need to be logged in to edit your profile.");
      return;
    }

    const res = await editProfile(userToken, tmpBio, image ? image : undefined);
    console.log(res);
  };

  if (!userToken) {
    return (
      <View className="flex-1 justify-center items-center">
        <AuthScreen />
      </View>
    );
  }

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
        <Text>Error loading profile.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-4 bg-primary">
      <Text className="text-lg font-bold mb-2 text-gray-300">
        {data?.name}'s Profile
      </Text>

      <TouchableOpacity onPress={handleImagePick} className="mb-4">
        <Image
          source={{
            uri:
              image && image.assets && image.assets[0]
                ? image.assets[0].uri
                : data?.profile_picture
                ? `${storageUrl}/${data?.profile_picture}`
                : `${storageUrl}/profile_pictures/placeholder.avif`,
          }}
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
      </TouchableOpacity>
      <Text className="mb-1 text-gray-300">Bio:</Text>

      <TextInput
        placeholder="Edit your bio..."
        placeholderTextColor="#848081"
        className="w-full border rounded p-2 mb-4 text-gray-300"
        value={tmpBio}
        onChangeText={setTmpBio}
      />
      <TouchableOpacity
        onPress={() => handleEditProfile()}
        className="bg-accent px-4 py-2 rounded w-32 mb-4 items-center"
      >
        <Text className="text-white">Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-4 py-2 rounded w-32 items-center"
      >
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;
