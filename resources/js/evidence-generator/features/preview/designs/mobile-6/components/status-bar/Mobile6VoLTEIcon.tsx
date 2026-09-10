import type { SVGProps } from 'react';

type Mobile6VoLTEIconProps = SVGProps<SVGSVGElement> & {
    inverted?: boolean;
};

export function Mobile6VoLTEIcon({ inverted = false, ...props }: Mobile6VoLTEIconProps) {
    return (
        <svg viewBox="0 0 29 17" fill="none" aria-hidden="true" {...props}>
            <rect width="26" height="17" rx="2" fill={inverted ? '#F4F4F4' : 'currentColor'} />
            <text
                x="12.20"
                y="11.5"
                textAnchor="middle"
                fill={inverted ? '#1E1F24' : '#EDEDED'}
                fontFamily="Arial, sans-serif"
                fontSize={inverted ? "7.7" : "7.2"}
                fontWeight="700"
                letterSpacing="-0.28"
                transform="translate(13 8.5) scale(1 1.55) translate(-13 -8.5)"
            >
                VoLTE
            </text>
        </svg>
    );
}
