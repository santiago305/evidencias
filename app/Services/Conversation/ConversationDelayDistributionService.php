<?php

namespace App\Services\Conversation;

use InvalidArgumentException;

class ConversationDelayDistributionService
{
    /**
     * @return list<int>
     */
    public function distribute(int $totalMinutes, int $messageCount): array
    {
        if ($messageCount <= 0) {
            throw new InvalidArgumentException('The conversation must contain at least one message.');
        }

        if ($messageCount === 1) {
            return [0];
        }

        $minimumGap = 6;
        $gapCount = $messageCount - 1;
        $minimumRequired = $minimumGap * $gapCount;

        if ($totalMinutes < $minimumRequired) {
            throw new InvalidArgumentException("The total minutes must be at least {$minimumRequired} for {$messageCount} messages.");
        }

        $remainingMinutes = $totalMinutes - $minimumRequired;
        $gaps = array_fill(0, $gapCount, $minimumGap);

        for ($i = 0; $i < $remainingMinutes; $i++) {
            $index = random_int(0, $gapCount - 1);
            $gaps[$index]++;
        }

        return array_merge([0], $gaps);
    }
}
