<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Models\Conversation;
use App\Models\ConversationMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    public function index(): JsonResponse
    {
        $conversations = Conversation::query()
            ->with('messages')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'data' => $conversations,
        ]);
    }

    public function store(StoreConversationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $conversation = DB::transaction(function () use ($validated) {
            $conversation = Conversation::query()->create([
                'code' => $validated['code'],
                'is_active' => true,
            ]);

            foreach ($validated['messages'] as $index => $message) {
                ConversationMessage::query()->create([
                    'conversation_id' => $conversation->id,
                    'position' => $index + 1,
                    'side' => $message['side'],
                    'delay_minutes' => (int) $message['delay_minutes'],
                    'lines' => $message['lines'],
                ]);
            }

            return $conversation;
        });

        return response()->json([
            'message' => 'Conversacion registrada correctamente.',
            'data' => $conversation->load('messages'),
        ], 201);
    }
}
