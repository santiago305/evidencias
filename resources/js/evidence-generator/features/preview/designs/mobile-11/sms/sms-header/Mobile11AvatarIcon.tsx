import type { SVGProps } from 'react';

type Mobile11AvatarIconProps = SVGProps<SVGSVGElement>;

// ==============================
// CONFIGURACIÓN DEL CUERPO
// ==============================
const BODY_WIDTH = 12.5;
const BODY_LENGTH = 8.3;
const BODY_ARC_ANGLE = 40;

// ==============================
// CÁLCULOS DEL CUERPO
// ==============================
const BODY_CENTER_X = 24;
const BODY_TOP_Y = 25.2;

const BODY_LEFT_X = BODY_CENTER_X - BODY_WIDTH / 2;
const BODY_RIGHT_X = BODY_CENTER_X + BODY_WIDTH / 2;

const ARC_SAG = (BODY_WIDTH / 2) * Math.tan((BODY_ARC_ANGLE * Math.PI) / 360);

const BODY_BOTTOM_Y = BODY_TOP_Y + BODY_LENGTH;
const BODY_SIDE_BOTTOM_Y = BODY_BOTTOM_Y - ARC_SAG;

export function Mobile11AvatarIcon({
    className,
    ...props
}: Mobile11AvatarIconProps) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle
                cx="24"
                cy="24"
                r="18"
                fill="#303030"
            />

            <circle
                cx="24"
                cy="19.8"
                r="3.5"
                fill="#929493"
            />

            <path
                d={`
                    M${BODY_LEFT_X} ${BODY_SIDE_BOTTOM_Y}
                    C${BODY_LEFT_X} 28.65
                     19.3 ${BODY_TOP_Y}
                     ${BODY_CENTER_X} ${BODY_TOP_Y}
                    C28.7 ${BODY_TOP_Y}
                     ${BODY_RIGHT_X} 28.65
                     ${BODY_RIGHT_X} ${BODY_SIDE_BOTTOM_Y}
                    Q${BODY_RIGHT_X} ${BODY_BOTTOM_Y}
                     ${BODY_CENTER_X} ${BODY_BOTTOM_Y}
                    Q${BODY_LEFT_X} ${BODY_BOTTOM_Y}
                     ${BODY_LEFT_X} ${BODY_SIDE_BOTTOM_Y}
                    Z
                `}
                fill="#929493"
            />
        </svg>
    );
}