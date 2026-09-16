import type { SVGProps } from 'react';

type Mobile11MoreVerticalIconProps = SVGProps<SVGSVGElement>;

// Cambia este valor si quieres los puntos más grandes o más pequeños
const DOT_RADIUS = 2;

export function Mobile11MoreVerticalIcon({
    className,
    ...props
}: Mobile11MoreVerticalIconProps) {
    return (
        <svg
            viewBox="0 0 4 24"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle cx={DOT_RADIUS} cy="5" r={DOT_RADIUS} fill="currentColor" />
            <circle cx={DOT_RADIUS} cy="11" r={DOT_RADIUS} fill="currentColor" />
            <circle cx={DOT_RADIUS} cy="17" r={DOT_RADIUS} fill="currentColor" />
        </svg>
    );
}