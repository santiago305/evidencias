<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserConversationProgress extends Model
{
    use HasFactory;

    protected $table = 'user_conversation_progress';

    protected $fillable = [
        'user_id',
        'cycle',
        'pending_ids',
        'used_ids',
        'last_conversation_id',
        'start_conversation_id',
    ];

    protected $casts = [
        'pending_ids' => 'array',
        'used_ids' => 'array',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Conversation, $this>
     */
    public function lastConversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'last_conversation_id');
    }

    /**
     * @return BelongsTo<Conversation, $this>
     */
    public function startConversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'start_conversation_id');
    }
}
