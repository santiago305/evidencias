import type { SVGProps } from 'react';

type Mobile15CellSignalIconProps = SVGProps<SVGSVGElement>;

export function Mobile15CellSignalIcon(
    props: Mobile15CellSignalIconProps
) {
    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    // Separación entre las barras.
    //
    // Más pequeño = barras más juntas
    // Más grande  = barras más separadas
    //
    // Valor recomendado: 4
    const BAR_SPACING = 3.9;


    // ============================================================
    // POSICIONES
    // ============================================================

    const BAR_1_X = 2;

    const BAR_2_X =
        BAR_1_X + BAR_SPACING;

    const BAR_3_X =
        BAR_2_X + BAR_SPACING + 0.5;

    const BAR_4_X =
        BAR_3_X + BAR_SPACING;


    // ============================================================
    // SVG
    // ============================================================

    return (
        <svg
            viewBox="0 0 20 18"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            {/* Barra 1 */}
            <rect
                x={BAR_1_X}
                y="13.5"
                width="2"
                height="4"
                rx="0.9"
                fill="currentColor"
            />

            {/* Barra 2 */}
            <rect
                x={BAR_2_X}
                y="10.5"
                width="2"
                height="7"
                rx="0.9"
                fill="currentColor"
            />

            {/* Barra 3 */}
            <rect
                x={BAR_3_X}
                y="7"
                width="2"
                height="10.5"
                rx="0.9"
                fill="currentColor"
            />

            {/* Barra 4 */}
            <rect
                x={BAR_4_X}
                y="3"
                width="2"
                height="14.5"
                rx="0.9"
                fill="currentColor"
            />
        </svg>
    );
}