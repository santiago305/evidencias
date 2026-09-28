import type { SVGProps } from 'react';

type Mobile13WifiIconProps = SVGProps<SVGSVGElement>;

// ═══════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════

const CENTER_X = 12;

// ─────────────── ARCO SUPERIOR ────────────────
const OUTER_STROKE_WIDTH = 3;
const OUTER_ARC_WIDTH = 18;
const OUTER_ARC_HEIGHT = 5;
const OUTER_Y = 6.8;

// ─────────────── ARCO INTERIOR ────────────────
const INNER_STROKE_WIDTH = 3;
const INNER_ARC_WIDTH = 11;
const INNER_ARC_HEIGHT = 3;
const INNER_Y = 10.5;

// ───────────── DISTANCIA ENTRE ARCOS ───────────
const ARC_GAP = 0;

// ─────────────────── PUNTO ────────────────────
const DOT_WIDTH = 7;
const DOT_HEIGHT = 5.2;

// Distancia del punto respecto al arco interior
const DOT_GAP = 1;

// Curvatura de la parte superior del punto
const DOT_TOP_CURVE = 0.55;

// Curvatura de los laterales
const DOT_SIDE_CURVE = 0.42;

export function Mobile13WifiIcon(props: Mobile13WifiIconProps) {
    // ─────────────────────────────────────────
    // POSICIONES
    // ─────────────────────────────────────────

    const outerY = OUTER_Y;

    const innerY = INNER_Y + ARC_GAP;

    const dotY =
        innerY +
        INNER_ARC_HEIGHT / 2 +
        INNER_STROKE_WIDTH / 2 +
        DOT_GAP;

    // ─────────────────────────────────────────
    // ARCO SUPERIOR
    // ─────────────────────────────────────────

    const outerLeft = CENTER_X - OUTER_ARC_WIDTH / 2;
    const outerRight = CENTER_X + OUTER_ARC_WIDTH / 2;

    const outerPath = `
        M ${outerLeft} ${outerY}
        C ${CENTER_X - OUTER_ARC_WIDTH * 0.22}
          ${outerY - OUTER_ARC_HEIGHT}
          ${CENTER_X + OUTER_ARC_WIDTH * 0.22}
          ${outerY - OUTER_ARC_HEIGHT}
          ${outerRight} ${outerY}
    `;

    // ─────────────────────────────────────────
    // ARCO INTERIOR
    // ─────────────────────────────────────────

    const innerLeft = CENTER_X - INNER_ARC_WIDTH / 2;
    const innerRight = CENTER_X + INNER_ARC_WIDTH / 2;

    const innerPath = `
        M ${innerLeft} ${innerY}
        C ${CENTER_X - INNER_ARC_WIDTH * 0.22}
          ${innerY - INNER_ARC_HEIGHT}
          ${CENTER_X + INNER_ARC_WIDTH * 0.22}
          ${innerY - INNER_ARC_HEIGHT}
          ${innerRight} ${innerY}
    `;

    // ─────────────────────────────────────────
    // PUNTO / INDICADOR
    // ─────────────────────────────────────────

    const dotPath = `
        M ${CENTER_X - DOT_WIDTH / 2}
          ${dotY - DOT_HEIGHT * 0.15}

        C ${CENTER_X - DOT_WIDTH * 0.32}
          ${dotY - DOT_HEIGHT * DOT_TOP_CURVE}

          ${CENTER_X + DOT_WIDTH * 0.32}
          ${dotY - DOT_HEIGHT * DOT_TOP_CURVE}

          ${CENTER_X + DOT_WIDTH / 2}
          ${dotY - DOT_HEIGHT * 0.15}

        C ${CENTER_X + DOT_WIDTH * DOT_SIDE_CURVE}
          ${dotY + DOT_HEIGHT * 0.15}

          ${CENTER_X + DOT_WIDTH * 0.25}
          ${dotY + DOT_HEIGHT * 0.45}

          ${CENTER_X}
          ${dotY + DOT_HEIGHT / 2}

        C ${CENTER_X - DOT_WIDTH * 0.25}
          ${dotY + DOT_HEIGHT * 0.45}

          ${CENTER_X - DOT_WIDTH * DOT_SIDE_CURVE}
          ${dotY + DOT_HEIGHT * 0.15}

          ${CENTER_X - DOT_WIDTH / 2}
          ${dotY - DOT_HEIGHT * 0.15}

        Z
    `;

    return (
        <svg
            viewBox="0 0 24 20"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            {/* ═══════════════════════════════════
                ARCO SUPERIOR
            ═══════════════════════════════════ */}
            <path
                d={outerPath}
                stroke="currentColor"
                strokeWidth={OUTER_STROKE_WIDTH}
                strokeLinecap="round"
            />

            {/* ═══════════════════════════════════
                ARCO INTERIOR
            ═══════════════════════════════════ */}
            <path
                d={innerPath}
                stroke="currentColor"
                strokeWidth={INNER_STROKE_WIDTH}
                strokeLinecap="round"
            />

            {/* ═══════════════════════════════════
                PUNTO INFERIOR
            ═══════════════════════════════════ */}
            <path
                d={dotPath}
                fill="currentColor"
            />
        </svg>
    );
}