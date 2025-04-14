<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VideoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            //'thumbnail' => 'required|file',
            //'video' => 'required|file',
            //'thumbnail' => 'required|image|mimetypes:image/jpeg,image/png', // 2MB max
            //'video' => 'required|file|mimetypes:video/mp4,video/mpeg,video/quicktime', // 500MB max
        ];
    }
}
