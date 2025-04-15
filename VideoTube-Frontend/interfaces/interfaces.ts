export interface Video {
  id: string;
  title: string;
  view_count: number;
  thumbnail_url: string;
  user_id: string;
  user_name: string;
  user_profile_picture: string;
  created_at: Date;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  view_count: number;
  thumbnail_url: string;
  video_url: string;
  user_id: string;
  user_name: string;
  user_profile_picture: string;
  likes_count: number;
  created_at: Date;
}
