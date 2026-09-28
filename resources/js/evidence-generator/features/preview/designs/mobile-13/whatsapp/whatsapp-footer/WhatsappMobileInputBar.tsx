import type { ReactNode } from 'react';
import { useState } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import { useWhatsappColorProfile } from '../whatsappColorProfile';

const MOBILE13_WHATSAPP_MICROPHONE_BACKGROUND = '#1EA961';
const MOBILE13_WHATSAPP_MICROPHONE_ICON = '#FFFFFF';

export function WhatsappMobileInputBar({
    themeMode = 'light',
    composerAccessory,
    composerLayout,
}: {
    themeMode?: PreviewThemeMode;
    composerAccessory?: ReactNode;
    composerLayout?: { messageAreaMaxWidth?: string };
}) {
    const isDark = themeMode === 'dark';
    const colors = useWhatsappColorProfile();
    const [messageValue, setMessageValue] = useState('');

    return (
        <div data-mobile13-whatsapp-composer="true" className={['px-[10px] py-[6px]', isDark ? 'bg-[#101010]' : 'bg-[#F4F1EC]'].join(' ')}>
            <div className="flex w-full items-center gap-[8px]">
                <button
                    type="button"
                    aria-label="Agregar"
                    className={[
                        'grid h-[34px] w-[26px] shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-1',
                        isDark
                            ? 'text-[#E9EDEF] focus-visible:outline-white active:bg-white/10'
                            : 'text-[#111B21] focus-visible:outline-black active:bg-black/5',
                    ].join(' ')}
                >
                    <svg viewBox="0 0 24 24" className="h-[25px] w-[25px]" fill="none" aria-hidden="true">
                        <path d="M12 4V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                        <path d="M4 12H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                </button>

                <div
                    data-mobile13-whatsapp-message-input="true"
                    className={[
                        'flex h-[30px] min-w-0 flex-1 items-center rounded-full border px-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
                        colors ? '' : isDark ? 'border-black/10 bg-[#282828] text-[#E9EDEF]' : 'border-black/10 bg-white text-[#111B21]',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    style={colors ? { backgroundColor: colors.composerBackground, color: colors.composerText } : undefined}
                >
                    <input
                        aria-label="Mensaje"
                        autoComplete="off"
                        className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-current outline-none"
                        spellCheck={false}
                        style={{ maxWidth: composerLayout?.messageAreaMaxWidth }}
                        type="text"
                        value={messageValue}
                        onChange={(event) => setMessageValue(event.target.value)}
                    />

                    <button
                        type="button"
                        aria-label="Sticker"
                        className="ml-[22px] grid h-[30px] w-[30px] shrink-0 translate-x-2 place-items-center rounded-full text-current transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 active:bg-black/5"
                    >
                        <svg viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill="none" aria-hidden="true">
                            <path
                                d="M7.5 4.5H15.2C17.6 4.5 19.5 6.4 19.5 8.8V13.2C19.5 16.7 16.7 19.5 13.2 19.5H8.8C6.4 19.5 4.5 17.6 4.5 15.2V7.5C4.5 5.8 5.8 4.5 7.5 4.5Z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13.2 19.5V16.4C13.2 14.6 14.6 13.2 16.4 13.2H19.5"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <button
                    type="button"
                    aria-label="Cámara"
                    className={[
                        "grid h-[34px] w-[30px] shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-1",
                        isDark
                        ? "text-[#E9EDEF] focus-visible:outline-white active:bg-white/10"
                        : "text-[#111B21] focus-visible:outline-black active:bg-black/5",
                    ].join(" ")}
                    >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-[25px] w-[28px]"
                        fill="none"
                        aria-hidden="true"
                    >
                        {/* Cuerpo de la cámara */}
                        <path
                        d="
                            M7.4 6.5
                            L8.8 4.8
                            H15.2
                            L16.6 6.5
                            H19

                            C20.1 6.5 21 7.4 21 8.5

                            V18

                            C21 19.1 20.1 20 19 20

                            H5

                            C3.9 20 3 19.1 3 18

                            V8.5

                            C3 7.4 3.9 6.5 5 6.5

                            H7.4
                            Z
                        "
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />

                        {/* Lente */}
                        <circle
                        cx="12"
                        cy="13.25"
                        r="3.9"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        />

                        {/* Punto superior derecho */}
                        <circle
                        cx="17.25"
                        cy="9.15"
                        r="0.72"
                        fill="currentColor"
                        />
                    </svg>
                    </button>
                {composerAccessory}

                <button
                    type="button"
                    aria-label="Mensaje de voz"
                    className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full text-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1EA961] active:opacity-85"
                    style={{ backgroundColor: MOBILE13_WHATSAPP_MICROPHONE_BACKGROUND, color: MOBILE13_WHATSAPP_MICROPHONE_ICON }}
                >
                    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" aria-hidden="true">
                        <rect x="9.9" y="4" width="4" height="10" rx="2.5" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
                        <path
                            d="M6.8 11.5C6.8 14.4 9.1 16.7 12 16.7C14.9 16.7 17.2 14.4 17.2 11.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                        <path d="M12 16.7V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
