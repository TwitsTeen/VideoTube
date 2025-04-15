import { ImagePickerResult } from "expo-image-picker";
import { Platform } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_BASE_API_URL;

export const likeVideo = async (videoId: string, token: string) => {
  const response = await fetch(`${apiUrl}/like/${videoId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to like video:", response.statusText);
    return;
  }

  return response.json();
};

export const getProfileMe = async (token: string) => {
  if (!token) {
    console.error("Token is missing");
    return null;
  }

  const response = await fetch(`${apiUrl}/profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch profile:", response.statusText);
    return null;
  }
  const result = await response.json();
  return result.data;
};

export const editProfile = async (
  token: string,
  bio: string,
  image?: ImagePickerResult
) => {
  if (!token) {
    console.error("Token is missing");
    return null;
  }

  const formData = new FormData();
  formData.append("bio", bio);

  if (image && image.assets && image.assets[0]) {
    const imageAsset = image.assets[0];
    if (Platform.OS === "web") {
      // For Web: Fetch the URI to get a Blob

      // Fetch and append thumbnail
      const imageResponse = await fetch(imageAsset.uri);
      const imageBlob = await imageResponse.blob();
      formData.append(
        "profile_picture",
        imageBlob,
        imageAsset.fileName ||
          `profile_picture.${imageBlob.type.split("/")[1] || "jpg"}`
      );
    } else {
      // For Native (iOS/Android)
      formData.append("profile_picture", {
        uri: imageAsset.uri,
        name: imageAsset.fileName || "thumbnail.jpg",
        type:
          imageAsset.type ||
          (imageAsset.uri.includes(".png") ? "image/png" : "image/jpeg"),
      } as any);
    }
  }

  const response = await fetch(`${apiUrl}/profile/edit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    console.error("Failed to edit profile:", response.statusText);
    return null;
  }

  const result = await response.json();
  return result.data;
};

export const fetchUserById = async (id: string) => {
  const response = await fetch(`${apiUrl}/profiles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch user:", response.statusText);
    return null;
  }

  const result = await response.json();
  return result.data;
};
