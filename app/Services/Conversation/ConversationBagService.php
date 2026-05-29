<?php

namespace App\Services\Conversation;

use App\Models\Conversation;
use App\Models\User;
use App\Models\UserConversationProgress;
use Illuminate\Support\Collection;

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
            ->pluck('id')
            ->all();

        if ($allIds === []) {
            abort(422, 'No hay conversaciones activas registradas.');
        }

        $progress = UserConversationProgress::query()->firstOrNew([
            'user_id' => $user->id,
        ]);

        if (! $progress->exists) {
            $progress->cycle = 1;
            $progress->pending_ids = $this->shuffleIds($allIds);
            $progress->used_ids = [];
        }

        $pending = $progress->pending_ids ?? [];
        $used = $progress->used_ids ?? [];

        if ($pending === []) {
            $progress->cycle = (int) $progress->cycle + 1;
            $pending = $this->shuffleIds($allIds);
            $used = [];
        }

        $conversationId = array_shift($pending);
        $used[] = $conversationId;

        $progress->pending_ids = array_values($pending);
        $progress->used_ids = array_values($used);
        $progress->last_conversation_id = $conversationId;
        $progress->save();

        /** @var Conversation $conversation */
        $conversation = Conversation::query()
            ->with('messages')
            ->findOrFail($conversationId);

        return [
            'conversation' => $conversation,
            'progress' => $progress->fresh(),
        ];
    }

    /**
     * @param  list<int>  $ids
     * @return list<int>
     */
    private function shuffleIds(array $ids): array
    {
        $shuffled = Collection::make($ids)->shuffle()->values()->all();

        /** @var list<int> $shuffled */
        return $shuffled;
    }
}
