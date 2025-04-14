<?php

namespace App\Http\Requests;


use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;



class BaseRequest extends FormRequest{

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $responseData = [
            'success' => false,
            'errors' => 'Invalid data send',
            'message' => $errors->messages(),
        ];

        $response = response()->json($responseData, 400);

        throw new HttpResponseException($response);
    }

}
