<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Services\Conversation\ConversationDelayDistributionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $type = $request->validate([
            'type' => ['sometimes', Rule::in(['whatsapp', 'sms'])],
        ])['type'] ?? 'whatsapp';

        $conversations = Conversation::query()
            ->with('messages')
            ->where('type', $type)
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
            if ($validated['status'] === 'fixed') {
                $this->clearFixedConversations($validated['type']);
            }

            $conversation = Conversation::query()->create([
                'code' => $conversationCode,
                'type' => $validated['type'],
                'is_active' => true,
                'status' => $validated['status'],
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
        $messages = $validated['messages'] ?? null;
        $delays = is_array($messages) ? $delayDistributionService->distribute($messages) : [];

        DB::transaction(function () use ($conversation, $validated, $messages, $delays) {
            if ($validated['status'] === 'fixed') {
                $this->clearFixedConversations($conversation->type, $conversation);
            }

            $conversation->status = $validated['status'];

            if (is_array($messages)) {
                $this->replaceMessages($conversation, $messages, $delays);
            }

            $conversation->save();
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

    private function clearFixedConversations(string $type, ?Conversation $exceptConversation = null): void
    {
        Conversation::query()
            ->where('type', $type)
            ->where('status', 'fixed')
            ->when(
                $exceptConversation !== null,
                fn ($query) => $query->whereKeyNot($exceptConversation->id),
            )
            ->update(['status' => 'development']);
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
