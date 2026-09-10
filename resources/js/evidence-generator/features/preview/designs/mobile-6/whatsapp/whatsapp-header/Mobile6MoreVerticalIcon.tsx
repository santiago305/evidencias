import type { SVGProps } from 'react';

type Mobile6MoreVerticalIconProps = SVGProps<SVGSVGElement>;

export function Mobile6MoreVerticalIcon({
    className,
    ...props
}: Mobile6MoreVerticalIconProps) {
    return (
        <svg
            viewBox="0 0 10 24"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle cx="2" cy="8" r="1.90" fill="currentColor" />
            <circle cx="2" cy="14" r="1.90" fill="currentColor" />
            <circle cx="2" cy="20" r="1.90" fill="currentColor" />
        </svg>
    );
}
