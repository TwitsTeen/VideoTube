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
