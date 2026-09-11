import type { SVGProps } from 'react';

type Mobile7SmsSaveContactIconProps = SVGProps<SVGSVGElement> & {
    accentColor?: string;
    foregroundColor?: string;
};

export function Mobile7SmsSaveContactIcon({
    className,
    accentColor = '#4D5C93',
    foregroundColor = '#FFFFFF',
    ...props
}: Mobile7SmsSaveContactIconProps) {
    return (
        <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true" {...props}>
            <circle cx="22" cy="22" r="22" fill={accentColor} />
            <circle cx="18.5" cy="17.5" r="4.25" fill={foregroundColor} />
            <path
                d="
                    M10.75 32.25
                    H25.95
                    C26.85 32.25 27.5 31.6 27.5 30.75
                    V30.25
                    C27.5 26.35 24.55 23.75 18.5 23.75
                    C12.45 23.75 9.5 26.35 9.5 30.25
                    V30.75
                    C9.5 31.6 10.15 32.25 10.75 32.25
                    Z
                "
                fill={foregroundColor}
            />
            <path d="M30.25 16.5V23.5" stroke={foregroundColor} strokeWidth="2.35" strokeLinecap="round" />
            <path d="M26.75 20H33.75" stroke={foregroundColor} strokeWidth="2.35" strokeLinecap="round" />
        </svg>
    );
}
