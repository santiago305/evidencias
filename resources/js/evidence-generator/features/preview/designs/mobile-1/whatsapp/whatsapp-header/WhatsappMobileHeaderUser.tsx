import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createWhatsappAvatarTheme } from '../avatarTheme';
import type { MsgStatus } from '../WhatsappPieces';
import type { WhatsappData } from '../whatsappTypes';
import type { PreviewThemeMode } from '../../../../../../types';

type Status = { type: 'hidden' } | { type: 'online' };

type WhatsappMobileHeaderUserProps = {
    data: WhatsappData;
    status?: MsgStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
};

export function WhatsappMobileHeaderUser({
    data,
    status,
    showTemporaryIndicator = true,
    displayTitle,
    themeMode = 'light',
}: WhatsappMobileHeaderUserProps) {
    const isDark = themeMode === 'dark';
    const headerStatus = useMemo<Status>(() => {
        if (status) {
            return status === 'read' ? { type: 'online' } : { type: 'hidden' };
        }

        return Math.random() < 0.5 ? { type: 'online' } : { type: 'hidden' };
    }, [data, status]);

    const avatarTheme = useMemo(() => {
        const avatarSeed =
            [data.telefono, data.nombre, data.dni, data.nombreAsesor]
                .map((value) => value?.trim())
                .find((value) => !!value) ?? 'contact';

        return createWhatsappAvatarTheme(avatarSeed, themeMode);
    }, [data.telefono, data.nombre, data.dni, data.nombreAsesor, themeMode]);

    const headerTitle = displayTitle ?? (data.nombre?.trim() ? data.nombre : 'Aracely MD');
    const mobileAvatarInitial = useMemo(() => {
        const firstCharacter = Array.from(headerTitle.trim())[0] ?? '';

        return /^\p{L}$/u.test(firstCharacter) ? firstCharacter.toLocaleUpperCase('es-PE') : null;
    }, [headerTitle]);

    return (
        <div className={['w-full border-b px-1 py-2.5', isDark ? 'border-white/10 bg-[#202c33]' : 'border-black/10 bg-white'].join(' ')}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <button
                        type="button"
                        className={['grid h-8 w-8 shrink-0 place-items-center rounded-full transition', isDark ? 'text-slate-200 active:bg-white/15' : 'text-black active:bg-black/10'].join(' ')}
                        aria-label="Volver"
                        title="Volver"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden="true" strokeWidth={2.4} />
                    </button>

                    <div className="relative h-9 w-9 shrink-0">
                        <div className="h-9 w-9 overflow-hidden rounded-full">
                            {mobileAvatarInitial ? (
                                <span
                                    aria-hidden="true"
                                    className="segoe-ui-semibold grid h-full w-full place-items-center rounded-full border text-[18px] leading-none"
                                    data-avatar-initial="true"
                                    style={{
                                        backgroundColor: avatarTheme.bg,
                                        borderColor: avatarTheme.border,
                                        color: avatarTheme.icon,
                                    }}
                                >
                                    {mobileAvatarInitial}
                                </span>
                            ) : (
                                <span aria-hidden="true" data-icon="default-contact-refreshed" className="block h-full w-full">
                                    <svg
                                        viewBox="0 0 48 48"
                                        height="48"
                                        width="48"
                                        preserveAspectRatio="xMidYMid meet"
                                        className="h-full w-full rounded-full border"
                                        style={{
                                            backgroundColor: avatarTheme.bg,
                                            borderColor: avatarTheme.border,
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
                        </div>

                        {showTemporaryIndicator && (
                            <span
                                aria-hidden="true"
                                className="absolute -right-[2px] -bottom-[2px] grid h-[18px] w-[18px] place-items-center rounded-full"
                                style={{
                                    backgroundColor: avatarTheme.badgeRing,
                                }}
                            >
                                <span
                                    className="grid h-[16px] w-[16px] place-items-center overflow-hidden rounded-full"
                                    style={{
                                        backgroundColor: avatarTheme.badgeBg,
                                        color: avatarTheme.badgeIcon,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" height="16" width="16" preserveAspectRatio="xMidYMid meet" fill="currentColor" className="block">
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

                    <div className="min-w-0 flex-1 leading-tight">
                        <div className={['segoe-ui truncate pb-px text-[13px] leading-[17px] tracking-tight', isDark ? 'text-white' : 'text-[#111b21]'].join(' ')}>
                            {headerTitle}
                        </div>

                        {headerStatus.type !== 'hidden' && <div className={['truncate text-[11px] font-medium', isDark ? 'text-slate-400' : 'text-[#667781]'].join(' ')}>en linea</div>}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3.5 text-[#54656f]">
                    <span aria-hidden="true" data-icon="video-call-refreshed" className={['h-[25px] w-[25px]', isDark ? 'text-slate-200' : 'text-black'].join(' ')}>
                        <svg viewBox="0 0 22 22" height="22" width="22" fill="none">
                            <title>video-call-refreshed</title>
                            <path
                                d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V10.5L21.15 7.35C21.3167 7.18333 21.5 7.14167 21.7 7.225C21.9 7.30833 22 7.46667 22 7.7V16.3C22 16.5333 21.9 16.6917 21.7 16.775C21.5 16.8583 21.3167 16.8167 21.15 16.65L18 13.5V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H4ZM4 18H16V6H4V18Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>

                    <span aria-hidden="true" data-icon="audio-call-refreshed" className={['h-[25px] w-[25px]', isDark ? 'text-slate-200' : 'text-black'].join(' ')}>
                        <svg viewBox="0 0 22 22" height="22" width="22" preserveAspectRatio="xMidYMid meet" fill="currentColor">
                            <title>ic-call</title>
                            <path
                                d="M19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7292 9.89167 17.4417 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19167 3 6.13333 3 4.05C3 3.75 3.1 3.5 3.3 3.3C3.5 3.1 3.75 3 4.05 3H8.1C8.33333 3 8.54167 3.07917 8.725 3.2375C8.90833 3.39583 9.01667 3.58333 9.05 3.8L9.7 7.3C9.73333 7.56667 9.725 7.79167 9.675 7.975C9.625 8.15833 9.53333 8.31667 9.4 8.45L6.975 10.9C7.30833 11.5167 7.70417 12.1125 8.1625 12.6875C8.62083 13.2625 9.125 13.8167 9.675 14.35C10.1917 14.8667 10.7333 15.3458 11.3 15.7875C11.8667 16.2292 12.4667 16.6333 13.1 17L15.45 14.65C15.6 14.5 15.7958 14.3875 16.0375 14.3125C16.2792 14.2375 16.5167 14.2167 16.75 14.25L20.2 14.95C20.4333 15.0167 20.625 15.1375 20.775 15.3125C20.925 15.4875 21 15.6833 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21ZM6.025 9L7.675 7.35L7.25 5H5.025C5.10833 5.68333 5.225 6.35833 5.375 7.025C5.525 7.69167 5.74167 8.35 6.025 9ZM14.975 17.95C15.625 18.2333 16.2875 18.4583 16.9625 18.625C17.6375 18.7917 18.3167 18.9 19 18.95V16.75L16.65 16.275L14.975 17.95Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>

                    <button
                        type="button"
                        className={['grid h-5 w-5 place-items-center rounded-full transition', isDark ? 'text-slate-200 hover:bg-white/10 active:bg-white/15' : 'text-black hover:bg-black/5 active:bg-black/10'].join(' ')}
                        aria-label="Menu"
                        title="Menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.6" />
                            <circle cx="12" cy="12" r="1.6" />
                            <circle cx="12" cy="19" r="1.6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

