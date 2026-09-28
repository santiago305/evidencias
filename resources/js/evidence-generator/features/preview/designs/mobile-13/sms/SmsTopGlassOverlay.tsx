import type { CSSProperties } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { SMS_BLUR_HEIGHT } from './smsHeaderLayout';

const progressiveMask = 'linear-gradient(to bottom, black 0%, black 35%, rgba(0,0,0,0.80) 53%, rgba(0,0,0,0.20) 78%, transparent 100%)';

export function SmsTopGlassOverlay({ themeMode }: { themeMode: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const style: CSSProperties = {
        height: `${SMS_BLUR_HEIGHT}px`,
        backdropFilter: isDark ? 'blur(16px) saturate(1.05)' : 'blur(14px) saturate(1.02)',
        WebkitBackdropFilter: isDark ? 'blur(16px) saturate(1.05)' : 'blur(14px) saturate(1.02)',
        background: isDark
            ? 'linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 55%, transparent 100%)',
        maskImage: progressiveMask,
        WebkitMaskImage: progressiveMask,
    };

    return <div aria-hidden="true" data-mobile13-sms-top-glass-overlay="true" className="pointer-events-none absolute inset-x-0 top-0 z-20" style={style} />;
}
