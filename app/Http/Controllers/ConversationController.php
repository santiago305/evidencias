<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Services\Conversation\ConversationDelayDistributionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ConversationController extends Controller
{
    public function index(): JsonResponse
    {
        $conversations = Conversation::query()
            ->with('messages')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => $conversations,
        ]);
    }

    public function store(
        StoreConversationRequest $request,
        ConversationDelayDistributionService $delayDistributionService,
    ): JsonResponse {
        $validated = $request->validated();
        $delays = $delayDistributionService->distribute($validated['messages']);
        $conversationCode = $this->generateUniqueConversationCode();

        $conversation = DB::transaction(function () use ($validated, $delays, $conversationCode) {
            $conversation = Conversation::query()->create([
                'code' => $conversationCode,
                'is_active' => true,
            ]);

            $this->replaceMessages($conversation, $validated['messages'], $delays);

            return $conversation;
        });

        return response()->json([
            'message' => 'Conversacion registrada correctamente.',
            'data' => $conversation->load('messages'),
        ], 201);
    }

    public function update(
        StoreConversationRequest $request,
        Conversation $conversation,
        ConversationDelayDistributionService $delayDistributionService,
    ): JsonResponse {
        $validated = $request->validated();
        $delays = $delayDistributionService->distribute($validated['messages']);

        DB::transaction(function () use ($conversation, $validated, $delays) {
            $this->replaceMessages($conversation, $validated['messages'], $delays);
            $conversation->touch();
        });

        return response()->json([
            'message' => 'Conversacion actualizada correctamente.',
            'data' => $conversation->fresh()->load('messages'),
        ]);
    }

    /**
     * @param  list<array{side:string,reply_to_position?:int|null,lines:list<string>}>  $messages
     * @param  list<int>  $delays
     */
    private function replaceMessages(Conversation $conversation, array $messages, array $delays): void
    {
        ConversationMessage::query()
            ->where('conversation_id', $conversation->id)
            ->delete();

        foreach ($messages as $index => $message) {
            ConversationMessage::query()->create([
                'conversation_id' => $conversation->id,
                'position' => $index + 1,
                'side' => $message['side'],
                'delay_minutes' => $delays[$index] ?? 0,
                'reply_to_position' => $message['reply_to_position'] ?? null,
                'lines' => $message['lines'],
            ]);
        }
    }

    private function generateUniqueConversationCode(): string
    {
        do {
            $timestamp = now()->format('YmdHis');
            $suffix = Str::lower(Str::random(4));
            $code = "conv_{$timestamp}_{$suffix}";
        } while (Conversation::query()->where('code', $code)->exists());

        return $code;
    }
}
