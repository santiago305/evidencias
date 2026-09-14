import { useId } from 'react';

const BATTERY_X = 3;
const BATTERY_Y = 3;
const BATTERY_WIDTH = 38;
const BATTERY_HEIGHT = 20;
const BATTERY_RADIUS = 5;

const TERMINAL_X = 41;
const TERMINAL_Y = 8;
const TERMINAL_WIDTH = 3;
const TERMINAL_HEIGHT = 8;
const TERMINAL_RADIUS = 1.5;

const BATTERY_COLOR = '#3A3A3A';
const EMPTY_COLOR = '#DBDBDB';
const TEXT_COLOR = '#EFEAE2';

export function getMobile8BatteryProgressWidth(level: number): number {
    const value = Math.max(0, Math.min(100, Math.round(level)));

    return BATTERY_WIDTH * (value / 100);
}

export type Mobile8BatteryIconProps = {
    level: number;
    themeMode: 'light' | 'dark';
    progressColor?: string;
    foregroundColor?: string;
    backgroundColor?: string;
};

export function Mobile8BatteryIcon({
    level,
    themeMode,
    progressColor,
    foregroundColor,
    backgroundColor,
}: Mobile8BatteryIconProps) {
    const value = Math.max(0, Math.min(100, Math.round(level)));

    const id = useId().replace(/:/g, '');

    const batteryClipId = `mobile8-battery-clip-${id}`;

    const progressWidth = getMobile8BatteryProgressWidth(value);

    const batteryColor =
        foregroundColor || BATTERY_COLOR;

    const resolvedEmptyColor =
        backgroundColor ??
        progressColor ??
        (themeMode === 'dark'
            ? '#AEB7C2'
            : EMPTY_COLOR);

    return (
        <svg
            viewBox="0 0 48 24"
            className="h-[25px] w-[28px]"
            fill="none"
            aria-label={`Batería ${value}%`}
            role="img"
        >
            <defs>
                <clipPath id={batteryClipId}>
                    <rect
                        x={BATTERY_X}
                        y={BATTERY_Y}
                        width={BATTERY_WIDTH}
                        height={BATTERY_HEIGHT}
                        rx={BATTERY_RADIUS}
                    />
                </clipPath>
            </defs>

            {/* =================================================
                CUERPO COMPLETO DE LA BATERÍA
                ================================================= */}
            <rect
                x={BATTERY_X}
                y={BATTERY_Y}
                width={BATTERY_WIDTH}
                height={BATTERY_HEIGHT}
                rx={BATTERY_RADIUS}
                fill={resolvedEmptyColor}
            />

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
                stroke={batteryColor}
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
                fill={batteryColor}
            />

            {/* =================================================
                PORCENTAJE
                ================================================= */}
            <text
                x="21"
                y="12"
                textAnchor="middle"
                dominantBaseline="central"
                fill={"#efeae2"}
                fontFamily="Roboto, Arial, sans-serif"
                fontSize="15"
                fontWeight="700"
                letterSpacing="-0.35"
            >
                {value}
            </text>
        </svg>
    );
}