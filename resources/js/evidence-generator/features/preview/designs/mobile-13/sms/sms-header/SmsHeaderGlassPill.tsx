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
    const surface: CSSProperties = isDark
        ? {
              backgroundColor: 'rgba(30,30,32,0.78)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderColor: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.14), inset 0 -0.5px 0.5px rgba(255,255,255,0.10), inset 0.5px 0 0.5px rgba(255,255,255,0.07), inset -0.5px 0 0.5px rgba(255,255,255,0.07)',
          }
        : {
              background:
                  'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(254,254,255,0.72) 32%, rgba(249,249,251,0.68) 76%, rgba(255,255,255,70.76) 100%)',
              borderColor: 'rgba(165,173,184,0.30)',
              boxShadow: '0 2px 4px rgba(58,66,78,0.045), inset 0 1px 0 rgba(255,255,255,0.98), inset 0 -1px 1px rgba(175,185,198,0.12)',
          };
        const darkComposerSurface: CSSProperties = {
            background: 'rgba(31, 31, 33, 0.80)',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderColor: 'rgba(255,255,255,0.06)',
            boxShadow:
                'inset 0 1px 1px rgba(255,255,255,0.10), inset 0 -1px 2px rgba(0,0,0,0.10)',
        };
    const opaqueSurfaceStyle: CSSProperties = isDark
        ? {
              backgroundColor: '#000000',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              boxShadow: 'none',
          }
        : {
              backgroundColor: '#FFFFFF',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              boxShadow: 'none',
          };
    const resolvedSurface = opaqueSurface ? opaqueSurfaceStyle : isDark && darkComposerMaterial ? darkComposerSurface : surface;

    return (
        <div {...props} className={`relative isolate overflow-hidden rounded-full border ${className}`} style={{ ...resolvedSurface, ...style }}>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[1px] left-1/2 h-[3px] w-[72%] -translate-x-1/2 rounded-full"
                style={{
                    background: opaqueSurface
                        ? 'none'
                        : isDark
                          ? 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 45%, transparent 100%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 45%, transparent 100%)',
                }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[1px] left-1/2 h-[2px] w-[72%] -translate-x-1/2 rounded-full"
                style={{
                    background: opaqueSurface
                        ? 'none'
                        : isDark
                          ? 'linear-gradient(0deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 55%, transparent 100%)'
                          : 'linear-gradient(0deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 55%, transparent 100%)',
                }}
            />
            <div className={`relative z-[1] h-full min-w-0 ${contentClassName}`}>{children}</div>
        </div>
    );
}
