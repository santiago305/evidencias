<?php

namespace App\Services\Conversation;

use App\Models\Conversation;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class ConversationRenderService
{
    private const ADVISOR_SIDE = 'out';

    private const ADVISOR_WORK_START_MINUTES = 420;

    private const ADVISOR_QUIET_START_MINUTES = 1410;

    public function __construct(
        private readonly ConversationDelayDistributionService $delayDistributionService,
    ) {}

    /**
     * @param  array<string, mixed>  $input
     * @return list<array{side:string,time:string,dateKey:string,lines:list<string>,quote?:array{side:string,text:string}}>
     */
    public function render(Conversation $conversation, array $input): array
    {
        $minimumDate = isset($input['fechaHora']) && is_string($input['fechaHora']) && $input['fechaHora'] !== ''
            ? Carbon::parse($input['fechaHora'])
            : now();
        $registrationDate = isset($input['fechaHoraRegistro']) && is_string($input['fechaHoraRegistro']) && $input['fechaHoraRegistro'] !== ''
            ? Carbon::parse($input['fechaHoraRegistro'])
            : $minimumDate->copy();

        $previewSeed = isset($input['previewSeed']) && is_string($input['previewSeed']) && trim($input['previewSeed']) !== ''
            ? trim($input['previewSeed'])
            : null;

        $registrationGap = $previewSeed !== null
            ? $this->seededInt($previewSeed.'|start', 3, 10)
            : random_int(3, 10);

        $conversationMessages = $conversation->messages->values();
        $durationMinutes = $this->parseDurationMinutes($input);
        $lastMessageDate = $registrationDate->copy()->subMinutes($registrationGap);
        $startDate = $durationMinutes !== null
            ? $lastMessageDate->copy()->subMinutes($durationMinutes)
            : $minimumDate->copy()->addMinutes($registrationGap);

        if ($startDate->lessThan($minimumDate)) {
            throw ValidationException::withMessages([
                'duracion' => 'La duración hace que la conversación empiece antes de la fecha y hora indicada.',
            ]);
        }

        $clock = $startDate->copy();
        $variables = $this->buildVariables($input, $startDate);
        $rendered = [];
        $delays = $this->delayDistributionService->distribute(
            $conversationMessages
                ->map(fn ($message) => [
                    'side' => (string) $message->side,
                    'lines' => array_values((array) $message->lines),
                ])
                ->all(),
            $durationMinutes,
            $previewSeed !== null ? "{$previewSeed}|delays" : null,
        );

        foreach ($conversationMessages as $index => $message) {
            if ($index > 0) {
                $clock->addMinutes((int) ($delays[$index] ?? $message->delay_minutes));
            }

            $this->moveAdvisorReplyToWorkingHours($clock, (string) $message->side);

            $lines = [];
            foreach ((array) $message->lines as $line) {
                $lines[] = $this->interpolate((string) $line, $variables);
            }

            $renderedMessage = [
                'side' => $message->side,
                'time' => $clock->format('H:i'),
                'dateKey' => $clock->format('Y-m-d'),
                'lines' => $lines,
            ];

            $replyToPosition = $message->reply_to_position;
            if (is_int($replyToPosition) && $replyToPosition > 0 && isset($rendered[$replyToPosition - 1])) {
                $quotedMessage = $rendered[$replyToPosition - 1];
                $renderedMessage['quote'] = [
                    'side' => (string) $quotedMessage['side'],
                    'text' => implode("\n", $quotedMessage['lines']),
                ];
            }

            $rendered[] = $renderedMessage;
        }

        return $rendered;
    }

    private function moveAdvisorReplyToWorkingHours(Carbon $clock, string $side): void
    {
        if ($side !== self::ADVISOR_SIDE || ! $this->isAdvisorQuietHour($clock)) {
            return;
        }

        if ($this->minutesSinceMidnight($clock) >= self::ADVISOR_QUIET_START_MINUTES) {
            $clock->addDay();
        }

        $clock->setTime(7, 0);
    }

    private function isAdvisorQuietHour(Carbon $clock): bool
    {
        $minutes = $this->minutesSinceMidnight($clock);

        return $minutes >= self::ADVISOR_QUIET_START_MINUTES
            || $minutes < self::ADVISOR_WORK_START_MINUTES;
    }

    private function minutesSinceMidnight(Carbon $clock): int
    {
        return ((int) $clock->format('H') * 60) + (int) $clock->format('i');
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
        $asesorFormatted = $this->toTitleCase($asesor);
        $clienteFormatted = $this->toTitleCase($cliente);

        return [
            'nombre_cliente' => $clienteFormatted !== '' ? $clienteFormatted : 'Cliente',
            'primer_nombre_cliente' => $this->getFirstName($clienteFormatted, 'Cliente'),
            'nombre_asesor' => $asesorFormatted !== '' ? $asesorFormatted : 'Asesor',
            'primer_nombre_asesor' => $this->getFirstName($asesorFormatted, 'Asesor'),
            'dni' => (string) ($input['dni'] ?? ''),
            'dni_cliente' => (string) ($input['dniCliente'] ?? ''),
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

    private function toTitleCase(string $value): string
    {
        $trimmedValue = trim($value);

        if ($trimmedValue === '') {
            return '';
        }

        return mb_convert_case($trimmedValue, MB_CASE_TITLE, 'UTF-8');
    }

    private function getFirstName(string $value, string $fallback): string
    {
        $trimmedValue = trim($value);

        if ($trimmedValue === '') {
            return $fallback;
        }

        $parts = preg_split('/\s+/', $trimmedValue);

        return is_array($parts) && isset($parts[0]) && $parts[0] !== '' ? $parts[0] : $fallback;
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

    private function seededInt(string $seed, int $min, int $max): int
    {
        $range = $max - $min + 1;
        $value = hexdec(substr(hash('sha256', $seed), 0, 8));

        return $min + ((int) $value % $range);
    }
}
