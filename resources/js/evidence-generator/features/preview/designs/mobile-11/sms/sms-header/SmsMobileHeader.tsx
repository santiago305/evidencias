import { useState, type ReactNode } from 'react';
import { getSmsColors, shouldShowSmsAccentPoint } from '../smsAppearance';
import type { SmsData } from '../smsTypes';
import { Mobile11AvatarIcon } from './Mobile11AvatarIcon';

export function SmsMobileHeader({ data, themeMode, showVideoCall = false }: { data: SmsData; themeMode: 'light' | 'dark'; showVideoCall?: boolean }) {
    const colors = getSmsColors(themeMode);
    const displayTelefono = formatMobile11SmsPhone(data.telefono);
    const actionIconColor = '#BDBDBD';
    const menuActionClassName = 'flex h-[42px] w-[35px] shrink-0 items-center justify-center';
    const [showMenuIndicator] = useState(() => shouldShowSmsAccentPoint());

    return (
        <header className="flex h-[72px] shrink-0 items-center px-3.5" style={{ backgroundColor: colors.header, color: colors.primaryText }}>
            <button
                type="button"
                className="mr-1 flex size-[42px] shrink-0 items-center justify-center rounded-full"
                style={{ color: colors.headerIcon }}
                aria-label="Volver"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="size-[22px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </svg>
            </button>

            <div
                className="flex aspect-square h-[55px] max-h-[55px] min-h-[55px] w-[55px] max-w-[55px] min-w-[55px] shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{
                    width: '55px',
                    height: '55px',
                    minWidth: '55px',
                    minHeight: '55px',
                    maxWidth: '55px',
                    maxHeight: '55px',
                    aspectRatio: '1 / 1',
                    borderRadius: '9999px',
                }}
            >
                <Mobile11AvatarIcon className="size-full shrink-0" />
            </div>
            <div className="min-w-0 flex-1 pl-[11px]">
                <div className="truncate text-[18px] font-medium leading-none tracking-[-0.2px]">{displayTelefono}</div>
            </div>

            <div className="flex items-center gap-[5px]">
                <HeaderIcon label="Llamar" color={actionIconColor}>
                    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.2 11.2 0 0 0 3.5.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.2 11.2 0 0 0 .6 3.5 1 1 0 0 1-.2 1Z" />
                </HeaderIcon>

                {showVideoCall ? (
                    <button
                        type="button"
                        className="flex size-[42px] shrink-0 items-center justify-center"
                        style={{ color: actionIconColor }}
                        aria-label="Videollamada"
                    >
                        <svg viewBox="0 0 22 22" height="24" width="22" fill="none" aria-hidden="true">
                            <title>video-call-refreshed</title>
                            <path
                                d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V9.5L21.15 6.35C21.3167 6.18333 21.5 6.14167 21.7 6.225C21.9 6.30833 22 6.46667 22 6.7V17.3C22 17.5333 21.9 17.6917 21.7 17.775C21.5 17.8583 21.3167 17.8167 21.15 17.65L18 14.5V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H4Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                ) : null}

                <button type="button" className={menuActionClassName} aria-label="Opciones">
                    <svg viewBox="0 0 32 30" className="size-[31px]" fill="none" aria-hidden="true">
                        <circle cx="14.5" cy="8" r="2" fill={colors.headerActionIcon} />
                        <circle cx="14.5" cy="14" r="2" fill={colors.headerActionIcon} />
                        <circle cx="14.5" cy="20" r="2" fill={colors.headerActionIcon} />
                        {showMenuIndicator ? (
                            <>
                                <circle cx="21.9" cy="6.2" r="4" fill={colors.header} />
                                <circle cx="21.9" cy="6.2" r="2.8" fill={colors.menuIndicator} />
                            </>
                        ) : null}
                    </svg>
                </button>
            </div>
        </header>
    );
}

function formatMobile11SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    return /^\d{9}$/.test(trimmed) ? trimmed.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : trimmed;
}

function HeaderIcon({ label, color, children }: { label: string; color: string; children: ReactNode }) {
    return (
        <button type="button" className="flex size-[43px] shrink-0 items-center justify-center" style={{ color }} aria-label={label}>
            <svg viewBox="0 0 24 24" className="size-6.5" fill="currentColor" aria-hidden="true">
                {children}
            </svg>
        </button>
    );
}
