import type { SVGProps } from 'react';

type Mobile7RecentsIconProps = SVGProps<SVGSVGElement>;

export function Mobile7RecentsIcon({ className, ...props }: Mobile7RecentsIconProps) {
    return (
        <svg
            data-android-navigation-icon="recents"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" shapeRendering="geometricPrecision" />
        </svg>
    );
}
