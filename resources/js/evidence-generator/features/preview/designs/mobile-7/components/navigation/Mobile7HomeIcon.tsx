import type { SVGProps } from 'react';

type Mobile7HomeIconProps = SVGProps<SVGSVGElement>;

export function Mobile7HomeIcon({ className, ...props }: Mobile7HomeIconProps) {
    return (
        <svg
            data-android-navigation-icon="home"
            width="21"
            height="21"
            viewBox="0 0 26 26"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <circle cx="13" cy="13" r="11.5" fill="none" stroke="currentColor" strokeWidth="2.3" shapeRendering="geometricPrecision" />
            <g transform="translate(1 1)">
                <circle cx="12" cy="12" r="6.2" fill="currentColor" />
                <circle
                    cx="12"
                    cy="12"
                    r="6.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    shapeRendering="geometricPrecision"
                />
            </g>
        </svg>
    );
}
