import { CommentInterface } from "@/interfaces/interfaces";

const apiUrl = process.env.EXPO_PUBLIC_BASE_API_URL;

export const fetchVideos = async ({
  query,
  page = 1,
  sort = "latest",
}: {
  query: string;
  page?: number;
  sort?: string;
}) => {
  const endpoint = query
    ? `/videos?title=${query}&page=${page}&sort=${sort}`
    : `/videos?page=${page}&sort=${sort}`;
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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${apiUrl}/videos/${id}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error(response.message || "Failed to fetch video");
  }

  const result = await response.json();
  return result.data;
};

export const fetchVideoByUserId = async (id: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  console.log("Fetching videos for user ID:", id);

  const response = await fetch(`${apiUrl}/videos/user/${id}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error(response.message || "Failed to fetch video");
  }

  const result = await response.json();
  return result.data.data as CommentInterface[];
};
