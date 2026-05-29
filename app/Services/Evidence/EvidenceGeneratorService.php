<?php

namespace App\Services\Evidence;

use App\Models\Conversation;
use App\Models\GeneratedEvidence;
use App\Models\User;
use App\Models\UserConversationProgress;
use App\Services\Conversation\ConversationBagService;
use App\Services\Conversation\ConversationRenderService;
use Illuminate\Validation\ValidationException;

class EvidenceGeneratorService
{
    public function __construct(
        private readonly ConversationBagService $bagService,
        private readonly EvidenceSeedService $seedService,
        private readonly ConversationRenderService $renderService,
    ) {
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array{
     *   conversationId:string,
     *   seedCode:string,
     *   messages:list<array{side:string,time:string,lines:list<string>}>,
     *   progress:array{cycle:int,used:int,pending:int,total:int}
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
            $seedCode = $this->seedService->generateSeedCode($user, $conversation, $cycle);
        }

        $messages = $this->renderService->render($conversation, $input);
        $this->storeEvidence($user, $conversation, $seedCode, $input);

        $progress = UserConversationProgress::query()->where('user_id', $user->id)->first();
        $pending = is_array($progress?->pending_ids) ? count($progress->pending_ids) : Conversation::query()->where('is_active', true)->count();
        $used = is_array($progress?->used_ids) ? count($progress->used_ids) : 0;
        $progressCycle = (int) ($progress?->cycle ?? 1);

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
        ];
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function storeEvidence(User $user, Conversation $conversation, string $seedCode, array $input): void
    {
        GeneratedEvidence::query()->create([
            'user_id' => $user->id,
            'conversation_id' => $conversation->id,
            'seed_code' => $seedCode,
            'input_data' => $input,
            'generated_at' => now(),
        ]);
    }
}
