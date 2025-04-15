<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(AuthController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::middleware('auth:sanctum')->get('me', 'me');
});

Route::apiResource('videos', VideoController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('like/{video}', [VideoController::class, 'like'])->name('videos.like');
    Route::post('videos', [VideoController::class, 'store'])->name('videos.store');
    Route::delete('videos/{video}', [VideoController::class, 'destroy'])->name('videos.destroy');
    Route::post('profile/edit', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('profile/me', [ProfileController::class, 'me'])->name('profile.me');
});



Route::apiResource('profiles', ProfileController::class)->only(['show']);
