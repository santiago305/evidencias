import { useState } from 'react';
import { getSmsColors, shouldShowSmsAccentPoint } from '../smsAppearance';

export function SmsMobileInputBar({ themeMode }: { themeMode: 'light' | 'dark' }) {
    const colors = getSmsColors(themeMode);
    const [showEmojiIndicator] = useState(() => shouldShowSmsAccentPoint());

    return (
        <div className="shrink-0 px-2 pt-1.5 pb-2.5" style={{ backgroundColor: colors.conversation }}>
            <div className="flex items-end gap-[7px]">
                <div className="flex min-h-[54px] flex-1 items-center rounded-[29px] px-[11px]" style={{ backgroundColor: colors.composer }}>
                    <button
                        type="button"
                        className="mr-[7px] flex size-9 shrink-0 items-center justify-center"
                        style={{ color: colors.headerIcon }}
                        aria-label="Agregar"
                    >
                        <svg viewBox="0 0 32 32" className="size-[30px]" fill="none" aria-hidden="true">
                            <circle cx="15" cy="16" r="10" stroke="currentColor" strokeWidth="2.1" />
                            <path d="M15 11v10M10 16h10" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
                            <circle cx="22.2" cy="8.8" r="4.05" fill={colors.composer} />
                            <circle cx="22.2" cy="8.8" r="3.55" fill={colors.tealPoint} />
                        </svg>
                    </button>
                    <div className="min-w-0 flex-1 truncate pl-px text-[15.7px] tracking-[-0.12px]" style={{ color: colors.secondaryText }}>
                        Mensaje RCS
                    </div>
                    {/* ==========================================
                            EMOJI
                        ========================================== */}
                    <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center"
                        style={{
                            color: colors.headerIcon,
                        }}
                        aria-label="Emoji"
                    >
                        <svg
                            viewBox="0 0 32 32"
                            className="h-[30px] w-[30px]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* Cara */}
                            <circle cx="15" cy="16" r="10.8" />

                            {/* Ojo izquierdo */}
                            <circle cx="11.4" cy="12.8" r="1.3" fill="currentColor" stroke="none" />

                            {/* Ojo derecho */}
                            <circle cx="18.6" cy="12.8" r="1.3" fill="currentColor" stroke="none" />

                            {/* Sonrisa */}
                            <path
                                d="
                                        M10.2 18.1
                                        C11.35 20.3
                                        13.05 21.3
                                        15.15 21.3
                                        C17.2 21.3
                                        18.95 20.3
                                        20.1 18.1
                                    "
                            />

                            {/* máscara */}
                            {showEmojiIndicator ? (
                                <>
                                    <circle cx="22.7" cy="8.3" r="3.95" fill={colors.composer} stroke="none" />

                                    {/* punto turquesa */}
                                    <circle cx="22.7" cy="8.3" r="3.45" fill={colors.tealPoint} stroke="none" />
                                </>
                            ) : null}
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="ml-0.5 flex size-9 shrink-0 items-center justify-center"
                        style={{ color: colors.headerIcon }}
                        aria-label="Galería"
                    >
                        <svg viewBox="0 0 32 32" className="size-[30px]" fill="none" aria-hidden="true">
                            <rect x="5" y="5" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="2.1" />
                            <circle cx="11" cy="11" r="2.15" fill="currentColor" />
                            <path d="m7 24 4.4-5.4c.4-.5 1-.5 1.4 0l4.1 5.4 2.1-7.6c.4-.5 1.1-.5 1.5 0l5.5 7.6Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>
                <button
                    type="button"
                    className="flex size-[54px] shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.audioBackground, color: colors.audioIcon }}
                    aria-label="Mensaje de voz"
                >
                    <svg viewBox="0 0 30 30" className="size-[27px]" fill="currentColor" aria-hidden="true">
                        {[3, 7, 11, 15, 19, 23].map((x, index) => (
                            <rect key={x} x={x} y={[12, 9, 6, 8, 10, 12][index]} width="2.2" height={[6, 12, 18, 14, 10, 6][index]} rx="1.1" />
                        ))}
                    </svg>
                </button>
            </div>
        </div>
    );
}
