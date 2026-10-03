import type { SVGProps } from 'react';

export function Mobile15WifiIcon(props: SVGProps<SVGSVGElement>) {

    // Desplazamientos independientes en unidades del viewBox (24 x 24).
    const UpperArcX = 0;
    const UpperArcY = 1;
    const MiddleArcX = 0;
    const MiddleArcY = 0.4;
    const LowerArcX = 0;
    const LowerArcY = -0.4;
    const UploadArrowX = 1;
    const UploadArrowY = 0;
    const DownloadArrowX = 1;
    const DownloadArrowY = 0;
    const TriangleX = 0;
    const TriangleY = -0;

    // ============================================================
    // CONFIGURACIÓN GENERAL DEL TRIÁNGULO CON PANZA
    // ============================================================

    // Ancho total del triángulo
    const TRIANGLE_WIDTH = 4;

    // Alto / largo total del triángulo
    const TRIANGLE_HEIGHT = 2;

    // Intensidad de la "panza" o arco superior
    //
    // 0    = prácticamente recto
    // 0.5  = arco leve
    // 1.0  = arco marcado
    // 1.5  = arco muy pronunciado
    const TRIANGLE_ARC = 0.90;

    // Movimiento vertical del triángulo
    //
    // negativo = subir
    // positivo = bajar
    const TRIANGLE_BASE_Y = 1.2;


    // ============================================================
    // POSICIÓN BASE DEL TRIÁNGULO
    // ============================================================

    // Centro horizontal del icono
    const TRIANGLE_CENTER_X = 12;

    // Calculamos automáticamente los extremos
    const triangleLeftX =
        TRIANGLE_CENTER_X - TRIANGLE_WIDTH / 2;

    const triangleRightX =
        TRIANGLE_CENTER_X + TRIANGLE_WIDTH / 2;


    // Posición superior
    const triangleTopY =
        17.05 + TRIANGLE_BASE_Y;

    // Posición inferior
    const triangleBottomY =
        triangleTopY + TRIANGLE_HEIGHT;


    // ============================================================
    // CURVATURA DE LA PANZA
    // ============================================================

    // Mientras más grande sea TRIANGLE_ARC,
    // más arriba se levanta la curva.
    const triangleCenterY =
        triangleTopY - TRIANGLE_ARC;


    // ============================================================
    // PATH DEL TRIÁNGULO CON PANZA
    // ============================================================

    const triangleWithBelly = `
        M ${triangleLeftX} ${triangleTopY}

        C
            ${triangleLeftX + TRIANGLE_WIDTH * 0.16}
            ${triangleCenterY}

            ${TRIANGLE_CENTER_X - TRIANGLE_WIDTH * 0.18}
            ${triangleCenterY}

            ${TRIANGLE_CENTER_X}
            ${triangleCenterY}

        C
            ${TRIANGLE_CENTER_X + TRIANGLE_WIDTH * 0.18}
            ${triangleCenterY}

            ${triangleRightX - TRIANGLE_WIDTH * 0.16}
            ${triangleCenterY}

            ${triangleRightX}
            ${triangleTopY}

        L ${TRIANGLE_CENTER_X} ${triangleBottomY}

        Z
    `;


    // ============================================================
    // SVG
    // ============================================================

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            {...props}
        >

            {/* ==================================================
                ARCO SUPERIOR
            ================================================== */}

            <path
                transform={`translate(${UpperArcX} ${UpperArcY})`}
                d="
                    M2.55 8.05
                    C5.05 6.10 8.35 5.15 12 5.15
                    C15.65 5.15 18.95 6.10 21.45 8.05
                "
                stroke="currentColor"
                strokeWidth="2.15"
                strokeLinecap="butt"
                strokeLinejoin="miter"
            />


            {/* ==================================================
                ARCO MEDIO
            ================================================== */}

            <path
                transform={`translate(${MiddleArcX} ${MiddleArcY})`}
                d="
                    M5.45 12.10
                    C7.25 10.72 9.45 10.05 12 10.05
                    C14.55 10.05 16.75 10.72 18.55 12.10
                "
                stroke="currentColor"
                strokeWidth="2.15"
                strokeLinecap="butt"
                strokeLinejoin="miter"
            />


            {/* ==================================================
                ARCO INFERIOR
            ================================================== */}

            <path
                transform={`translate(${LowerArcX} ${LowerArcY})`}
                d="
                    M8.55 16.05
                    C9.55 15.30 10.65 14.95 12 14.95
                    C13.35 14.95 14.45 15.30 15.45 16.05
                "
                stroke="currentColor"
                strokeWidth="2.01"
                strokeLinecap="butt"
                strokeLinejoin="miter"
            />


            {/* ==================================================
                FLECHA HACIA ARRIBA
                Solo la cabeza de la flecha
            ================================================== */}
            <path
                transform={`translate(${UploadArrowX} ${UploadArrowY})`}
                d="
                    M4.35 18.20
                    L5.85 16.20
                    L7.35 18.20
                    Z
                "
                fill="currentColor"
            />


            {/* ==================================================
                FLECHA HACIA ABAJO
                Solo la cabeza de la flecha
            ================================================== */}

           <path
                transform={`translate(${DownloadArrowX} ${DownloadArrowY})`}
                d="
                    M4.35 18.90
                    L5.85 20.90
                    L7.35 18.90
                    Z
                "
                fill="currentColor"
            />


            {/* ==================================================
                TRIÁNGULO CON PANZA
            ================================================== */}

            <path
                transform={`translate(${TriangleX} ${TriangleY})`}
                d={triangleWithBelly}
                fill="currentColor"
            />

        </svg>
    );
}
