import type { SVGProps } from 'react';

type Mobile13CellSignalIconProps = SVGProps<SVGSVGElement>;

export function Mobile13CellSignalIcon(
    props: Mobile13CellSignalIconProps
) {
    // Altura inferior común para TODAS las barras
    const BASELINE_Y = 18;

    // Posición superior de cada barra
    const BAR_1_Y = 12;
    const BAR_2_Y = 9;
    const BAR_3_Y = 5.5;
    const BAR_4_Y = 2;

    // Ancho común
    const BAR_WIDTH = 4;

    // Redondeo común
    const BAR_RADIUS = 2;

    return (
        <svg
            viewBox="0 0 22 18"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            {/* 1ª barra */}
            <rect
                x="0"
                y={BAR_1_Y}
                width={BAR_WIDTH}
                height={BASELINE_Y - BAR_1_Y}
                rx={BAR_RADIUS}
                fill="currentColor"
            />

            {/* 2ª barra */}
            <rect
                x="5.8"
                y={BAR_2_Y}
                width={BAR_WIDTH}
                height={BASELINE_Y - BAR_2_Y}
                rx={BAR_RADIUS}
                fill="currentColor"
            />

            {/* 3ª barra */}
            <rect
                x="11.4"
                y={BAR_3_Y}
                width={BAR_WIDTH}
                height={BASELINE_Y - BAR_3_Y}
                rx={BAR_RADIUS}
                fill="currentColor"
            />

            {/* 4ª barra */}
            <rect
                x="16.9"
                y={BAR_4_Y}
                width={BAR_WIDTH}
                height={BASELINE_Y - BAR_4_Y}
                rx={BAR_RADIUS}
                fill="currentColor"
            />
        </svg>
    );
}