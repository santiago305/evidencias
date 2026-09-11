import { useId } from 'react';
import { mobile7FontFamily } from './mobile7Colors';

const INNER_X = 2.5;
const INNER_Y = 4;
const INNER_WIDTH = 38;
const INNER_HEIGHT = 16;
const INNER_RADIUS = 3.5;
const PROGRESS_COLOR_DARK = '#AEB7C2';

export function getMobile7BatteryProgressWidth(level: number): number {
    const value = Math.max(0, Math.min(100, Math.round(level)));

    return INNER_WIDTH * (value / 100);
}

export type Mobile7BatteryIconProps = {
    level: number;
    themeMode: 'light' | 'dark';
    progressColor?: string;
    foregroundColor: string;
};

export function Mobile7BatteryIcon({ level, themeMode, progressColor, foregroundColor }: Mobile7BatteryIconProps) {
    const value = Math.max(0, Math.min(100, Math.round(level)));
    const clipId = `mobile7-battery-${useId().replace(/:/g, '')}`;
    const progressWidth = getMobile7BatteryProgressWidth(level);
    const color = foregroundColor;
    const resolvedProgressColor = progressColor ?? (themeMode === 'dark' ? PROGRESS_COLOR_DARK : "#DBDBDB");

    return (
        <svg viewBox="0 0 48 24" className="h-[18px] w-[30px] shrink-0" fill="none" aria-label={`Batería ${value}%`} role="img">
            <defs>
                <clipPath id={clipId}>
                    <rect x={INNER_X} y={INNER_Y} width={INNER_WIDTH} height={INNER_HEIGHT} rx={INNER_RADIUS} />
                </clipPath>
            </defs>
            <rect
                x={INNER_X}
                y={INNER_Y}
                width={progressWidth}
                height={INNER_HEIGHT}
                rx={INNER_RADIUS}
                clipPath={`url(#${clipId})`}
                fill={resolvedProgressColor}
            />
            <rect x="1.5" y="3" width="40" height="18" rx="4.5" stroke={color} strokeWidth="2" />
            <rect x="43" y="8" width="3" height="8" rx="1.5" fill={color} />
            <text
                x="21.5"
                y="12.4"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontFamily={mobile7FontFamily}
                fontSize="15"
                fontWeight="500"
                letterSpacing="-0.25"
            >
                {value}
            </text>
        </svg>
    );
}
