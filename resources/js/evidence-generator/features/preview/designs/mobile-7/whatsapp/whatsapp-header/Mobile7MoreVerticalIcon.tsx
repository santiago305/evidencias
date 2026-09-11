import type { SVGProps } from 'react';

type Mobile7MoreVerticalIconProps = SVGProps<SVGSVGElement>;

// Cambia este valor si quieres los puntos más grandes o más pequeños
const DOT_RADIUS = 2.45;

export function Mobile7MoreVerticalIcon({
    className,
    ...props
}: Mobile7MoreVerticalIconProps) {
    return (
        <svg
            viewBox="0 0 4 24"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle cx={DOT_RADIUS} cy="4" r={DOT_RADIUS} fill="currentColor" />
            <circle cx={DOT_RADIUS} cy="11" r={DOT_RADIUS} fill="currentColor" />
            <circle cx={DOT_RADIUS} cy="18" r={DOT_RADIUS} fill="currentColor" />
        </svg>
    );
}