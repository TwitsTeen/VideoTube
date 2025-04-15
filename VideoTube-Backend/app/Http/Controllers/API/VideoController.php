<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\VideoRequest;
use App\Http\Resources\VideoDetailResource;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends BaseController
{
    public function index(Request $request)
    {
        $title = $request->query('title');
        $sort = $request->query('sort');
        $videos = Video::query();

        if ($title) {
            $videos->where('title', 'LIKE', '%' . $title . '%');
        }

        if ($sort) {
            if ($sort === 'most_viewed') {
                $videos->orderBy('view_count', 'desc');
            }elseif ($sort === 'oldest') {
                $videos->orderBy('created_at', 'asc');
            } elseif ($sort === 'latest') {
                $videos->orderBy('created_at', 'desc');
            } elseif ($sort === 'most_liked') {
                $videos->withCount('likes')->orderBy('likes_count', 'desc');
            } else {
                return $this->sendError('Invalid sort parameter.');
            }
        }

        $videos = $videos->paginate(15);
        return $this->sendResponse([
            'videos' => VideoResource::collection($videos),
            'last_page' => $videos->lastPage(),
        ], 'Videos retrieved successfully.');
    }


    public function store(VideoRequest $request)
    {

        Log::info('--- Store Method Start ---');
        Log::info('Request Input (non-files):', $request->all()); // Keep this if you want
        Log::info('Request Files:', $request->files->all());
        try {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $videoPath = $request->file('video')->store('videos', 'public');
            $user = auth()->user();
            $video = Video::create([
                'title' => $request->title,
                'description' => $request->description,
                'thumbnail_url' => $thumbnailPath,
                'video_url' => $videoPath,
                'view_count' => 0,
                'user_id' => $user->id,
            ]);

            return $this->sendResponse(new VideoResource($video), 'Video created successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to create video.', $e->getMessage());
        }
    }

    public function show(Request $request, int $id)
    {
        $video = Video::find($id);
        $video->increment('view_count');
        return $this->sendResponse(new VideoDetailResource($video), 'Video retrieved successfully.');
    }

    public function update(VideoRequest $request, Video $video)
    {
        try {
            if ($request->hasFile('thumbnail')) {
                Storage::disk('public')->delete($video->thumbnail_url);
                $video->thumbnail_url = $request->file('thumbnail')->store('thumbnails', 'public');
            }

            if ($request->hasFile('video')) {
                Storage::disk('public')->delete($video->video_url);
                $video->video_url = $request->file('video')->store('videos', 'public');
            }

            $video->update($request->only([
                'title', 'description', 'view_count'
            ]));

            return $this->sendResponse(new VideoResource($video), 'Video updated successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to update video.', $e->getMessage());
        }
    }

    public function destroy(Video $video)
    {
        try {
            Storage::disk('public')->delete([$video->thumbnail_url, $video->video_url]);
            $video->delete();

            return $this->sendResponse([], 'Video deleted successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete video.', $e->getMessage());
        }
    }

    public function like(Request $request, int $id)
    {
        Log::info("--- Like Method Start ---");
        $video = Video::find($id);
        if (!$video) {
            return $this->sendError('Video not found.');
        }

        // Check if the user has already liked the video
        if ($video->likes()->where('user_id', auth()->id())->exists()) {
            // Delete the like
            $video->likes()->where('user_id', auth()->id())->delete();

            return $this->sendResponse([], 'Like removed successfully.');
        }

        // Create a new like
        $video->likes()->create([
            'user_id' => auth()->id(),
            'video_id' => $video->id,
        ]);

        return $this->sendResponse([], 'Video liked successfully.');
    }

    public function VideosByUser(Request $request, int $id)
    {
        $videos = Video::where('user_id', $id)->latest()->get();
        return $this->sendResponse(['data' => VideoResource::collection($videos)], 'Videos retrieved successfully.');
    }
}
