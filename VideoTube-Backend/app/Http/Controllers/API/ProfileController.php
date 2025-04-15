<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ProfileController extends BaseController
{


    public function update(ProfileRequest $request)
    {
        $user = auth()->user();
        $data = $request->only(['bio']);
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/profile_pictures'), $filename);
            $data['profile_picture'] = 'profile_pictures/' . $filename;
        }

        $user->update($data);
        return $this->sendResponse(new ProfileResource($user), 'Profile updated successfully.');
    }

    public function show(int $id)
    {
        $user = User::find($id);
        if (!$user) {
            return $this->sendError('User not found.');
        }

        return $this->sendResponse(new ProfileResource($user), 'Profile retrieved successfully.');
    }

    public function me(){
        $user = auth()->user();

        if (!$user) {
            return $this->sendError('User not found.');
        }
        return $this->sendResponse(new ProfileResource($user), 'Profile retrieved successfully.');
    }

}
