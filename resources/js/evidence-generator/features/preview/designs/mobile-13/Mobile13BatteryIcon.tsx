import { useId } from 'react';

const BATTERY_X = 3;
const BATTERY_Y = 3;
const BATTERY_WIDTH = 38;
const BATTERY_HEIGHT = 24;
const BATTERY_RADIUS = 8;

const TERMINAL_X = 42;
const TERMINAL_Y = 11;
const TERMINAL_WIDTH = 3;
const TERMINAL_HEIGHT = 8;
const TERMINAL_RADIUS = 1.5;

const BATTERY_COLOR = '#3A3A3A';
export const EMPTY_COLOR = '#888888';

export function getMobile13BatteryProgressWidth(level: number): number {
    const value = Math.max(0, Math.min(100, Math.round(level)));

    return BATTERY_WIDTH * (value / 100);
}

export type Mobile13BatteryIconProps = {
    level: number;
    themeMode: 'light' | 'dark';
    progressColor?: string;
    foregroundColor?: string;
    backgroundColor?: string;
};

export function Mobile13BatteryIcon({ level, themeMode, progressColor, foregroundColor, backgroundColor }: Mobile13BatteryIconProps) {
    const value = Math.max(0, Math.min(100, Math.round(level)));

    const id = useId().replace(/:/g, '');

    const batteryClipId = `mobile13-battery-clip-${id}`;
    const batteryTextMaskId = `mobile13-battery-text-mask-${id}`;

    const progressWidth = getMobile13BatteryProgressWidth(value);

    const batteryColor = foregroundColor || BATTERY_COLOR;

    const resolvedEmptyColor = backgroundColor ?? progressColor ?? (themeMode === 'dark' ? '#AEB7C2' : EMPTY_COLOR);

    return (
        <svg viewBox="0 2 56 24" className="h-[15px] w-[34px]" fill="none" aria-label={`Batería ${value}%`} role="img">
            <defs>
                <clipPath id={batteryClipId}>
                    <rect x={BATTERY_X} y={BATTERY_Y} width={BATTERY_WIDTH} height={BATTERY_HEIGHT} rx={BATTERY_RADIUS} />
                </clipPath>
                <mask id={batteryTextMaskId} maskUnits="userSpaceOnUse" x="0" y="2" width="56" height="24">
                    <rect x="0" y="2" width="56" height="24" fill="white" />
                    <text
                        x="21"
                        y="14.850"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="black"
                        fontFamily="Inter, Arial, sans-serif"
                        fontSize="18"
                        fontWeight="600"
                        letterSpacing="-0.35px"
                    >
                        {value}
                    </text>
                </mask>
            </defs>

            <g mask={`url(#${batteryTextMaskId})`}>
                {/* =================================================
                    CUERPO COMPLETO DE LA BATERÍA
                    ================================================= */}
                <rect x={BATTERY_X} y={BATTERY_Y} width={BATTERY_WIDTH} height={BATTERY_HEIGHT} rx={BATTERY_RADIUS} fill={resolvedEmptyColor} />

                {/* =================================================
                    NIVEL DE BATERÍA

                    El progreso utiliza EXACTAMENTE la misma
                    geometría exterior de la batería mediante
                    clipPath.

                    Esto evita que aparezca un segundo borde
                    interior de otro color.
                    ================================================= */}
                <rect
                    x={BATTERY_X}
                    y={BATTERY_Y}
                    width={progressWidth}
                    height={BATTERY_HEIGHT}
                    clipPath={`url(#${batteryClipId})`}
                    fill={batteryColor}
                />

                {/* =================================================
                    BORDE DE LA BATERÍA

                    Se dibuja AL FINAL para garantizar que el borde
                    siempre sea del color de la batería y quede
                    completamente limpio.
                    ================================================= */}
                <rect
                    x={BATTERY_X}
                    y={BATTERY_Y}
                    width={BATTERY_WIDTH}
                    height={BATTERY_HEIGHT}
                    rx={BATTERY_RADIUS}
                    fill="none"
                    stroke="none"
                    strokeWidth="0.8"
                />

                {/* =================================================
                    TERMINAL
                    ================================================= */}
                <rect
                    x={TERMINAL_X}
                    y={TERMINAL_Y}
                    width={TERMINAL_WIDTH}
                    height={TERMINAL_HEIGHT}
                    rx={TERMINAL_RADIUS}
                    fill={value === 100 ? batteryColor : resolvedEmptyColor}
                />
            </g>
        </svg>
    );
}
