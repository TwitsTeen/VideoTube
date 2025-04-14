<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'thumbnail_url' => $this->thumbnail_url,
            'video_url' => $this->video_url,
            'view_count' => $this->view_count,
            'user_id' => $this->user_id,
            'user_name' => User::where('id', $this->user_id)->value('name'),
            'created_at' => $this->created_at,
        ];
    }
}
