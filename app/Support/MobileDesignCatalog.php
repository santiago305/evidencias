<?php

namespace App\Support;

class MobileDesignCatalog
{
    /**
     * @return array<int, array{key: string, label: string, status: string}>
     */
    public static function available(): array
    {
        return [
            [
                'key' => 'mobile-1',
                'label' => 'Mobile 1',
                'status' => 'development',
            ],
            [
                'key' => 'mobile-2',
                'label' => 'Mobile 2',
                'status' => 'development',
            ],
            [
                'key' => 'mobile-3',
                'label' => 'Mobile 3',
                'status' => 'development',
            ],
            [
                'key' => 'mobile-4',
                'label' => 'Mobile 4',
                'status' => 'development',
            ],
            [
                'key' => 'mobile-5',
                'label' => 'Mobile 5',
                'status' => 'development',
            ],
            [
                'key' => 'mobile-6',
                'label' => 'Mobile 6',
                'status' => 'development',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_column(self::available(), 'key');
    }

    /**
     * @param iterable<string> $designKeys
     * @return list<string>
     */
    public static function filterSupported(iterable $designKeys): array
    {
        $supportedKeys = self::keys();

        return array_values(array_filter(
            array_unique(is_array($designKeys) ? $designKeys : iterator_to_array($designKeys, false)),
            static fn (mixed $designKey): bool => is_string($designKey) && in_array($designKey, $supportedKeys, true),
        ));
    }

    /**
     * @param iterable<string> $designKeys
     * @return list<array{key: string, label: string, status: string}>
     */
    public static function registeredDefinitions(iterable $designKeys): array
    {
        $registeredKeys = self::filterSupported($designKeys);

        return array_values(array_filter(
            self::available(),
            static fn (array $definition): bool => in_array($definition['key'], $registeredKeys, true),
        ));
    }
}
