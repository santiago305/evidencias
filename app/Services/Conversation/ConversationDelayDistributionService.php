<?php

namespace App\Services\Conversation;

use InvalidArgumentException;

class ConversationDelayDistributionService
{
    /**
     * @param  list<array{side:string,lines:list<string>}>  $messages
     * @return list<int>
     */
    public function distribute(array $messages, ?int $targetTotalMinutes = null, ?string $seed = null): array
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
            return $this->buildRandomDelaysWithoutTarget($gapMeta, $seed);
        }

        return $this->buildRandomDelaysWithTarget($gapMeta, $targetTotalMinutes, $seed);
    }

    /**
     * @param  list<array{min:int,max:int,is_same_speaker:bool}>  $gapMeta
     * @return list<int>
     */
    private function buildRandomDelaysWithoutTarget(array $gapMeta, ?string $seed = null): array
    {
        $delays = [0];
        $counter = 0;

        foreach ($gapMeta as $meta) {
            if ($meta['is_same_speaker']) {
                if ($seed === null) {
                    $roll = random_int(1, 100);
                    $delays[] = $roll <= 35 ? 0 : random_int(2, 5);

                    continue;
                }

                $roll = $this->seededInt($seed, 1, 100, $counter);
                $delays[] = $roll <= 35 ? 0 : $this->seededInt($seed, 2, 5, $counter);

                continue;
            }

            $delays[] = $seed === null
                ? $this->randomReplyGapMinutes()
                : $this->randomReplyGapMinutesSeeded($seed, $counter);
        }

        return $delays;
    }

    /**
     * @param  list<array{min:int,max:int,is_same_speaker:bool}>  $gapMeta
     * @return list<int>
     */
    private function buildRandomDelaysWithTarget(array $gapMeta, int $targetTotalMinutes, ?string $seed = null): array
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
        $counter = 0;

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

            $selectedIndex = $seed === null
                ? $candidates[random_int(0, count($candidates) - 1)]
                : $candidates[$this->seededInt($seed, 0, count($candidates) - 1, $counter)];
            $gaps[$selectedIndex]++;
            $remaining--;
        }

        return array_merge([0], $gaps);
    }

    private function randomReplyGapMinutesSeeded(string $seed, int &$counter): int
    {
        $roll = $this->seededInt($seed, 1, 100, $counter);

        if ($roll <= 60) {
            return $this->seededInt($seed, 6, 25, $counter);
        }

        if ($roll <= 90) {
            return $this->seededInt($seed, 26, 90, $counter);
        }

        if ($roll <= 98) {
            return $this->seededInt($seed, 91, 240, $counter);
        }

        return $this->seededInt($seed, 241, 720, $counter);
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

    private function seededInt(string $seed, int $min, int $max, int &$counter): int
    {
        $range = $max - $min + 1;
        $hash = hash('sha256', $seed.'|'.$counter);
        $counter++;
        $value = hexdec(substr($hash, 0, 8));

        return $min + ((int) $value % $range);
    }
}
