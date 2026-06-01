<?php

namespace App\Services\Evidence;

use App\Models\Conversation;
use App\Models\GeneratedEvidence;
use App\Models\User;
use App\Models\UserConversationProgress;
use App\Services\Conversation\ConversationBagService;
use App\Services\Conversation\ConversationRenderService;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class EvidenceGeneratorService
{
    /**
     * @var list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>
     */
    private const NETWORK_ICON_OPTIONS = [
        ['key' => 'wifi', 'glyph' => "\u{E701}", 'title' => 'WiFi', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'internet', 'glyph' => "\u{E774}", 'title' => 'Internet', 'className' => null, 'iconClassName' => 'text-[14px]'],
    ];

    /**
     * @var list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>
     */
    private const AUDIO_ICON_OPTIONS = [
        ['key' => 'volume', 'glyph' => "\u{E995}", 'title' => 'Volumen', 'className' => 'min-w-5.5', 'iconClassName' => 'text-[13px]'],
        ['key' => 'muted', 'glyph' => "\u{E74F}", 'title' => 'Silenciado', 'className' => null, 'iconClassName' => 'text-[14px]'],
    ];

    /**
     * @var list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>
     */
    private const OPTIONAL_ICON_OPTIONS = [
        ['key' => 'vpn', 'glyph' => "\u{E705}", 'title' => 'VPN', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'bluetooth', 'glyph' => "\u{E702}", 'title' => 'Bluetooth', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'usb', 'glyph' => "\u{E88E}", 'title' => 'USB', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'printer', 'glyph' => "\u{E749}", 'title' => 'Impresora', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'microphone', 'glyph' => "\u{E720}", 'title' => 'Micrófono', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'cloud', 'glyph' => "\u{E753}", 'title' => 'Cloud / OneDrive', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'defender', 'glyph' => "\u{E83D}", 'title' => 'Windows Defender', 'className' => null, 'iconClassName' => 'text-[14px]'],
        ['key' => 'notifications', 'glyph' => "\u{EB50}", 'title' => 'Notificaciones', 'className' => null, 'iconClassName' => 'text-[14px]'],
    ];

    /**
     * @var list<array{top:string,bottom:string|null}>
     */
    private const LANGUAGE_OPTIONS = [
        ['top' => 'ESP', 'bottom' => 'LAA'],
        ['top' => 'ESP', 'bottom' => null],
    ];

    public function __construct(
        private readonly ConversationBagService $bagService,
        private readonly EvidenceSeedService $seedService,
        private readonly ConversationRenderService $renderService,
    ) {}

    /**
     * @param  array<string, mixed>  $input
     * @return array{
     *   conversationId:string,
     *   seedCode:string,
     *   messages:list<array{side:string,time:string,lines:list<string>}>,
     *   progress:array{cycle:int,used:int,pending:int,total:int},
     *   trayProfile:array{
     *     taskbarColor:string,
     *     icons:list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>,
     *     language:array{top:string,bottom:string|null},
     *     languagePosition:'next-to-hidden'|'next-to-clock'
     *   }
     * }
     */
    public function generate(User $user, array $input): array
    {
        $seedCode = isset($input['seedCode']) ? trim((string) $input['seedCode']) : '';

        $conversation = null;
        $cycle = 1;

        if ($seedCode !== '') {
            $decoded = $this->seedService->decodeSeedCode($seedCode);

            if ($decoded === null || $decoded['user_id'] !== $user->id) {
                throw ValidationException::withMessages([
                    'seedCode' => 'La sal ingresada es invalida o no corresponde al usuario actual.',
                ]);
            }

            $conversation = Conversation::query()
                ->with('messages')
                ->where('is_active', true)
                ->find($decoded['conversation_id']);

            if (! $conversation) {
                throw ValidationException::withMessages([
                    'seedCode' => 'La conversación asociada a la sal no está disponible.',
                ]);
            }

            $cycle = (int) $decoded['cycle'];
        } else {
            $selected = $this->bagService->takeNextForUser($user);
            $conversation = $selected['conversation'];
            $cycle = (int) $selected['progress']->cycle;
        }

        $messages = $this->renderService->render($conversation, $input);
        $seedCode = $this->storeEvidenceWithUniqueSeed($user, $conversation, $cycle, $input);

        $progress = UserConversationProgress::query()->where('user_id', $user->id)->first();
        $pending = is_array($progress?->pending_ids) ? count($progress->pending_ids) : Conversation::query()->where('is_active', true)->count();
        $used = is_array($progress?->used_ids) ? count($progress->used_ids) : 0;
        $progressCycle = (int) ($progress?->cycle ?? 1);
        $trayProfile = $this->resolveWindowsTrayProfile($user);

        return [
            'conversationId' => $conversation->code,
            'seedCode' => $seedCode,
            'messages' => $messages,
            'progress' => [
                'cycle' => $progressCycle,
                'used' => $used,
                'pending' => $pending,
                'total' => Conversation::query()->where('is_active', true)->count(),
            ],
            'trayProfile' => $trayProfile,
        ];
    }

    /**
     * @return array{
     *   taskbarColor:string,
     *   icons:list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>,
     *   language:array{top:string,bottom:string|null},
     *   languagePosition:'next-to-hidden'|'next-to-clock'
     * }
     */
    private function resolveWindowsTrayProfile(User $user): array
    {
        $storedColor = $user->windows_tray_color;
        $storedConfig = $user->windows_tray_config;

        if ($this->isValidTrayColor($storedColor) && is_array($storedConfig) && $this->isValidTrayConfig($storedConfig)) {
            /** @var array{
             *   icons:list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>,
             *   language:array{top:string,bottom:string|null},
             *   languagePosition:'next-to-hidden'|'next-to-clock'
             * } $storedConfig
             */
            return [
                'taskbarColor' => $storedColor,
                'icons' => $storedConfig['icons'],
                'language' => $storedConfig['language'],
                'languagePosition' => $storedConfig['languagePosition'],
            ];
        }

        $profile = $this->buildWindowsTrayProfile();
        $user->windows_tray_color = $profile['taskbarColor'];
        $user->windows_tray_config = [
            'icons' => $profile['icons'],
            'language' => $profile['language'],
            'languagePosition' => $profile['languagePosition'],
        ];
        $user->save();

        return $profile;
    }

    private function isValidTrayColor(mixed $value): bool
    {
        return is_string($value) && preg_match('/^#[0-9A-Fa-f]{6}$/', $value) === 1;
    }

    private function isValidTrayConfig(array $config): bool
    {
        if (! isset($config['icons']) || ! is_array($config['icons'])) {
            return false;
        }

        if (! isset($config['language']) || ! is_array($config['language'])) {
            return false;
        }

        if (! isset($config['languagePosition']) || ! in_array($config['languagePosition'], ['next-to-hidden', 'next-to-clock'], true)) {
            return false;
        }

        $icons = $config['icons'];
        if (count($icons) < 2 || count($icons) > 6) {
            return false;
        }

        $networkKeys = ['wifi', 'internet'];
        $audioKeys = ['volume', 'muted'];
        $networkCount = 0;
        $audioCount = 0;

        foreach ($icons as $icon) {
            if (! is_array($icon) || ! isset($icon['key'], $icon['glyph'], $icon['title'])) {
                return false;
            }

            if (in_array((string) $icon['key'], $networkKeys, true)) {
                $networkCount += 1;
            }

            if (in_array((string) $icon['key'], $audioKeys, true)) {
                $audioCount += 1;
            }
        }

        if ($networkCount !== 1 || $audioCount !== 1) {
            return false;
        }

        $language = $config['language'];

        return isset($language['top']) && is_string($language['top']) && array_key_exists('bottom', $language);
    }

    /**
     * @return array{
     *   taskbarColor:string,
     *   icons:list<array{key:string,glyph:string,title:string,className:string|null,iconClassName:string|null}>,
     *   language:array{top:string,bottom:string|null},
     *   languagePosition:'next-to-hidden'|'next-to-clock'
     * }
     */
    private function buildWindowsTrayProfile(): array
    {
        $baseHue = random_int(0, 359);
        $saturation = random_int(32, 57);
        $lightness = random_int(16, 28);
        $taskbarColor = $this->hslToHex($baseHue, $saturation, $lightness);

        $networkIcon = self::NETWORK_ICON_OPTIONS[array_rand(self::NETWORK_ICON_OPTIONS)];
        $audioIcon = self::AUDIO_ICON_OPTIONS[array_rand(self::AUDIO_ICON_OPTIONS)];

        $optionalIcons = self::OPTIONAL_ICON_OPTIONS;
        shuffle($optionalIcons);
        $optionalIconCount = random_int(0, 4);
        $optionalSelection = array_slice($optionalIcons, 0, $optionalIconCount);

        $icons = array_values([
            $networkIcon,
            $audioIcon,
            ...$optionalSelection,
        ]);
        shuffle($icons);

        $language = self::LANGUAGE_OPTIONS[array_rand(self::LANGUAGE_OPTIONS)];
        $languagePosition = random_int(0, 1) === 0 ? 'next-to-hidden' : 'next-to-clock';

        return [
            'taskbarColor' => $taskbarColor,
            'icons' => $icons,
            'language' => $language,
            'languagePosition' => $languagePosition,
        ];
    }

    private function hslToHex(int $hue, int $saturation, int $lightness): string
    {
        $h = $hue / 360;
        $s = $saturation / 100;
        $l = $lightness / 100;

        if ($s === 0.0) {
            $gray = str_pad(dechex((int) round($l * 255)), 2, '0', STR_PAD_LEFT);

            return "#{$gray}{$gray}{$gray}";
        }

        $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
        $p = 2 * $l - $q;

        $toChannel = function (float $t) use ($p, $q): string {
            $value = $t;

            if ($value < 0) {
                $value += 1;
            }
            if ($value > 1) {
                $value -= 1;
            }

            $channel = $p;
            if ($value < 1 / 6) {
                $channel = $p + ($q - $p) * 6 * $value;
            } elseif ($value < 1 / 2) {
                $channel = $q;
            } elseif ($value < 2 / 3) {
                $channel = $p + ($q - $p) * (2 / 3 - $value) * 6;
            }

            return str_pad(dechex((int) round($channel * 255)), 2, '0', STR_PAD_LEFT);
        };

        $red = $toChannel($h + (1 / 3));
        $green = $toChannel($h);
        $blue = $toChannel($h - (1 / 3));

        return "#{$red}{$green}{$blue}";
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function storeEvidenceWithUniqueSeed(User $user, Conversation $conversation, int $cycle, array $input): string
    {
        $maxAttempts = 10;

        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $seedCode = $this->seedService->generateSeedCode($user, $conversation, $cycle);

            try {
                GeneratedEvidence::query()->create([
                    'user_id' => $user->id,
                    'conversation_id' => $conversation->id,
                    'seed_code' => $seedCode,
                    'input_data' => $input,
                    'generated_at' => now(),
                ]);

                return $seedCode;
            } catch (QueryException $exception) {
                if (! $this->isSeedCodeUniqueConstraintViolation($exception)) {
                    throw $exception;
                }
            }
        }

        throw ValidationException::withMessages([
            'seedCode' => 'No se pudo generar una sal única. Intenta nuevamente.',
        ]);
    }

    private function isSeedCodeUniqueConstraintViolation(QueryException $exception): bool
    {
        $message = strtolower($exception->getMessage());

        return str_contains($message, 'generated_evidences.seed_code')
            && (str_contains($message, 'unique') || str_contains($message, 'duplicate'));
    }
}
