type Signal45GIconProps = {
    width?: number;
    height?: number;
    className?: string;
    barsColor?: string;
};

const ARROW_SCALE = 0.90;
const ARROW_SPACING = 0; // Positive values move the arrows farther apart.
const ARROWS_OFFSET_X = 3; // Positive moves right; negative moves left.
const ARROWS_OFFSET_Y = 4; // Positive moves down; negative moves up.

const firstArrowTransform = `translate(${ARROWS_OFFSET_X - ARROW_SPACING / 2} ${ARROWS_OFFSET_Y}) translate(7.5 14.6) scale(${ARROW_SCALE}) translate(-7.5 -14.6)`;
const secondArrowTransform = `translate(${ARROWS_OFFSET_X + ARROW_SPACING / 2} ${ARROWS_OFFSET_Y}) translate(12.85 14.6) scale(${ARROW_SCALE}) translate(-12.85 -14.6)`;

const SIGNAL_BARS_SCALE = 0.90; // 1 keeps the original size; increase or decrease to resize the bars.
const SIGNAL_BARS_THICKNESS = 1; // Additional SVG stroke width in viewBox units.
const SIGNAL_BARS_SPACING = 1; // Positive values increase gaps; negative values bring bars closer.

export function Signal45GIcon({ width = 46, height = 24, className = '', barsColor }: Signal45GIconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 50 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={className}
        >
            <text
                x="6"
                y="11"
                fill="currentColor"
                fontFamily="Roboto, Arial, sans-serif"
                fontSize="10"
                fontWeight="400"
                letterSpacing="-0.25"
            >
                4.5G
            </text>

            <path
                d="M8.8 17L8.8 11.2L7.6 11.2L7.6 14.2L6.2 14.2L8.55 18L8.8 17"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="square"
                strokeLinejoin="round"
                opacity="0.72"
                transform={firstArrowTransform}
            />

            <path
                d="M11.6 17.2L11.7 11.2L14.1 14.2L12.9 14.2L12.9 18L11.6 18"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="square"
                strokeLinejoin="round"
                opacity="0.72"
                transform={secondArrowTransform}
            />

            <g
                transform={`translate(32.5 22) scale(${SIGNAL_BARS_SCALE}) translate(-32.5 -22)`}
                style={barsColor ? { color: barsColor } : undefined}
            >
                <path
                    d="M21 18C21 17.45 21.45 17 22 17H24V22H21Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={SIGNAL_BARS_THICKNESS}
                    transform={`translate(${-2 * SIGNAL_BARS_SPACING} 0)`}
                />
                <path
                    d="M26 15C26 14.45 26.45 14 27 14H29V22H26Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={SIGNAL_BARS_THICKNESS}
                    transform={`translate(${-SIGNAL_BARS_SPACING} 0)`}
                />
                <path
                    d="M31 12C31 11.45 31.45 11 32 11H34V22H31Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={SIGNAL_BARS_THICKNESS}
                />
                <path
                    d="M36 8C36 7.45 36.45 7 37 7H39V22H36Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={SIGNAL_BARS_THICKNESS}
                    transform={`translate(${SIGNAL_BARS_SPACING} 0)`}
                />
                <path
                    d="M41 4C41 3.45 41.45 3 42 3H44V22H41Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={SIGNAL_BARS_THICKNESS}
                    opacity="0.25"
                    transform={`translate(${2 * SIGNAL_BARS_SPACING} 0)`}
                />
            </g>
        </svg>
    );
}
