<?php

namespace App\Services\Conversation;

use App\Models\Conversation;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class ConversationRenderService
{
    private const ADVISOR_SIDE = 'out';

    private const ADVISOR_WORK_START_MINUTES = 420;

    private const ADVISOR_QUIET_START_MINUTES = 1380;

    /**
     * @var array<string, string>
     */
    private const FEMININE_ADVISOR_WORDS = [
        'asesor' => 'asesora',
        'senor' => 'senorita',
        'señor' => 'señorita',
        'sr' => 'srta',
        'estimado' => 'estimada',
        'querido' => 'querida',
        'bienvenido' => 'bienvenida',
        'interesado' => 'interesada',
        'aprobado' => 'aprobada',
        'registrado' => 'registrada',
        'afiliado' => 'afiliada',
        'el' => 'ella',
        'él' => 'ella',
        'lo' => 'la',
        'suyo' => 'suya',
        'mismo' => 'misma',
    ];

    public function __construct(
        private readonly ConversationDelayDistributionService $delayDistributionService,
    ) {}

    /**
     * @param  array<string, mixed>  $input
     * @return list<array{side:string,time:string,dateKey:string,lines:list<string>,quote?:array{side:string,text:string},id_?:string}>
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
            ? $this->subtractWorkingMinutes($lastMessageDate, $durationMinutes)
            : $minimumDate->copy()->addMinutes($registrationGap);

        if ($durationMinutes !== null && $registrationGap > 3 && $startDate->lessThan($minimumDate)) {
            $registrationGap = 3;
            $lastMessageDate = $registrationDate->copy()->subMinutes($registrationGap);
            $startDate = $this->subtractWorkingMinutes($lastMessageDate, $durationMinutes);
        }

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
                $delayMinutes = (int) ($delays[$index] ?? $message->delay_minutes);

                if ($durationMinutes !== null) {
                    $this->addWorkingMinutes($clock, $delayMinutes);
                } else {
                    $clock->addMinutes($delayMinutes);
                }
            }

            if ($durationMinutes === null) {
                $this->moveAdvisorReplyToWorkingHours($clock, (string) $message->side);
            }

            $lines = [];
            foreach ((array) $message->lines as $line) {
                $lines[] = $this->uppercaseFirstLetter($this->interpolate((string) $line, $variables));
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

        if ($rendered !== []) {
            $rendered[array_key_last($rendered)]['id_'] = 'ultimo_mensaje';
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

    private function subtractWorkingMinutes(Carbon $date, int $minutes): Carbon
    {
        $clock = $date->copy();
        $remainingMinutes = $minutes;

        while ($remainingMinutes > 0) {
            $this->moveBackwardIntoWorkingHours($clock);
            $availableToday = $this->minutesSinceMidnight($clock) - self::ADVISOR_WORK_START_MINUTES;

            if ($remainingMinutes <= $availableToday) {
                return $clock->subMinutes($remainingMinutes);
            }

            $remainingMinutes -= $availableToday;
            $clock->subDay()->setTime(23, 0);
        }

        return $clock;
    }

    private function addWorkingMinutes(Carbon $clock, int $minutes): void
    {
        $remainingMinutes = $minutes;

        while ($remainingMinutes > 0) {
            $this->moveForwardIntoWorkingHours($clock);
            $availableToday = self::ADVISOR_QUIET_START_MINUTES - $this->minutesSinceMidnight($clock);

            if ($remainingMinutes <= $availableToday) {
                $clock->addMinutes($remainingMinutes);

                return;
            }

            $remainingMinutes -= $availableToday;
            $clock->addDay()->setTime(7, 0);
        }
    }

    private function moveBackwardIntoWorkingHours(Carbon $clock): void
    {
        $minutes = $this->minutesSinceMidnight($clock);

        if ($minutes > self::ADVISOR_QUIET_START_MINUTES) {
            $clock->setTime(23, 0);

            return;
        }

        if ($minutes <= self::ADVISOR_WORK_START_MINUTES) {
            $clock->subDay()->setTime(23, 0);
        }
    }

    private function moveForwardIntoWorkingHours(Carbon $clock): void
    {
        $minutes = $this->minutesSinceMidnight($clock);

        if ($minutes >= self::ADVISOR_QUIET_START_MINUTES) {
            $clock->addDay()->setTime(7, 0);

            return;
        }

        if ($minutes < self::ADVISOR_WORK_START_MINUTES) {
            $clock->setTime(7, 0);
        }
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
        $saludo = $hour < 12 ? 'buenos dias' : ($hour < 19 ? 'buenas tardes' : 'buenas noches');
        $tramo = $hour < 12 ? 'manana' : ($hour < 19 ? 'tarde' : 'noche');

        $previewSeed = isset($input['previewSeed']) && is_string($input['previewSeed']) && trim($input['previewSeed']) !== ''
            ? trim($input['previewSeed'])
            : null;
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
            'monto' => $this->formatFlexibleAmount($monto, $previewSeed),
            'monto_formateado' => $this->formatMoney($monto),
            'cuota' => $cuota,
            'cuota_formateada' => $this->formatMoney($cuota),
            'plazo' => (string) ($input['plazo'] ?? ''),
            'tasa' => (string) ($input['tasa'] ?? ''),
            'saludo' => $saludo,
            'tramo' => $tramo,
            'sexualidad_asesor' => in_array($input['sexualidadAsesor'] ?? null, ['M', 'F'], true) ? (string) $input['sexualidadAsesor'] : 'M',
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
        $line = (string) preg_replace_callback('/\{s_asesor\(([^{}()]*)\)\}/u', function ($matches) use ($variables) {
            $word = trim((string) ($matches[1] ?? ''));

            if ($word === '') {
                return '';
            }

            return $this->genderAdvisorWord($word, $variables['sexualidad_asesor'] ?? 'M');
        }, $line);

        return (string) preg_replace_callback('/\{([a-zA-Z0-9_]+)\}/', function ($matches) use ($variables) {
            $key = $matches[1] ?? '';

            return $variables[$key] ?? $matches[0];
        }, $line);
    }

    private function genderAdvisorWord(string $word, string $sexualidad): string
    {
        if ($sexualidad !== 'F') {
            return $word;
        }

        $lowerWord = mb_strtolower($word, 'UTF-8');
        $feminineWord = self::FEMININE_ADVISOR_WORDS[$lowerWord] ?? null;

        if ($feminineWord === null && str_ends_with($lowerWord, 'o')) {
            $feminineWord = mb_substr($lowerWord, 0, -1, 'UTF-8').'a';
        }

        if ($feminineWord === null) {
            return $word;
        }

        return $this->matchWordCase($word, $feminineWord);
    }

    private function matchWordCase(string $source, string $value): string
    {
        if (mb_strtoupper($source, 'UTF-8') === $source) {
            return mb_strtoupper($value, 'UTF-8');
        }

        $firstLetter = mb_substr($source, 0, 1, 'UTF-8');
        if (mb_strtoupper($firstLetter, 'UTF-8') === $firstLetter) {
            return $this->uppercaseFirstLetter($value);
        }

        return $value;
    }

    private function uppercaseFirstLetter(string $value): string
    {
        return (string) preg_replace_callback('/\p{L}/u', function ($matches) {
            return mb_strtoupper((string) $matches[0], 'UTF-8');
        }, $value, 1);
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

    private function formatFlexibleAmount(string $value, ?string $previewSeed): string
    {
        $digits = preg_replace('/\D/', '', $value);
        if ($digits === null || $digits === '') {
            return $value;
        }

        if (strlen($digits) < 4) {
            return $digits;
        }

        $variant = $previewSeed !== null
            ? $this->seededInt("{$previewSeed}|monto-format|{$digits}", 0, 2)
            : random_int(0, 2);

        if ($variant === 0) {
            return $digits;
        }

        $separator = $variant === 1 ? ',' : ' ';

        return (string) preg_replace('/\B(?=(\d{3})+(?!\d))/', $separator, $digits);
    }

    private function seededInt(string $seed, int $min, int $max): int
    {
        $range = $max - $min + 1;
        $value = hexdec(substr(hash('sha256', $seed), 0, 8));

        return $min + ((int) $value % $range);
    }
}
