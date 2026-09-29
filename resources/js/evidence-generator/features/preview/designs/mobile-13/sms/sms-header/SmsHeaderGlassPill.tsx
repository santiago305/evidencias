import type { CSSProperties, HTMLAttributes } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';

type SmsHeaderGlassPillProps = HTMLAttributes<HTMLDivElement> & {
    contentClassName?: string;
    darkComposerMaterial?: boolean;
    opaqueSurface?: boolean;
    themeMode: PreviewThemeMode;
};

export function SmsHeaderGlassPill({ children, className = '', contentClassName = '', darkComposerMaterial = false, opaqueSurface = false, themeMode, style, ...props }: SmsHeaderGlassPillProps) {
    const isDark = themeMode === 'dark';
    const darkSurface: CSSProperties = {
        background: 'linear-gradient(180deg, rgba(38,38,40,0.78) 0%, rgba(30,30,32,0.78) 45%, rgba(32,32,34,0.78) 100%)',
        backdropFilter: 'blur(12px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.05)',
        borderColor: 'rgba(255,255,255,0.10)',
        boxShadow: ['inset 0 1px 0 rgba(255,255,255,0.045)', 'inset 0 -1px 0 rgba(255,255,255,0.035)'].join(', '),
    };
    const lightSurface: CSSProperties = {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.46) 0%, rgba(254,254,255,0.40) 45%, rgba(249,249,251,0.34) 100%)',
        backdropFilter: 'blur(4px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.05)',
        borderColor: 'rgba(165,173,184,0.24)',
        boxShadow: ['inset 0 1px 0 rgba(255,255,255,0.60)', 'inset 0 -1px 0 rgba(175,185,198,0.10)'].join(', '),
    };
    const darkComposerSurface: CSSProperties = {
        background: 'linear-gradient(180deg, rgba(37,37,39,0.58) 0%, rgba(31,31,33,0.52) 50%, rgba(35,35,37,0.46) 100%)',
        backdropFilter: 'blur(10px) saturate(1.02)',
        WebkitBackdropFilter: 'blur(4px) saturate(1.02)',
        borderColor: 'rgba(148,148,152,0.18)',
        boxShadow: ['inset 0 1px 0 rgba(255,255,255,0.035)', 'inset 0 -1px 0 rgba(255,255,255,0.025)'].join(', '),
    };
    const darkDenseGlass: CSSProperties = {
        background: 'linear-gradient(180deg, rgba(19,19,21,0.88) 0%, rgba(12,12,14,0.86) 55%, rgba(15,15,17,0.84) 100%)',
        backdropFilter: 'blur(16px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.05)',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: ['inset 0 1px 0 rgba(255,255,255,0.035)', 'inset 0 -1px 0 rgba(255,255,255,0.025)'].join(', '),
    };
    const lightDenseGlass: CSSProperties = {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.84) 55%, rgba(250,250,252,0.82) 100%)',
        backdropFilter: 'blur(16px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.05)',
        borderColor: 'rgba(165,173,184,0.16)',
        boxShadow: ['inset 0 1px 0 rgba(255,255,255,0.48)', 'inset 0 -1px 0 rgba(175,185,198,0.08)'].join(', '),
    };
    const resolvedSurface = opaqueSurface
        ? isDark
            ? darkDenseGlass
            : lightDenseGlass
        : isDark && darkComposerMaterial
          ? darkComposerSurface
          : isDark
            ? darkSurface
            : lightSurface;
    const reflectionOpacity = opaqueSurface ? 0.65 : 1;
    const topReflection = isDark
        ? `linear-gradient(180deg, rgba(255,255,255,${(0.055 * reflectionOpacity).toFixed(3)}) 0%, rgba(255,255,255,${(0.015 * reflectionOpacity).toFixed(3)}) 55%, transparent 100%)`
        : `linear-gradient(180deg, rgba(255,255,255,${(0.58 * reflectionOpacity).toFixed(3)}) 0%, rgba(255,255,255,${(0.18 * reflectionOpacity).toFixed(3)}) 55%, transparent 100%)`;
    const bottomReflection = isDark
        ? `linear-gradient(0deg, rgba(255,255,255,${(0.045 * reflectionOpacity).toFixed(3)}) 0%, rgba(255,255,255,${(0.012 * reflectionOpacity).toFixed(3)}) 55%, transparent 100%)`
        : `linear-gradient(0deg, rgba(255,255,255,${(0.45 * reflectionOpacity).toFixed(3)}) 0%, rgba(255,255,255,${(0.12 * reflectionOpacity).toFixed(3)}) 55%, transparent 100%)`;

    return (
        <div {...props} className={`relative isolate overflow-hidden rounded-full border ${className}`} style={{ ...resolvedSurface, ...style }}>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[1px] left-1/2 h-[3px] w-[68%] -translate-x-1/2 rounded-full"
                style={{ background: topReflection }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[1px] left-1/2 h-[3px] w-[68%] -translate-x-1/2 rounded-full"
                style={{ background: bottomReflection }}
            />
            <div className={`relative z-[1] h-full min-w-0 ${contentClassName}`}>{children}</div>
        </div>
    );
}
