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

    protected function prepareForValidation(): void
    {
        if (! $this->has('status')) {
            $this->merge([
                'status' => 'development',
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $messagesRule = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'status' => ['required', Rule::in(['production', 'development', 'fixed'])],
            'messages' => [$messagesRule, 'array', 'min:1'],
            'messages.*.side' => ['required', Rule::in(['in', 'out'])],
            'messages.*.reply_to_position' => ['nullable', 'integer', 'min:1'],
            'messages.*.lines' => ['required', 'array', 'min:1'],
            'messages.*.lines.*' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $messages = $this->input('messages', []);

                if (! is_array($messages)) {
                    return;
                }

                foreach ($messages as $index => $message) {
                    if (! is_array($message) || ! array_key_exists('reply_to_position', $message) || $message['reply_to_position'] === null) {
                        continue;
                    }

                    $replyToPosition = (int) $message['reply_to_position'];
                    $currentPosition = $index + 1;

                    if ($replyToPosition >= $currentPosition) {
                        $validator->errors()->add(
                            "messages.{$index}.reply_to_position",
                            'El mensaje solo puede responder a un mensaje anterior.',
                        );
                    }
                }
            },
        ];
    }
}
