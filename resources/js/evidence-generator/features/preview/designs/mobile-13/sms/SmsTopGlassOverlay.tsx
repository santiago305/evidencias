import type { CSSProperties } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { SMS_BLUR_HEIGHT } from './smsHeaderLayout';

const progressiveMask = 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.35) 78%, transparent 100%)';

export function SmsTopGlassOverlay({ themeMode }: { themeMode: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const globalBlurStyle: CSSProperties = {
        pointerEvents: 'none',
        height: `${SMS_BLUR_HEIGHT}px`,
        backdropFilter: 'blur(16px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.05)',
        background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.12) 45%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.12) 45%, transparent 100%)',
        maskImage: progressiveMask,
        WebkitMaskImage: progressiveMask,
        boxShadow: 'none',
    };

    return <div aria-hidden="true" data-mobile13-sms-top-glass-overlay="true" className="pointer-events-none absolute inset-x-0 top-0 z-20" style={globalBlurStyle} />;
}
