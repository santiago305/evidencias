import type { SVGProps } from 'react';

type Mobile7BackIconProps = SVGProps<SVGSVGElement>;

export function Mobile7BackIcon({ className, ...props }: Mobile7BackIconProps) {
    return (
        <svg
            data-android-navigation-icon="back"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <polygon points="20,2 4,12 20,22" fill="currentColor" shapeRendering="geometricPrecision" />
        </svg>
    );
}
