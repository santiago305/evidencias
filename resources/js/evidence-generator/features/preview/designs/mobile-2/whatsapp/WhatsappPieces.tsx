import React from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { WhatsappMobileTextBubble } from './whatsapp-bubbles/WhatsappMobileTextBubble';

export function MessageGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`mb-5 space-y-[2.5px] ${className}`}>{children}</div>;
}

export function DayChip({ text, themeMode = 'light' }: { text: string; themeMode?: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';

    return (
        <div className="sticky top-[2.5px] z-20 my-[5px] flex justify-center">
            <span
                className={[
                    'rounded-[5px] px-2.5 py-[2.5px] text-[15px] font-medium shadow',
                    isDark ? 'bg-[#12181C] text-[#767C80]' : 'bg-[#fefdfc] text-[#667781]',
                ].join(' ')}
            >
                {text}
            </span>
        </div>
    );
}

export function IncomingBubble({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-start">
            <div className="max-w-[85%] rounded-[20px] rounded-tl-[5px] border border-black/5 bg-white px-[15px] py-2.5 text-[15px] text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                {children}
            </div>
        </div>
    );
}

export function OutgoingBubble({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[85%] rounded-[20px] rounded-tr-[5px] border border-black/5 bg-[#d9fdd3] px-[15px] py-2.5 text-[15px] text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                {children}
            </div>
        </div>
    );
}

export function BubbleTitle({ children }: { children: React.ReactNode }) {
    return <div className="mb-[5px] text-[15px] font-semibold">{children}</div>;
}

export function BubbleRow({ k, v }: { k: string; v: string }) {
    const value = v?.trim() ? v : '—';
    return (
        <div className="flex items-baseline justify-between gap-[15px]">
            <span className="text-[13.75px] text-slate-700">{k}</span>
            <span className="max-w-[60%] truncate text-[13.75px] font-medium text-slate-900">{value}</span>
        </div>
    );
}

export function PanelItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[15px] border border-black/5 bg-white px-[12.5px] py-2.5">
            <div className="text-[12.5px] text-slate-500">{label}</div>
            <div className="truncate text-[13.75px] font-semibold text-slate-900">{value?.trim() ? value : '—'}</div>
        </div>
    );
}

export type MsgStatus = 'sent' | 'delivered' | 'read';

export type QuotedMessage = {
    author: string;
    text: string;
    accentClassName?: string;
    accentColor?: string;
    authorColor?: string;
};

export function Bubble({
    side,
    firstInGroup,
    time,
    status,
    id,
    quote,
    themeMode = 'light',
    children,
}: {
    side: 'in' | 'out';
    firstInGroup?: boolean;
    time?: string;
    status?: MsgStatus;
    id?: string;
    quote?: QuotedMessage;
    themeMode?: PreviewThemeMode;
    children: React.ReactNode;
}) {
    return (
        <WhatsappMobileTextBubble firstInGroup={firstInGroup} id={id} quote={quote} side={side} status={status} themeMode={themeMode} time={time}>
            {children}
        </WhatsappMobileTextBubble>
    );
}
export function VoiceBubble({
    side,
    firstInGroup,
    time,
    status,
    duration = '0:23',
    showAvatar = false,
    themeMode = 'light',
}: {
    side: 'in' | 'out';
    firstInGroup?: boolean;
    time?: string;
    status?: MsgStatus;
    duration?: string;
    showAvatar?: boolean;
    themeMode?: PreviewThemeMode;
}) {
    const isOut = side === 'out';

    return (
        <Bubble side={side} firstInGroup={firstInGroup} time={time} status={status} themeMode={themeMode}>
            <div className="flex items-center gap-2.5">
                {/* Play */}
                <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10" type="button" aria-label="Play">
                    <svg width="17.5" height="17.5" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M6 4.5v7l6-3.5z" />
                    </svg>
                </button>

                {/* Wave */}
                <div className="min-w-[150px] flex-1">
                    <div className="relative h-[15px] overflow-hidden rounded-full bg-black/10">
                        <div className="absolute top-0 left-0 h-full w-[35%] bg-black/20" />
                    </div>
                    <div className="mt-[5px] text-[12.5px] text-[#667781]">{duration}</div>
                </div>

                {/* Avatar (incoming style) */}
                {showAvatar && !isOut && <div className="h-[45px] w-[45px] shrink-0 rounded-full bg-black/10" />}
            </div>
        </Bubble>
    );
}

export function EncryptedMessage({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const encryptedTextSize = 'text-[13.75px] leading-[15px]';
    const horizontalPadding = 'px-10';
    const maxWidth = 'max-w-none';

    return (
        <div className="relative">
            <div>
                <div className="relative pb-2.5">
                    <div className="flex justify-center">
                        <div>
                            <div className={`mx-auto flex ${maxWidth} flex-col justify-center ${horizontalPadding}`}>
                                <span></span>

                                <div
                                    className={[
                                        'relative mb-0 box-border inline-block max-w-full flex-none rounded-[9.1875px] px-[15px] pt-[5px] pb-[6.25px] text-center text-[13.75px] leading-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
                                        isDark ? 'bg-[#12181C] text-[#EECC84]' : 'bg-[#FFF0D4] text-black/60',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 rounded-[9.1875px]">
                                        <div className="cursorpointer">
                                            <span>
                                                <div
                                                    className={[
                                                        'me-[2.5px] inline-block align-top',
                                                        isDark ? 'text-[#EECC84]' : 'text-black/60',
                                                    ].join(' ')}
                                                >
                                                    <span aria-hidden="true" data-icon="lock-small">
                                                        <svg
                                                            viewBox="0 0 10 12"
                                                            height="11.25"
                                                            width="10"
                                                            preserveAspectRatio="xMidYMid meet"
                                                            version="1.1"
                                                        >
                                                            <title>lock-small</title>
                                                            <path
                                                                d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z"
                                                                fill="currentColor"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>

                                                <span className={`visible min-h-0 wrap-break-word ${encryptedTextSize}`}>
                                                    Los mensajes y las llamadas están cifrados de extremo a extremo. Solo las personas en este chat
                                                    pueden leerlos, escucharlos o compartirlos.{' '}
                                                    <strong className="font-semibold">Más información.</strong>
                                                </span>
                                            </span>
                                        </div>

                                        <span></span>
                                        <div></div>
                                    </div>

                                    <div className="absolute top-1/2 order-0 -mt-[16.25px] flex min-h-0 w-[126.25px] min-w-0 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-[5px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export function TempporalMessage({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const horizontalPadding = 'px-10';
    const maxWidth = 'max-w-none';
    const messageTextSize = 'text-[13.75px] leading-[15px]';

    return (
        <div className="relative">
            <div>
                <div className="relative pb-2.5">
                    <div className="flex justify-center">
                        <div>
                            <div className={`mx-auto flex ${maxWidth} flex-col justify-center ${horizontalPadding}`}>
                                <span></span>

                                <div
                                    className={[
                                        'relative mb-0 box-border inline-block max-w-full flex-none rounded-[9.1875px] px-[15px] pt-[5px] pb-[6.25px] text-center text-[12.5px] leading-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
                                        isDark ? 'bg-[#12181C] text-[#767C80]' : 'bg-[#fefdfc] text-[#667781]',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 rounded-[9.1875px]">
                                        <div className="cursorpointer">
                                            <span>
                                                <div className="me-[2.5px] inline-block align-top">
                                                    <span aria-hidden="true" data-icon="lock-small">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            height={11.25}
                                                            width={11.25}
                                                            preserveAspectRatio="xMidYMid meet"
                                                            fill="currentColor"
                                                            className="inline-block"
                                                        >
                                                            <title>wds-ic-disappearing-messages</title>
                                                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                                                            <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                                                            <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                                                            <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                                                            <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                                                            <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                                                            <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                                                        </svg>
                                                    </span>
                                                </div>

                                                <span className={`visible min-h-0 wrap-break-word ${messageTextSize}`}>
                                                    Usas una duración predeterminada para los mensajes temporales en chats nuevos. Los mensajes nuevos
                                                    desaparecerán de este chat después de 90 días de haber sido enviados, a menos que se use la opción
                                                    para conservarlos. <strong className="font-semibold">Cambiar Duración</strong>
                                                </span>
                                            </span>
                                        </div>

                                        <span></span>
                                        <div></div>
                                    </div>

                                    <div className="absolute top-1/2 order-0 -mt-[16.25px] flex min-h-0 w-[126.25px] min-w-0 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-[5px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ActiveTemporalMessage({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const horizontalPadding = 'px-10';
    const maxWidth = 'max-w-none';
    const messageTextSize = 'text-[13.75px] leading-[15px]';

    return (
        <div className="relative">
            <div>
                <div className="relative pb-2.5">
                    <div className="flex justify-center">
                        <div>
                            <div className={`mx-auto flex ${maxWidth} flex-col justify-center ${horizontalPadding}`}>
                                <span></span>

                                <div
                                    className={[
                                        'relative mb-0 box-border inline-block max-w-full flex-none rounded-[9.1875px] px-[15px] pt-[5px] pb-[6.25px] text-center text-[12.5px] leading-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
                                        isDark ? 'bg-[#12181C] text-[#767C80]' : 'bg-[#fefdfc] text-[#667781]',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 rounded-[9.1875px]">
                                        <div className="cursorpointer">
                                            <span>
                                                <div className="me-[2.5px] inline-block align-top">
                                                    <span aria-hidden="true" data-icon="lock-small">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            height={11.25}
                                                            width={11.25}
                                                            preserveAspectRatio="xMidYMid meet"
                                                            fill="currentColor"
                                                            className="inline-block"
                                                        >
                                                            <title>wds-ic-disappearing-messages</title>
                                                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                                                            <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                                                            <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                                                            <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                                                            <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                                                            <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                                                            <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                                                        </svg>
                                                    </span>
                                                </div>

                                                <span className={`visible min-h-0 wrap-break-word ${messageTextSize}`}>
                                                    Activaste los mensajes temporales. Los mensajes nuevos desaparecerán de este chat después de 90
                                                    días de haber sido enviados, a menos que se use la opción para conservarlos.{' '}
                                                    <strong className="font-semibold">Cambiar Duración</strong>
                                                </span>
                                            </span>
                                        </div>

                                        <span></span>
                                        <div></div>
                                    </div>

                                    <div className="absolute top-1/2 order-0 -mt-[16.25px] flex min-h-0 w-[126.25px] min-w-0 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-[5px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DesactiveTemporalMessage({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const horizontalPadding = 'px-10';
    const maxWidth = 'max-w-none';
    const messageTextSize = 'text-[13.75px] leading-[15px]';

    return (
        <div className="relative">
            <div>
                <div className="relative pb-2.5">
                    <div className="flex justify-center">
                        <div>
                            <div className={`mx-auto flex ${maxWidth} flex-col justify-center ${horizontalPadding}`}>
                                <span></span>

                                <div
                                    className={[
                                        'relative mb-0 box-border inline-block max-w-full flex-none rounded-[9.1875px] px-[15px] pt-[5px] pb-[6.25px] text-center text-[12.5px] leading-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
                                        isDark ? 'bg-[#12181C] text-[#767C80]' : 'bg-[#fefdfc] text-[#667781]',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 rounded-[9.1875px]">
                                        <div className="cursor-pointer">
                                            <span>
                                                <div className="me-[2.5px] inline-block align-top">
                                                    <span aria-hidden="true" data-icon="lock-small">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            height={11.25}
                                                            width={11.25}
                                                            preserveAspectRatio="xMidYMid meet"
                                                            fill="currentColor"
                                                            className="inline-block"
                                                        >
                                                            <title>wds-ic-disappearing-messages</title>
                                                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                                                            <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                                                            <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                                                            <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                                                            <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                                                            <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                                                            <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                                                        </svg>
                                                    </span>
                                                </div>

                                                <span className={`visible min-h-0 wrap-break-word ${messageTextSize}`}>
                                                    Desactivaste los mensajes temporales. <strong className="font-semibold">Cambiar Duración</strong>
                                                </span>
                                            </span>
                                        </div>

                                        <span></span>
                                        <div></div>
                                    </div>

                                    <div className="absolute top-1/2 order-0 -mt-[16.25px] flex min-h-0 w-[126.25px] min-w-0 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-[5px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
