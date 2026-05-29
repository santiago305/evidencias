<?php

namespace App\Services\Evidence;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Str;

class EvidenceSeedService
{
    public function generateSeedCode(User $user, Conversation $conversation, int $cycle): string
    {
        $conversationSegment = sprintf('C%03d', $conversation->id);
        $userSegment = sprintf('U%02d', $user->id);
        $cycleSegment = sprintf('R%02d', $cycle);

        $payload = implode('|', ['v1', $conversation->id, $user->id, $cycle]);
        $signature = $this->signature($payload);

        return "EVC1-{$conversationSegment}-{$userSegment}-{$cycleSegment}-{$signature}";
    }

    /**
     * @return array{
     *   version:int,
     *   conversation_id:int,
     *   user_id:int,
     *   cycle:int
     * }|null
     */
    public function decodeSeedCode(string $seedCode): ?array
    {
        if (! preg_match('/^EVC1-C(\d{3})-U(\d{2})-R(\d{2})-([A-Z0-9]{5})$/', trim($seedCode), $matches)) {
            return null;
        }

        $conversationId = (int) $matches[1];
        $userId = (int) $matches[2];
        $cycle = (int) $matches[3];
        $signature = $matches[4];

        $payload = implode('|', ['v1', $conversationId, $userId, $cycle]);
        $expected = $this->signature($payload);

        if (! hash_equals($expected, $signature)) {
            return null;
        }

        return [
            'version' => 1,
            'conversation_id' => $conversationId,
            'user_id' => $userId,
            'cycle' => $cycle,
        ];
    }

    public function validateSeedCode(string $seedCode): bool
    {
        return $this->decodeSeedCode($seedCode) !== null;
    }

    private function signature(string $payload): string
    {
        $hash = hash_hmac('sha256', $payload, (string) config('app.key'));
        $base36 = strtoupper(base_convert(substr($hash, 0, 10), 16, 36));

        return Str::padRight(substr($base36, 0, 5), 5, 'X');
    }
}
