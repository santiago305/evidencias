export function getMobile1BatteryColor(batteryLevel: number, normalColor: string): string {
    if (batteryLevel <= 5) {
        return '#D93025';
    }

    if (batteryLevel <= 20) {
        return '#F5A623';
    }

    return normalColor;
}

export function Mobile1BatteryIcon({ batteryLevel, charging = false }: { batteryLevel: number; charging?: boolean }) {
    const level = Math.max(0, Math.min(100, Math.round(batteryLevel)));
    const progressWidth = (48 * level) / 100;
    const progressColor = getMobile1BatteryColor(level, '#EDEDED');
    const numberX = charging ? 31 : 24;

    return (
        <svg
            viewBox="0 0 48 28"
            className="block h-[14px] w-[24px] shrink-0"
            width="24"
            height="14"
            aria-label={`Batería ${level}%`}
            role="img"
            overflow="visible"
        >
            <title>{`Batería ${level}%`}</title>
            <defs>
                <clipPath id="mobile1BatteryClip">
                    <rect x="0" y="0" width="48" height="28" rx="14" />
                </clipPath>
            </defs>
            <rect x="0" y="0" width="48" height="28" rx="14" fill="#858585" />
            <rect x="0" y="0" width={progressWidth} height="28" fill={progressColor} clipPath="url(#mobile1BatteryClip)" />
            {charging ? <path d="M13.5 4.8 7.5 14.2h4.1l-2.2 8.8 7.6-11.5h-4.2l1.9-6.7Z" fill="#111111" /> : null}
            <text x={numberX} y="14.5" textAnchor="middle" dominantBaseline="middle" fill="#111111" fontFamily="'Roboto Condensed', 'Roboto', sans-serif" fontSize="18" fontWeight="800" letterSpacing="-1.2">
                {level}
            </text>
        </svg>
    );
}
