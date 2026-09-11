import type { PreviewThemeMode } from '../../../../../../types';

export function Mobile7QuickActionButton({
    themeMode = 'light',
}: {
    themeMode?: PreviewThemeMode;
}) {
    const isDark = themeMode === 'dark';

    const background = isDark ? '#202C33' : '#FFFFFF';
    const foreground = isDark ? '#AEBAC1' : '#5D6266';

    return (
        <button
            type="button"
            aria-label="Acción rápida"
            className="grid h-[35px] w-[35px] place-items-center rounded-full"
        >
            <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M14 2.5 L6.25 12.65 L10.25 12.65 L9.45 21.5 L17.75 10.85 L13.65 10.85 Z"
                    fill={background}
                    stroke={foreground}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}
