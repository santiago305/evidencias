<?php

namespace App\Services\Conversation;

use App\Models\Conversation;
use App\Models\User;
use App\Models\UserConversationProgress;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ConversationBagService
{
    /**
     * @return array{
     *   conversation: Conversation,
     *   progress: UserConversationProgress
     * }
     */
    public function takeNextForUser(User $user): array
    {
        $allIds = Conversation::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->pluck('id')
            ->all();

        if ($allIds === []) {
            abort(422, 'No hay conversaciones activas registradas.');
        }

        $conversationId = null;
        $progress = DB::transaction(function () use ($user, $allIds, &$conversationId): UserConversationProgress {
            $progress = UserConversationProgress::query()
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (! $progress) {
                $progress = new UserConversationProgress([
                    'user_id' => $user->id,
                    'cycle' => 1,
                ]);
            }

            $startConversationId = $this->resolveStartConversationId($progress, $allIds, $user);
            $pending = $this->normalizePendingIds($progress, $allIds, $startConversationId);
            $used = array_values(array_map('intval', (array) ($progress->used_ids ?? [])));

            if ($pending === []) {
                $progress->cycle = (int) $progress->cycle + 1;
                $pending = $this->buildCycleQueue($allIds, $startConversationId);
                $used = [];
            }

            $conversationId = (int) array_shift($pending);
            $used[] = $conversationId;

            $progress->start_conversation_id = $startConversationId;
            $progress->pending_ids = array_values($pending);
            $progress->used_ids = array_values($used);
            $progress->last_conversation_id = $conversationId;
            $progress->save();

            return $progress;
        }, attempts: 5);

        /** @var Conversation $conversation */
        $conversation = Conversation::query()
            ->with('messages')
            ->findOrFail((int) $conversationId);

        return [
            'conversation' => $conversation,
            'progress' => $progress->fresh(),
        ];
    }

    /**
     * @param  list<int>  $allIds
     * @return list<int>
     */
    private function normalizePendingIds(UserConversationProgress $progress, array $allIds, int $startConversationId): array
    {
        $pending = Collection::make((array) ($progress->pending_ids ?? []))
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
        $used = Collection::make((array) ($progress->used_ids ?? []))
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();

        $validIds = array_fill_keys($allIds, true);
        $pending = array_values(array_filter($pending, fn ($id) => isset($validIds[$id])));
        $used = array_values(array_filter($used, fn ($id) => isset($validIds[$id])));

        $consumed = array_fill_keys(array_merge($pending, $used), true);
        $missing = array_values(array_filter($allIds, fn ($id) => ! isset($consumed[$id])));
        if ($missing !== []) {
            $pending = array_values([
                ...$pending,
                ...Collection::make($missing)->shuffle()->values()->all(),
            ]);
        }

        $progress->used_ids = array_values($used);

        if ($progress->last_conversation_id === null && $pending !== []) {
            $pending = $this->reorderWithStartFirst($pending, $startConversationId);
        }

        /** @var list<int> $pending */
        return $pending;
    }

    /**
     * @param  list<int>  $allIds
     * @return list<int>
     */
    private function buildCycleQueue(array $allIds, int $startConversationId): array
    {
        $otherIds = array_values(array_filter($allIds, fn ($id) => $id !== $startConversationId));
        $shuffledOthers = Collection::make($otherIds)->shuffle()->values()->all();

        return [
            $startConversationId,
            ...$shuffledOthers,
        ];
    }

    /**
     * @param  list<int>  $pendingIds
     * @return list<int>
     */
    private function reorderWithStartFirst(array $pendingIds, int $startConversationId): array
    {
        if (! in_array($startConversationId, $pendingIds, true)) {
            return $pendingIds;
        }

        $otherIds = array_values(array_filter($pendingIds, fn ($id) => $id !== $startConversationId));

        return [
            $startConversationId,
            ...$otherIds,
        ];
    }

    /**
     * @param  list<int>  $allIds
     */
    private function resolveStartConversationId(UserConversationProgress $progress, array $allIds, User $user): int
    {
        $currentStart = (int) ($progress->start_conversation_id ?? 0);
        if ($currentStart !== 0 && in_array($currentStart, $allIds, true)) {
            return $currentStart;
        }

        $legacyStart = (int) (Collection::make((array) ($progress->used_ids ?? []))->first() ?? 0);
        if ($legacyStart !== 0 && in_array($legacyStart, $allIds, true)) {
            return $legacyStart;
        }

        $takenStartIds = UserConversationProgress::query()
            ->whereNotNull('start_conversation_id')
            ->where('user_id', '!=', $user->id)
            ->lockForUpdate()
            ->pluck('start_conversation_id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $availableStartIds = array_values(array_diff($allIds, $takenStartIds));
        if ($availableStartIds !== []) {
            return (int) Collection::make($availableStartIds)->shuffle()->first();
        }

        $fallbackIndex = ((int) $user->id - 1) % count($allIds);

        return (int) $allIds[$fallbackIndex];
    }
}
