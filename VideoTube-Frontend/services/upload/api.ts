import { DocumentPickerSuccessResult } from "expo-document-picker";
import { ImagePickerResult } from "expo-image-picker";
import { Platform } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_BASE_API_URL;

export const uploadVideo = async (
  title: string,
  description: string,
  image: ImagePickerResult,
  video: DocumentPickerSuccessResult,
  token: string
) => {
  if (
    !title ||
    !description ||
    !image ||
    !image.assets ||
    !image.assets[0] ||
    !video ||
    !video.assets ||
    !video.assets[0]
  ) {
    return {
      success: false,
      message:
        "Please fill in all fields and select both an image and a video.",
    };
  }

  const imageAsset = image.assets[0];
  const videoAsset = video.assets[0];

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);

  try {
    if (Platform.OS === "web") {
      // For Web: Fetch the URI to get a Blob

      // Fetch and append thumbnail
      const imageResponse = await fetch(imageAsset.uri);
      const imageBlob = await imageResponse.blob();
      formData.append(
        "thumbnail",
        imageBlob,
        imageAsset.fileName ||
          `thumbnail.${imageBlob.type.split("/")[1] || "jpg"}`
      );

      // Fetch and append video
      const videoResponse = await fetch(videoAsset.uri);
      const videoBlob = await videoResponse.blob();
      formData.append("video", videoBlob, videoAsset.name);
    } else {
      // For Native (iOS/Android)
      formData.append("thumbnail", {
        uri: imageAsset.uri,
        name: imageAsset.fileName || "thumbnail.jpg",
        type:
          imageAsset.type ||
          (imageAsset.uri.includes(".png") ? "image/png" : "image/jpeg"),
      } as any);

      formData.append("video", {
        uri: videoAsset.uri,
        name: videoAsset.name,
        type: videoAsset.mimeType || "video/mp4",
      } as any);
    }

    const response = await fetch(`${apiUrl}/videos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log("response", response);
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      try {
        data = JSON.parse(text);
      } catch (e) {
        /* ignore parsing error */
      }
      if (!response.ok) {
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}. Body: ${text}`
        );
      }
    }

    if (response.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        message:
          data?.message ||
          `Upload failed: ${response.statusText || response.status}`,
      };
    }
  } catch (error: any) {
    console.error("Upload Error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred during upload.",
    };
  }
};
