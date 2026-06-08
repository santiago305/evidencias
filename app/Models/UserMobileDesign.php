<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMobileDesign extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'design_key',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
