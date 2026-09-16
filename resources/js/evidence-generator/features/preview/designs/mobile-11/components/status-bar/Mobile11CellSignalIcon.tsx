import type { SVGProps } from 'react';

type Mobile11CellSignalIconProps = SVGProps<SVGSVGElement>;

export function Mobile11CellSignalIcon({ className, ...props }: Mobile11CellSignalIconProps) {
    return (
        <svg viewBox="0 0 32 24" fill="none" className={className} aria-hidden="true" {...props}>
            <text x="0" y="14" fill="currentColor" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="400" letterSpacing="-0.5">
                4G
            </text>
            <path d="M3.2 15.5V20" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
            <path d="M1.8 18.45L3.2 20L4.6 18.45" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.1 20V15.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
            <path d="M5.7 17.05L7.1 15.5L8.5 17.05" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="14" y="16.5" width="2" height="5.5" rx="1.15" fill="currentColor" />
            <rect x="18.6" y="13" width="2" height="9" rx="1.15" fill="currentColor" />
            <rect x="23.2" y="9.5" width="2" height="12.5" rx="1.15" fill="currentColor" />
            <rect x="27.8" y="6" width="2" height="16" rx="1.15" fill="currentColor" />
        </svg>
    );
}
