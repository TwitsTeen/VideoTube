<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Http\Request;
class CommentController extends BaseController
{
    public function show(int $videoId)
    {
        $comments = Comment::where('video_id', $videoId)->with('user')->get();

        return $this->sendResponse(CommentResource::collection($comments), 'Comments retrieved successfully.');
    }

    public function store(CommentRequest $request){
        $user = auth()->user();
        $comment = Comment::create([
            'user_id' => $user->id,
            'video_id' => $request->video_id,
            'content' => $request->input('content'), // If i use the magic method there's a conflict with the FormRequest
        ]);

        return $this->sendResponse(new CommentResource($comment), 'Comment created successfully.');
    }
}
