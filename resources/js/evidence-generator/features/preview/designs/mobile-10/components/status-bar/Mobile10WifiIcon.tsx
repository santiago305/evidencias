import type { SVGProps } from 'react';

type Mobile10WifiIconProps = SVGProps<SVGSVGElement>;

export function Mobile10WifiIcon({ className, ...props }: Mobile10WifiIconProps) {
    return (
        <svg viewBox="0 -2 30 18" fill="none" className={className} aria-hidden="true" {...props}>
            <path d="M2.2 4.65 C4.65 2.55 7.65 1.45 11 1.45 C14.35 1.45 17.35 2.55 19.8 4.65" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.65 7.25 C6.35 5.8 8.55 5.05 11 5.05 C13.45 5.05 15.65 5.8 17.35 7.25" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.15 9.85 C8.2 8.95 9.55 8.5 11 8.5 C12.45 8.5 13.8 8.95 14.85 9.85" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="11" cy="12.55" r="1.65" fill="currentColor" />
            <path d="M18.05 10V13.4M18.05 13.4L17.05 12.45M18.05 13.4L18.05 12.15" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.05 12.45L18.05 13.4L18.05 12.15" fill="currentColor" stroke="currentColor" strokeWidth="0.18" strokeLinejoin="round" />
            <path d="M21.15 13.4V10M21.15 10L22.15 10.95M21.15 10L21.15 11.25" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22.15 10.95L21.15 10L21.15 11.25" fill="currentColor" stroke="currentColor" strokeWidth="0.18" strokeLinejoin="round" />
        </svg>
    );
}
