import type { SVGProps } from 'react';

type Mobile7WifiIconProps = SVGProps<SVGSVGElement>;

// ==================================================
// Mobile-7 WiFi visual controls
// ==================================================

// Grosor de los tres arcos.
// Mayor valor = más grueso.
// Menor valor = más delgado.
const WIFI_STROKE_WIDTH = 2.40;

// Separación adicional entre cada nivel del WiFi.
//
//  0     = separación original.
//  0.25  = ligeramente más separados.
//  0.5   = más separados.
// -0.25  = ligeramente más juntos.
// -0.5   = más juntos.
const WIFI_SPACING_ADJUSTMENT = 0.35;

// Mantiene el tamaño del punto proporcional al grosor.
// Con strokeWidth 2.25 produce exactamente radio 2.05.
const WIFI_DOT_RADIUS =
    WIFI_STROKE_WIDTH * (2.05 / 2.45);

export function Mobile7WifiIcon({
    className,
    ...props
}: Mobile7WifiIconProps) {
    const secondArcOffset =
        WIFI_SPACING_ADJUSTMENT;

    const thirdArcOffset =
        WIFI_SPACING_ADJUSTMENT * 2;

    const dotOffset =
        WIFI_SPACING_ADJUSTMENT * 3;

    return (
        <svg
            viewBox="0 0 20 18"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            {/* Arco superior: se mantiene como punto de referencia */}
            <path
                d="M2.15 6.1C4.38 4.26 7.42 3.15 11 3.15C14.58 3.15 17.62 4.26 19.85 6.1"
                stroke="currentColor"
                strokeWidth={WIFI_STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Segundo arco */}
            <path
                d="M4.95 9.08C6.55 7.78 8.66 7 11 7C13.34 7 15.45 7.78 17.05 9.08"
                stroke="currentColor"
                strokeWidth={WIFI_STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(0 ${secondArcOffset})`}
            />

            {/* Tercer arco */}
            <path
                d="M7.9 12.02C8.74 11.37 9.83 10.96 11 10.96C12.17 10.96 13.26 11.37 14.1 12.02"
                stroke="currentColor"
                strokeWidth={WIFI_STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(0 ${thirdArcOffset})`}
            />

            {/* Punto inferior */}
            <circle
                cx="11"
                cy={14.85 + dotOffset}
                r={WIFI_DOT_RADIUS}
                fill="currentColor"
            />
        </svg>
    );
}
