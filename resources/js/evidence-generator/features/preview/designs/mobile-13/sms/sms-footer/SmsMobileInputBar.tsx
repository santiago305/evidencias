import { useState } from 'react';
import { SmsHeaderGlassPill } from '../sms-header/SmsHeaderGlassPill';
import { shouldShowSmsAccentPoint } from '../smsAppearance';
import { getMobile13SmsContentColors } from '../smsContentAppearance';

export function SmsMobileInputBar({
    themeMode,
    draft = '',
    onDraftChange,
    composerLayout,
    onInputFocusChange,
}: {
    themeMode: 'light' | 'dark';
    draft?: string;
    onDraftChange?: (value: string) => void;
    onInputFocusChange?: (isFocused: boolean) => void;
    composerLayout?: {
        messageAreaMaxWidth?: string;
    };
}) {
    const colors = getMobile13SmsContentColors(themeMode);
    const isDark = themeMode === 'dark';
    const audioIconColor = isDark ? '#858585' : '#B8B8B8';
    const [showEmojiIndicator] = useState(() => shouldShowSmsAccentPoint());

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pt-1.5 pb-2.5">
            <div className="relative flex h-[76px] items-center">
                {/* =====================================================
                    BOTÓN +
                ===================================================== */}
                <SmsHeaderGlassPill
                    themeMode={themeMode}
                    darkComposerMaterial
                    contentClassName="w-full"
                    className="pointer-events-auto absolute top-[10px] left-3 z-30 size-[40px] h-[35px] w-[35px]"
                >
                    <button
                        type="button"
                        className="flex h-full w-full items-center justify-center rounded-full"
                        style={{ color: isDark ? "#ffffff" : colors.primaryText }}
                        aria-label="Agregar"
                    >
                        <svg viewBox="0 0 32 32" className="size-[30px]" fill="none" aria-hidden="true">
                            <path d="M16 9v14M9 16h14" stroke="currentColor" strokeWidth={isDark ? "1.5" : "1"} strokeLinecap="round" />
                        </svg>
                    </button>
                </SmsHeaderGlassPill>

                {/* =====================================================
                    CAMPO DE MENSAJE
                ===================================================== */}
                <SmsHeaderGlassPill
                    themeMode={themeMode}
                    darkComposerMaterial
                    contentClassName="w-full"
                    className="pointer-events-auto absolute top-7 right-0 left-[22px] z-20 flex h-[36px] w-[265px] -translate-y-1/2 items-center rounded-full pr-[58px] pl-[15px]"
                >
                    <div className="relative flex h-full w-full items-center">
                        {/* =================================================
                            PLACEHOLDER VISUAL PERSONALIZADO

                            Se utiliza un placeholder visual en lugar del
                            atributo placeholder del input porque necesitamos
                            controlar independientemente el tamaño del punto.
                        ================================================= */}
                        {!draft && (
                            <div
                                className={[
                                    'pointer-events-none absolute inset-y-0 left-px',
                                    'flex items-center',
                                    'text-[13.7px] tracking-[-0.12px]',
                                    isDark ? 'text-[#777777]' : 'text-[#B8B8B8]',
                                ].join(' ')}
                                aria-hidden="true"
                            >
                                <span>Mensaje de texto</span>

                                <span
                                    className="mx-[4px] inline-block text-[11px] leading-none"
                                    style={{
                                        transform: 'translateY(-0.5px)',
                                    }}
                                >
                                    •
                                </span>

                                <span>SMS</span>
                            </div>
                        )}

                        {/* =================================================
                            INPUT REAL
                        ================================================= */}
                        <input
                            value={draft}
                            onFocus={() => onInputFocusChange?.(true)}
                            onBlur={() => onInputFocusChange?.(false)}
                            onChange={(event) => onDraftChange?.(event.target.value)}
                            placeholder=""
                            aria-label="Mensaje de texto • SMS"
                            className={['min-w-0 flex-1 bg-transparent pl-px', 'text-[15.7px]', 'tracking-[-0.12px]', 'outline-none'].join(' ')}
                            style={{
                                color: colors.primaryText,
                                caretColor: colors.primaryText,
                                maxWidth: composerLayout?.messageAreaMaxWidth,
                            }}
                        />

                        {/* ==========================================
                            EMOJI
                            ========================================== */}
                        <button
                            type="button"
                            className="hidden"
                            style={{
                                color: colors.headerIcon,
                            }}
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

                                {/* Indicador */}
                                {showEmojiIndicator ? (
                                    <>
                                        <circle cx="22.7" cy="8.3" r="3.95" fill={colors.composer} stroke="none" />

                                        <circle cx="22.7" cy="8.3" r="3.45" fill={colors.tealPoint} stroke="none" />
                                    </>
                                ) : null}
                            </svg>
                        </button>

                        {/* ==========================================
                            GALERÍA
                            ========================================== */}
                        <button
                            type="button"
                            className="hidden"
                            style={{
                                color: colors.headerIcon,
                            }}
                            aria-label="Galeria"
                        >
                            <svg viewBox="0 0 32 32" className="size-[30px]" fill="none" aria-hidden="true">
                                <rect x="5" y="5" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="2.1" />

                                <circle cx="11" cy="11" r="2.15" fill="currentColor" />

                                <path d="m7 24 4.4-5.4c.4-.5 1-.5 1.4 0l4.1 5.4 2.1-7.6c.4-.5 1.1-.5 1.5 0l5.5 7.6Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </SmsHeaderGlassPill>

                {/* =====================================================
                    ICONO DE AUDIO
                ===================================================== */}
                <button
                    type="button"
                    className="pointer-events-auto absolute top-12 right-[14px] z-30 flex size-[40px] -translate-y-1/2 items-center justify-center"
                    style={{
                        color: audioIconColor,
                    }}
                    aria-label="Mensaje de voz"
                >
                    <svg viewBox="0 0 30 30" className="size-[25px]" fill="currentColor" aria-hidden="true">
                        {[3, 7, 11, 15, 19, 23].map((x, index) => (
                            <rect key={x} x={x} y={[12, 9, 6, 8, 10, 12][index]} width="2.2" height={[6, 12, 18, 14, 10, 6][index]} rx="1.1" />
                        ))}
                    </svg>
                </button>
            </div>
        </div>
    );
}
