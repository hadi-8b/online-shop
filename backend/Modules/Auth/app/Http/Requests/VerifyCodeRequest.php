<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyCodeRequest extends FormRequest
{
    public function rules()
    {
        return [
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6']
        ];
    }
}