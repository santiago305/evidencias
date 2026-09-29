import type { CSSProperties } from 'react';
import type { PreviewThemeMode } from '../../../../../types';

const progressiveMask = `
    linear-gradient(
        to bottom,
        black 0%,
        black 25%,
        rgba(0,0,0,0.75) 50%,
        rgba(0,0,0,0.25) 78%,
        transparent 100%
    )
`;

const blurLayerStyle: CSSProperties = {
    backdropFilter: 'blur(18px) saturate(1.05)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.05)',
    maskImage: progressiveMask,
    WebkitMaskImage: progressiveMask,
    pointerEvents: 'none',
};

const lightGradientStyle: CSSProperties = {
    background: `
        linear-gradient(
            to bottom,
            rgba(255,255,255,0.70) 0%,
            rgba(255,255,255,0.5) 30%,
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0.1) 75%,
            rgba(255,255,255,0) 100%
        )
    `,
    pointerEvents: 'none',
};

const darkGradientStyle: CSSProperties = {
    background: `
        linear-gradient(
            to bottom,
            rgba(0,0,0,0.70) 0%,
            rgba(0,0,0,0.5) 30%,
            rgba(0,0,0,0.3) 50%,
            rgba(0,0,0,0.1) 75%,
            rgba(0,0,0,0) 100%
        )
    `,
    pointerEvents: 'none',
};

export function SmsTopGlassOverlay({ themeMode }: { themeMode: PreviewThemeMode }) {
    const gradientStyle = themeMode === 'dark' ? darkGradientStyle : lightGradientStyle;

    return (
        <div aria-hidden="true" data-mobile13-sms-top-glass-overlay="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[145px]">
            <div aria-hidden="true" data-mobile13-sms-blur-layer="true" className="pointer-events-none absolute inset-0" style={blurLayerStyle} />
            <div aria-hidden="true" data-mobile13-sms-gradient-layer="true" className="pointer-events-none absolute inset-0" style={gradientStyle} />
        </div>
    );
}
