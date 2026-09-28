import { resolveWhatsappHeaderIdentity } from '../../../shared/whatsapp/contactIdentityDisplay';
import { useMemo } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import type { WhatsappMessageStatus as MsgStatus, WhatsappData } from '../../../shared/whatsapp/whatsappTypes';
import { WhatsappAvatarImage } from '../WhatsappAvatarImage';
import { createWhatsappAvatarTheme } from '../avatarTheme';
import { buildWhatsappAvatarSeed } from '../whatsappAppearance';

type WhatsappMobileHeaderUserProps = {
    data: WhatsappData;
    status?: MsgStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
};

export function WhatsappMobileHeaderUser({ data, showTemporaryIndicator = true, themeMode = 'light' }: WhatsappMobileHeaderUserProps) {
    const isDark = themeMode === 'dark';
    const headerBackground = isDark ? '#101010' : '#F4F1EC';
    const avatarRingColor = isDark ? '#505653' : '#C6C7C5';

    const avatarTheme = useMemo(() => createWhatsappAvatarTheme(buildWhatsappAvatarSeed(data), themeMode), [data, themeMode]);

    const contactIdentity = resolveWhatsappHeaderIdentity(data);
    const headerTitle = contactIdentity.title;

    const mobileAvatarInitial = useMemo(() => {
        const firstCharacter = contactIdentity.hasName ? (Array.from(headerTitle.trim())[0] ?? '') : '';

        return /^\p{L}$/u.test(firstCharacter) ? firstCharacter.toLocaleUpperCase('es-PE') : null;
    }, [headerTitle]);

    return (
        <div
            data-mobile13-whatsapp-header="true"
            className={['w-full  px-[14px] py-[6px]', isDark ? 'bg-[#101010]' : 'bg-[#F4F1EC]'].join(' ')}
        >
            <div className="flex h-[48px] w-full items-center gap-[8px]">
                {/* ================================================== */}
                {/* BOTÓN VOLVER */}
                {/* ================================================== */}
                <button
                    type="button"
                    data-mobile13-whatsapp-back="true"
                    className={[
                        'relative flex h-[40px] w-[40px] shrink-0 items-center justify-center gap-[4px] overflow-hidden rounded-full border px-[9px] transition',
                        isDark
                            ? 'border-white/[0.10] bg-[#2F3533] text-[#F1F4F3] active:bg-[#363C3A]'
                            : 'border-black/[0.10] bg-[#F7F6F0] text-[#111B21] active:bg-black/[0.04]',
                    ].join(' ')}
                    aria-label="Volver"
                    title="Volver"
                >
                    {/* Reflejo superior */}
                    <span
                        aria-hidden="true"
                        className={[
                            'pointer-events-none absolute top-0 left-1/2 h-[4px] w-[18px] -translate-x-1/2 rounded-full',
                            isDark
                                ? 'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.07)_32%,rgba(255,255,255,0.03)_65%,rgba(255,255,255,0)_100%)]'
                                : 'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.58)_32%,rgba(255,255,255,0.22)_65%,rgba(255,255,255,0)_100%)]',
                        ].join(' ')}
                    />

                    {/* Reflejo inferior */}
                    <span
                        aria-hidden="true"
                        className={[
                            'pointer-events-none absolute bottom-0 left-1/2 h-[4px] w-[18px] -translate-x-1/2 rounded-full',
                            isDark
                                ? 'bg-[linear-gradient(to_top,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.07)_32%,rgba(255,255,255,0.03)_65%,rgba(255,255,255,0)_100%)]'
                                : 'bg-[linear-gradient(to_top,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.58)_32%,rgba(255,255,255,0.22)_65%,rgba(255,255,255,0)_100%)]',
                        ].join(' ')}
                    />

                    <svg
                        width="28"
                        height="40"
                        viewBox="0 0 28 40"
                        className="relative z-[1] me-1 h-[20px] w-[14px] shrink-0"
                        aria-hidden="true"
                        fill="none"
                    >
                        <path d="M21 4L6 20L21 36" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* ================================================== */}
                {/* AVATAR */}
                {/* ================================================== */}
                <div data-mobile13-whatsapp-avatar="true" className="relative h-[42px] w-[42px] shrink-0">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 box-border rounded-full border-[2.2px]"
                        style={{
                            borderColor: avatarRingColor,
                            backgroundColor: headerBackground,
                        }}
                    />

                    <div
                        data-mobile13-whatsapp-avatar-image="true"
                        className="absolute inset-[4px] overflow-hidden rounded-full"
                        style={{
                            backgroundColor: headerBackground,
                        }}
                    >
                        <WhatsappAvatarImage img64={data.img_64} alt={headerTitle} className="block h-full w-full rounded-full object-cover">
                            {mobileAvatarInitial ? (
                                <span
                                    aria-hidden="true"
                                    className="grid h-full w-full place-items-center rounded-full text-[22.5px] leading-none font-bold"
                                    data-avatar-initial="true"
                                    style={{
                                        backgroundColor: avatarTheme.bg,
                                        color: avatarTheme.icon,
                                    }}
                                >
                                    {mobileAvatarInitial}
                                </span>
                            ) : (
                                <span aria-hidden="true" data-icon="default-contact-refreshed" className="block h-full w-full">
                                    <svg
                                        viewBox="0 0 48 48"
                                        height="60"
                                        width="60"
                                        preserveAspectRatio="xMidYMid meet"
                                        className="h-full w-full rounded-full"
                                        style={{
                                            backgroundColor: avatarTheme.bg,
                                        }}
                                        fill="none"
                                    >
                                        <title>default-contact-refreshed</title>

                                        <path
                                            d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322Q28.5 16.643 28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z"
                                            fill={avatarTheme.icon}
                                        />
                                    </svg>
                                </span>
                            )}
                        </WhatsappAvatarImage>
                    </div>

                    {/* ================================================== */}
                    {/* INDICADOR TEMPORAL */}
                    {/* ================================================== */}
                    {showTemporaryIndicator && (
                        <span
                            aria-hidden="true"
                            data-mobile13-whatsapp-temporary-indicator="true"
                            className="absolute -right-[2.5px] -bottom-[2.5px] grid h-[22.5px] w-[22.5px] place-items-center rounded-full"
                            style={{
                                backgroundColor: avatarTheme.badgeRing,
                            }}
                        >
                            <span
                                className="grid h-[20px] w-[20px] place-items-center overflow-hidden rounded-full"
                                style={{
                                    backgroundColor: avatarTheme.badgeBg,
                                    color: avatarTheme.badgeIcon,
                                }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    height="20"
                                    width="20"
                                    preserveAspectRatio="xMidYMid meet"
                                    fill="currentColor"
                                    className="block"
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
                        </span>
                    )}
                </div>

                {/* ================================================== */}
                {/* NOMBRE + ESTADO */}
                {/* ================================================== */}
                <div
                    className="flex min-w-0 flex-1 flex-col justify-center self-stretch leading-none"
                    style={{
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    <div
                        data-mobile13-whatsapp-contact="true"
                        className={['truncate text-[15.3px] leading-[20px] font-normal tracking-tight', isDark ? 'text-white' : 'text-[#111B21]'].join(
                            ' ',
                        )}
                    >
                        {headerTitle}
                    </div>

                    <div
                        data-mobile13-whatsapp-online="true"
                        className={[
                            '-translate-y-[2.5px] truncate text-[11px] leading-[15px] font-normal tracking-tight font-light',
                            isDark ? 'text-[#969696]' : 'text-slate-600',
                        ].join(' ')}
                    >
                        en línea
                    </div>
                </div>

                {/* ================================================== */}
                {/* BURBUJA VIDEO + TELÉFONO */}
                {/* ================================================== */}
                <div
                    data-mobile13-whatsapp-actions="true"
                    className={[
                        'relative flex h-[42px] w-[93px] shrink-0 items-center justify-center gap-[17px] overflow-hidden rounded-full border px-[14px]',
                        isDark ? 'border-white/[0.10] bg-[#2F3533] text-[#F1F4F3]' : 'border-black/[0.10] bg-[#F7F6F0] text-[#111B21]',
                    ].join(' ')}
                >
                    {/* Reflejo superior */}
                    <span
                        aria-hidden="true"
                        className={[
                            'pointer-events-none absolute top-0 left-1/2 h-[4px] w-[58px] -translate-x-1/2 rounded-full',
                            isDark
                                ? 'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.07)_32%,rgba(255,255,255,0.03)_65%,rgba(255,255,255,0)_100%)]'
                                : 'bg-[linear-gradient(to_bottom,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.58)_32%,rgba(255,255,255,0.22)_65%,rgba(255,255,255,0)_100%)]',
                        ].join(' ')}
                    />

                    {/* Reflejo inferior */}
                    <span
                        aria-hidden="true"
                        className={[
                            'pointer-events-none absolute bottom-0 left-1/2 h-[4px] w-[58px] -translate-x-1/2 rounded-full',
                            isDark
                                ? 'bg-[linear-gradient(to_top,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.07)_32%,rgba(255,255,255,0.03)_65%,rgba(255,255,255,0)_100%)]'
                                : 'bg-[linear-gradient(to_top,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.58)_32%,rgba(255,255,255,0.22)_65%,rgba(255,255,255,0)_100%)]',
                        ].join(' ')}
                    />

                    {/* ================================================== */}
                    {/* VIDEOLLAMADA */}
                    {/* ================================================== */}
                    <span
                        aria-hidden="true"
                        data-mobile13-whatsapp-video="true"
                        data-icon="video-call-refreshed"
                        className="relative z-[1] grid h-[42px] w-[25px] shrink-0 place-items-center"
                    >
                        <svg width="52" height="10" viewBox="0 0 52 36" className="ml-[9px] block h-[18px] w-[29px]" fill="none" aria-hidden="true">
                            <rect x="2" y="3" width="34" height="30" rx="7" stroke="currentColor" strokeWidth="3.5" />

                            <path
                                d="
                                    M36 14.4
                                    L47.2 6.4
                                    C48.1 5.8 49 6.4 49 7.5
                                    V28.5
                                    C49 29.6 48.1 30.2 47.2 29.6
                                    L36 21.6
                                "
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>

                    {/* ================================================== */}
                    {/* TELÉFONO */}
                    {/* ================================================== */}
                    <span
                        aria-hidden="true"
                        data-mobile13-whatsapp-call="true"
                        data-icon="audio-call-refreshed"
                        className="relative z-[1] grid h-[44px] w-[44px] shrink-0 place-items-center"
                    >
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 64 64"
                            className="mx-auto ml-[8px] block h-[30px] w-[30px]"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="
                                    M20 15
                                    C18.3 15.2 16.9 16.3 16.3 18
                                    C14.3 23.8 16.3 30.1 19.6 35
                                    C24.2 41.8 30.4 46.8 37.7 49.2
                                    C42.6 50.8 47.1 50.5 49.8 47.7
                                    C52.1 45.4 52 42.2 49.7 40.2
                                    L45.1 36.6
                                    C43.6 35.4 41.5 35.3 40 36.5
                                    L37.1 38.7
                                    C36 39.5 34.7 39.4 33.5 38.7
                                    C30.6 36.9 28 34.3 26.3 31.4
                                    C25.5 30.1 25.5 28.7 26.4 27.5
                                    L28.5 24.7
                                    C29.7 23.1 29.6 21.2 28.4 19.8
                                    L24.8 15.8
                                    C23.6 14.5 21.6 14.2 20 15
                                    Z
                                "
                                stroke="currentColor"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}
