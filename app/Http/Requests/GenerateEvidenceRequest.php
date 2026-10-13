<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            'conversationType' => ['sometimes', Rule::in(['whatsapp', 'sms'])],
            'seedCode' => ['nullable', 'string', 'max:100'],
            'conversationCode' => ['nullable', 'string', 'max:100'],
            'telefono' => ['required_without:seedCode', 'nullable', 'string', 'regex:/^9\d{8}$/'],
            'nombre' => ['nullable', 'string', 'max:150'],
            'sexo' => ['sometimes', 'nullable', 'string', Rule::in(['M', 'F'])],
            'fecha_nacimiento' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
            'dniCliente' => ['required_without:seedCode', 'nullable', 'string', 'regex:/^\d{8}$/'],
            'monto' => ['required_without:seedCode', 'nullable', 'string', 'max:40'],
            'tasa' => ['required_without:seedCode', 'nullable', 'string', 'max:40'],
            'cuota' => ['required_without:seedCode', 'nullable', 'string', 'max:40'],
            'plazo' => ['required_without:seedCode', 'nullable', 'string', 'max:40'],
            'TCEA' => ['nullable', 'string', 'max:40'],
            'fechaHora' => ['required_without:seedCode', 'nullable', 'date_format:Y-m-d\TH:i'],
            'fechaHoraRegistro' => ['required_without:seedCode', 'nullable', 'date_format:Y-m-d\TH:i', 'after_or_equal:fechaHora'],
            'duracion' => ['required_without:seedCode', 'nullable', 'integer', 'min:1'],
            'img_64' => ['nullable', 'file', 'mimes:png', 'max:15360'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $this->validateNumericFields($validator);

                $image = $this->file('img_64');

                if ($image === null || $this->filled('conversationCode') || $this->filled('seedCode')) {
                    return;
                }

                $fileDni = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);

                $clientDni = $this->string('dniCliente')->value();

                if (! ctype_digit($fileDni) || $this->withoutLeadingZeros($fileDni) !== $this->withoutLeadingZeros($clientDni)) {
                    $validator->errors()->add('img_64', 'El nombre del archivo PNG debe coincidir con el DNI del cliente.');
                }
            },
        ];
    }

    private function validateNumericFields(Validator $validator): void
    {
        $this->validateDecimalField($validator, 'monto', false, 99999);
        $this->validateDecimalField($validator, 'cuota', false, 99999);
        $this->validateDecimalField($validator, 'tasa', true);
        $this->validateDecimalField($validator, 'TCEA', true);

        $plazo = trim((string) $this->input('plazo', ''));

        if ($plazo !== '' && ! preg_match('/^\d+$/', $plazo)) {
            $validator->errors()->add('plazo', 'El plazo debe ser un número entero sin decimales.');
        }
    }

    private function validateDecimalField(Validator $validator, string $field, bool $allowPercentage, ?float $max = null): void
    {
        $value = trim((string) $this->input($field, ''));

        if ($value === '') {
            return;
        }

        $normalized = $this->normalizeDecimalValue($value, $allowPercentage);

        if ($normalized === null || ! preg_match('/^\d+(?:\.\d{1,2})?$/', $normalized)) {
            $label = match ($field) {
                'monto' => 'El monto',
                'cuota' => 'La cuota',
                'tasa' => 'La tasa',
                default => 'La TCEA',
            };
            $suffix = $allowPercentage ? ' porcentaje' : '';

            $validator->errors()->add($field, "{$label} debe ser un número{$suffix} con máximo 2 decimales.");

            return;
        }

        if ($max !== null && (float) $normalized > $max) {
            $label = $field === 'monto' ? 'El monto' : 'La cuota';

            $validator->errors()->add($field, "{$label} no puede superar 99999.00.");
        }
    }

    private function normalizeDecimalValue(string $value, bool $allowPercentage): ?string
    {
        $normalized = (string) preg_replace('/[\s\p{Z}]+/u', '', $value);

        if ($allowPercentage && str_ends_with($normalized, '%')) {
            $normalized = substr($normalized, 0, -1);
        }

        if (str_contains($normalized, '%')) {
            return null;
        }

        return str_replace(',', '.', $normalized);
    }

    private function withoutLeadingZeros(string $value): string
    {
        return ltrim($value, '0') ?: '0';
    }
}
