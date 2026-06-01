<?php

namespace App\Services\Conversation;

use InvalidArgumentException;

class ConversationDelayDistributionService
{
    /**
     * @param  list<array{side:string,lines:list<string>}>  $messages
     * @return list<int>
     */
    public function distribute(array $messages, ?int $targetTotalMinutes = null): array
    {
        $messageCount = count($messages);

        if ($messageCount <= 0) {
            throw new InvalidArgumentException('The conversation must contain at least one message.');
        }

        if ($messageCount === 1) {
            return [0];
        }

        $gapMeta = [];
        for ($index = 1; $index < $messageCount; $index++) {
            $previousSide = (string) ($messages[$index - 1]['side'] ?? '');
            $currentSide = (string) ($messages[$index]['side'] ?? '');
            $isSameSpeaker = $previousSide === $currentSide;

            $gapMeta[] = [
                'min' => $isSameSpeaker ? 0 : 1,
                'max' => $isSameSpeaker ? 5 : 720,
                'is_same_speaker' => $isSameSpeaker,
            ];
        }

        if ($targetTotalMinutes === null || $targetTotalMinutes <= 0) {
            return $this->buildRandomDelaysWithoutTarget($gapMeta);
        }

        return $this->buildRandomDelaysWithTarget($gapMeta, $targetTotalMinutes);
    }

    /**
     * @param  list<array{min:int,max:int,is_same_speaker:bool}>  $gapMeta
     * @return list<int>
     */
    private function buildRandomDelaysWithoutTarget(array $gapMeta): array
    {
        $delays = [0];

        foreach ($gapMeta as $meta) {
            if ($meta['is_same_speaker']) {
                $roll = random_int(1, 100);
                $delays[] = $roll <= 35 ? 0 : random_int(2, 5);

                continue;
            }

            $delays[] = $this->randomReplyGapMinutes();
        }

        return $delays;
    }

    /**
     * @param  list<array{min:int,max:int,is_same_speaker:bool}>  $gapMeta
     * @return list<int>
     */
    private function buildRandomDelaysWithTarget(array $gapMeta, int $targetTotalMinutes): array
    {
        $minimumTotal = 0;
        $maximumTotal = 0;

        foreach ($gapMeta as $meta) {
            $minimumTotal += $meta['min'];
            $maximumTotal += $meta['max'];
        }

        $target = max($minimumTotal, min($targetTotalMinutes, $maximumTotal));
        $gaps = array_map(fn (array $meta): int => $meta['min'], $gapMeta);
        $remaining = $target - $minimumTotal;

        while ($remaining > 0) {
            $candidates = [];
            foreach ($gaps as $index => $currentValue) {
                $capacity = $gapMeta[$index]['max'] - $currentValue;
                if ($capacity > 0) {
                    $candidates[] = $index;
                }
            }

            if ($candidates === []) {
                break;
            }

            $selectedIndex = $candidates[random_int(0, count($candidates) - 1)];
            $gaps[$selectedIndex]++;
            $remaining--;
        }

        return array_merge([0], $gaps);
    }

    private function randomReplyGapMinutes(): int
    {
        $roll = random_int(1, 100);

        if ($roll <= 60) {
            return random_int(6, 25);
        }

        if ($roll <= 90) {
            return random_int(26, 90);
        }

        if ($roll <= 98) {
            return random_int(91, 240);
        }

        return random_int(241, 720);
    }
}
