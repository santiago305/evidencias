<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GenerateEvidenceRequest extends FormRequest
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
            'seedCode' => ['nullable', 'string', 'max:100'],
            'conversationCode' => ['nullable', 'string', 'max:100'],
            'telefono' => ['required', 'string', 'regex:/^9\d{8}$/'],
            'nombre' => ['required', 'string', 'max:150'],
            'dniCliente' => ['required', 'string', 'regex:/^\d{8}$/'],
            'monto' => ['required', 'string', 'max:40'],
            'tasa' => ['required', 'string', 'max:40'],
            'cuota' => ['required', 'string', 'max:40'],
            'plazo' => ['required', 'string', 'max:40'],
            'fechaHora' => ['required', 'date_format:Y-m-d\TH:i'],
            'fechaHoraRegistro' => ['required', 'date_format:Y-m-d\TH:i', 'after_or_equal:fechaHora'],
            'duracion' => ['required', 'integer', 'min:1'],
            'img_64' => ['nullable', 'string', 'max:2000000'],
        ];
    }
}
