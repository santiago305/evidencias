<?php

namespace App\Services\Conversation;

use App\Models\Conversation;
use Carbon\Carbon;

class ConversationRenderService
{
    public function __construct(
        private readonly ConversationDelayDistributionService $delayDistributionService,
    ) {}

    /**
     * @param  array<string, mixed>  $input
     * @return list<array{side:string,time:string,lines:list<string>}>
     */
    public function render(Conversation $conversation, array $input): array
    {
        $baseDate = isset($input['fechaHora']) && is_string($input['fechaHora']) && $input['fechaHora'] !== ''
            ? Carbon::parse($input['fechaHora'])
            : now();

        $clock = $baseDate->copy();
        $variables = $this->buildVariables($input, $baseDate);
        $rendered = [];
        $conversationMessages = $conversation->messages->values();
        $durationMinutes = $this->parseDurationMinutes($input);
        $delays = $this->delayDistributionService->distribute(
            $conversationMessages
                ->map(fn ($message) => [
                    'side' => (string) $message->side,
                    'lines' => array_values((array) $message->lines),
                ])
                ->all(),
            $durationMinutes,
        );

        foreach ($conversationMessages as $index => $message) {
            if ($index > 0) {
                $clock->addMinutes((int) ($delays[$index] ?? $message->delay_minutes));
            }

            $lines = [];
            foreach ((array) $message->lines as $line) {
                $lines[] = $this->interpolate((string) $line, $variables);
            }

            $rendered[] = [
                'side' => $message->side,
                'time' => $clock->format('H:i'),
                'lines' => $lines,
            ];
        }

        return $rendered;
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function parseDurationMinutes(array $input): ?int
    {
        $rawDuration = isset($input['duracion']) ? trim((string) $input['duracion']) : '';
        if ($rawDuration === '') {
            return null;
        }

        $parsed = (int) $rawDuration;

        return $parsed > 0 ? $parsed : null;
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array<string, string>
     */
    private function buildVariables(array $input, Carbon $baseDate): array
    {
        $hour = (int) $baseDate->format('H');
        $saludo = $hour < 12 ? 'Buenos dias' : ($hour < 19 ? 'Buenas tardes' : 'Buenas noches');
        $tramo = $hour < 12 ? 'manana' : ($hour < 19 ? 'tarde' : 'noche');

        $monto = (string) ($input['monto'] ?? '');
        $cuota = (string) ($input['cuota'] ?? '');
        $asesor = trim((string) ($input['nombreAsesor'] ?? ''));
        $cliente = trim((string) ($input['nombre'] ?? ''));

        return [
            'cliente' => $cliente !== '' ? $cliente : 'Cliente',
            'asesor' => $asesor !== '' ? $asesor : 'Asesor',
            'asesor_nombre' => $asesor !== '' ? $asesor : 'Asesor',
            'dni' => (string) ($input['dni'] ?? ''),
            'telefono' => (string) ($input['telefono'] ?? ''),
            'monto' => $monto,
            'monto_formateado' => $this->formatMoney($monto),
            'cuota' => $cuota,
            'cuota_formateada' => $this->formatMoney($cuota),
            'plazo' => (string) ($input['plazo'] ?? ''),
            'tasa' => (string) ($input['tasa'] ?? ''),
            'saludo' => $saludo,
            'tramo' => $tramo,
            'duracion' => (string) ($input['duracion'] ?? ''),
            'fecha' => $baseDate->format('Y-m-d'),
            'hora' => $baseDate->format('H:i'),
        ];
    }

    /**
     * @param  array<string, string>  $variables
     */
    private function interpolate(string $line, array $variables): string
    {
        return (string) preg_replace_callback('/\{([a-zA-Z0-9_]+)\}/', function ($matches) use ($variables) {
            $key = $matches[1] ?? '';

            return $variables[$key] ?? $matches[0];
        }, $line);
    }

    private function formatMoney(string $value): string
    {
        $normalized = preg_replace('/[^0-9.]/', '', $value);
        if ($normalized === null || $normalized === '') {
            return '';
        }

        $number = (float) $normalized;

        return number_format($number, 2, '.', ',');
    }
}
