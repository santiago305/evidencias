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
        ];
    }

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_column(self::available(), 'key');
    }
}
