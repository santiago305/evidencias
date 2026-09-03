import type { PreviewThemeMode } from '../../../../types';
import { getSmsColors } from '../mobile-3/sms/smsAppearance';

export function Mobile1PreviewFooter({ themeMode }: { themeMode: PreviewThemeMode; variant?: 'default' | 'sms' }) {
    return <Mobile1SamsungNavigationFooter themeMode={themeMode} />;
}

function Mobile1SamsungNavigationFooter({ themeMode }: { themeMode: PreviewThemeMode }) {
    const colors = getSmsColors(themeMode, 'mobile-3');

    return (
        <nav className="flex h-[50px] shrink-0 items-center justify-center" style={{ backgroundColor: colors.conversation, color: colors.systemNavigationForeground }} aria-label="Navegación del sistema">
            <div className="mx-auto flex h-full w-[250px] items-center justify-between">
            <button type="button" className="flex h-full items-center justify-center" aria-label="Aplicaciones recientes">
                <svg viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill="none" aria-hidden="true">
                    <path d="M7 4.5V19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 4.5V19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M17 4.5V19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </button>
            <button type="button" className="flex h-full items-center justify-center" aria-label="Inicio">
                <svg viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill="none" aria-hidden="true">
                    <rect x="5" y="4.5" width="14" height="15" rx="4" stroke="currentColor" strokeWidth="1.9" />
                </svg>
            </button>
            <button type="button" className="flex h-full items-center justify-center" aria-label="Volver">
                <svg viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill="none" aria-hidden="true">
                    <path d="M15.5 4.5 8 12l7.5 7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            </div>
        </nav>
    );
}
