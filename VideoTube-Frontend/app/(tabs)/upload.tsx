import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { uploadVideo } from "@/services/upload/api";
import { AuthContext } from "@/providers/AuthProvider";

function upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null
  );
  const [video, setVideo] =
    useState<DocumentPicker.DocumentPickerSuccessResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const { userToken } = useContext(AuthContext);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  const handleVideoPick = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled) {
      setVideo(result);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    if (!userToken) {
      alert("Please log in to upload videos.");
      setUploading(false);
      return;
    }
    const result = await uploadVideo(
      title,
      description,
      image!,
      video!,
      userToken!
    );
    console.log(result);
    setUploading(false);
  };
  if (uploading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-lg font-bold mb-2 text-gray-300">
          Uploading...
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View className="p-5 bg-primary w-full h-full">
      <Text className="text-lg font-bold mb-2 text-gray-300">Title</Text>
      <TextInput
        className="border border-gray-300 mb-4 p-2 rounded text-gray-300"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text className="text-lg font-bold mb-2 text-gray-300">Description</Text>
      <TextInput
        className="border border-gray-300 mb-4 p-2 rounded text-gray-300"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />
      <Button title="Choose Image" onPress={handleImagePick} />

      {image && <Text className="mt-2 text-green-500">Image selected</Text>}
      {image ? (
        <Image
          source={{ uri: image?.assets?.[0]?.uri || "" }}
          style={{ width: 200, height: 200, marginTop: 10 }}
        />
      ) : null}
      <Button title="Choose Video" onPress={handleVideoPick} />
      {video && <Text className="mt-2 text-green-500">Video selected</Text>}
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
}

export default upload;
