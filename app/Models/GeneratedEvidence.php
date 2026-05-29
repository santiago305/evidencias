<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedEvidence extends Model
{
    use HasFactory;

    protected $table = 'generated_evidences';

    protected $fillable = [
        'user_id',
        'conversation_id',
        'seed_code',
        'input_data',
        'generated_at',
    ];

    protected $casts = [
        'input_data' => 'array',
        'generated_at' => 'datetime',
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
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
