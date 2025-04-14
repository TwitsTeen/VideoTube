const apiUrl = process.env.EXPO_PUBLIC_BASE_API_URL;

export const fetchVideos = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}) => {
  const endpoint = query
    ? `/videos?title=${query}&page=${page}`
    : `/videos?page=${page}`;
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error(response.message || "Failed to fetch videos");
  }
  const result = await response.json();

  return result.data;
};

export const fetchVideoById = async (id: string) => {
  const response = await fetch(`${apiUrl}/videos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error(response.message || "Failed to fetch video");
  }

  const result = await response.json();

  return result.data;
};
