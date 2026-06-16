import type { PreviewThemeMode } from '../../../../types';

export function Mobile2PreviewFooter({ themeMode }: { themeMode: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';

    const bg = isDark ? '#05090C' : '#F7F8FA';
    const color = isDark ? '#B8BABC' : '#777777';

    return (
        <div className="flex h-[50px] shrink-0 items-center justify-center gap-[95px]" style={{ backgroundColor: bg }}>
            {/* Triángulo Android */}
            <svg width="30" height="30" viewBox="0 0 34 34">
                <polygon points="25,6 5,17 25,28" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>

            {/* Círculo Android */}
            <svg width="30" height="30" viewBox="0 0 34 34">
                <circle cx="17" cy="17" r="10.8" fill="none" stroke={color} strokeWidth="2" />
            </svg>

            {/* Cuadrado Android */}
            <svg width="30" height="30" viewBox="0 0 34 34">
                <rect x="7.5" y="7.5" width="19" height="19" rx="0.8" fill="none" stroke={color} strokeWidth="2" />
            </svg>
        </div>
    );
}
