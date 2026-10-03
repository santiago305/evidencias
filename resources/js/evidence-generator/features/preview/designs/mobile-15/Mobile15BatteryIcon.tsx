const BATTERY_SHELL_PATH = 'M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z';
const batteryFillPathByLevel: Record<number, string> = {
    10: 'M16,18H8V6H16',
    20: 'M16,17H8V6H16',
    30: 'M16,15H8V6H16',
    40: 'M16,14H8V6H16',
    50: 'M16,13H8V6H16',
    60: 'M16,12H8V6H16',
    70: 'M16,10H8V6H16',
    80: 'M16,9H8V6H16',
    90: 'M16,8H8V6H16',
};

function resolveBatteryLevel(level: number): number {
    const roundedLevel = Math.max(10, Math.min(100, Math.round(level / 10) * 10));

    return roundedLevel;
}

export function Mobile15BatteryIcon({ level }: { level: number }) {
    const batteryLevel = resolveBatteryLevel(level);
    const batteryFillPath = batteryFillPathByLevel[batteryLevel];

    return (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] shrink-0" fill="currentColor" aria-hidden="true">
            <path d={`${batteryFillPath ? `${batteryFillPath} ` : ''}${BATTERY_SHELL_PATH}`} />
        </svg>
    );
}
