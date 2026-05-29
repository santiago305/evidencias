<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConversationRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:60', Rule::unique('conversations', 'code')],
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.side' => ['required', Rule::in(['in', 'out'])],
            'messages.*.delay_minutes' => ['required', 'integer', 'min:0', 'max:240'],
            'messages.*.lines' => ['required', 'array', 'min:1'],
            'messages.*.lines.*' => ['required', 'string', 'max:1000'],
        ];
    }
}
