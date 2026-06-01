<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:60', Rule::unique('conversations', 'code')],
            'total_minutes' => ['required', 'integer', 'min:0', 'max:10080'],
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.side' => ['required', Rule::in(['in', 'out'])],
            'messages.*.lines' => ['required', 'array', 'min:1'],
            'messages.*.lines.*' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $messages = $this->input('messages');

                if (! is_array($messages) || count($messages) <= 1) {
                    return;
                }

                $totalMinutes = (int) $this->input('total_minutes', 0);
                $minimumRequired = (count($messages) - 1) * 6;

                if ($totalMinutes < $minimumRequired) {
                    $validator->errors()->add(
                        'total_minutes',
                        "La duracion total debe ser de al menos {$minimumRequired} minutos para ".count($messages).' mensajes.'
                    );
                }
            },
        ];
    }
}
