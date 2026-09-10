import type { SVGProps } from 'react';

type Mobile6WifiIconProps = SVGProps<SVGSVGElement>;

export function Mobile6WifiIcon({
    className,
    ...props
}: Mobile6WifiIconProps) {
    return (
        <svg
            viewBox="0 0 22 18"
            fill="none"
            className={className}
            aria-hidden="true"
            {...props}
        >
            <path
                d="M2.15 6.1C4.38 4.26 7.42 3.15 11 3.15C14.58 3.15 17.62 4.26 19.85 6.1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M4.95 9.08C6.55 7.78 8.66 7 11 7C13.34 7 15.45 7.78 17.05 9.08"
                stroke="currentColor"
                strokeWidth="2.10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M7.9 12.02C8.74 11.37 9.83 10.96 11 10.96C12.17 10.96 13.26 11.37 14.1 12.02"
                stroke="currentColor"
                strokeWidth="2.10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle
                cx="11"
                cy="14.85"
                r="1.9"
                fill="currentColor"
            />
        </svg>
    );
}
