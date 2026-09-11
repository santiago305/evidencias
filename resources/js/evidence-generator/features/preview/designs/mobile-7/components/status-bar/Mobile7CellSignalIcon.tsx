import type { SVGProps } from 'react';

type Mobile7CellSignalIconProps =
    SVGProps<SVGSVGElement>;

export function Mobile7CellSignalIcon(
    props: Mobile7CellSignalIconProps,
) {
    return (
        <svg
            viewBox="0 0 20 18"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            <rect
                x="0"
                y="14.9"
                width="2.6"
                height="4.5"
                rx="0.95"
                ry="0.95"
                fill="currentColor"
            />

            <rect
                x="4.25"
                y="12.5"
                width="2.6"
                height="7.5"
                rx="0.95"
                ry="0.95"
                fill="currentColor"
            />

            <rect
                x="8.5"
                y="9.5"
                width="2.6"
                height="10.5"
                rx="0.95"
                ry="0.95"
                fill="currentColor"
            />

            <rect
                x="12.75"
                y="6.5"
                width="2.6"
                height="13.5"
                rx="0.95"
                ry="0.95"
                fill="currentColor"
            />

            <rect
                x="17"
                y="3.5"
                width="2.6"
                height="16.5"
                rx="0.95"
                ry="0.95"
                fill="currentColor"
            />
        </svg>
    );
}
