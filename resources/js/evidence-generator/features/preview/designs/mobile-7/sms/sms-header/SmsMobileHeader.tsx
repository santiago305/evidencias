import { useState, type ReactNode } from 'react';
import { getSmsColors, shouldShowSmsAccentPoint } from '../smsAppearance';
import type { SmsData } from '../smsTypes';

export function SmsMobileHeader({
    data,
    themeMode,
    showVideoCall = true,
}: {
    data: SmsData;
    themeMode: 'light' | 'dark';
    showVideoCall?: boolean;
}) {
    const colors = getSmsColors(themeMode);

    // ==================================================
    // Mobile-6 SMS — Header avatar
    // ==================================================

    const telefono = data.telefono.trim() || '-';
    const displayTelefono = telefono;

    // ==================================================
    // Mobile-6 SMS — action icon positioning
    // ==================================================

    const menuActionClassName = 'flex h-[42px] w-[35px] shrink-0 items-center justify-center';
    const [showMenuIndicator] = useState(() => shouldShowSmsAccentPoint());

    return (
        <header className="flex h-[72px] shrink-0 items-center px-3" style={{ backgroundColor: colors.header, color: colors.primaryText }}>
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
                className="flex aspect-square h-[39px] max-h-[39px] min-h-[39px] w-[39px] max-w-[39px] min-w-[39px] shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{
                    width: '39px',
                    height: '39px',
                    minWidth: '39px',
                    minHeight: '39px',
                    maxWidth: '39px',
                    maxHeight: '39px',
                    aspectRatio: '1 / 1',
                    borderRadius: '9999px',
                    backgroundColor: colors.avatarBackground,
                }}
            >
                <svg
                    viewBox="0 0 48 48"
                    className="h-[31px] w-[31px] shrink-0"
                    fill={colors.avatarForeground}
                    aria-hidden="true"
                >
                    <circle cx="24" cy="16" r="7.5" />
                    <ellipse cx="24" cy="35" rx="14" ry="7.8"  />
                </svg>
            </div>

            <div className="min-w-0 flex-1 pl-[11px]">
                <div className="truncate text-[17px] leading-none tracking-[-0.2px]">{displayTelefono}</div>
            </div>

            <HeaderIcon
                label="Llamar"
                color={colors.headerActionIcon}
                className=""
            >
                <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.2 11.2 0 0 0 3.5.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.2 11.2 0 0 0 .6 3.5 1 1 0 0 1-.2 1Z" />
            </HeaderIcon>
            {showVideoCall ? (
                <button
                    type="button"
                    className={
                        'flex size-[42px] shrink-0 items-center justify-center'
                    }
                    aria-label="Videollamada"
                >
                    {false ? (
                    <span
                        className="relative mb-1.5 grid h-[28px] w-[28px] place-items-center text-[#C7C8CD]"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 -4 21 24"
                            height="25"
                            width="25"
                            fill="none"
                            className="block"
                        >
                            <title>video-call-refreshed</title>

                            <path
                                d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875 17.8042 4.97917 18 5.45 18 6V10.5L21.15 7.35C21.3167 7.18333 21.5 7.14167 21.7 7.225C21.9 7.30833 22 7.46667 22 7.7V16.3C22 16.5333 21.9 16.6917 21.7 16.775C21.5 16.8583 21.3167 16.8167 21.15 16.65L18 13.5V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H4Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                ) : (
                        <svg viewBox="0 0 33 27" className="h-[18px] w-[22px]" fill={colors.headerActionIcon} aria-hidden="true">
                            <rect x="0" y="0" width="27" height="27" rx="3.2" />
                            <path d="M26.5 10.1L33 6.4V20.6L26.5 16.9Z" />
                        </svg>
                    )}
                </button>
            ) : null}
            <button type="button" className={menuActionClassName} aria-label="Opciones">
                <svg viewBox="0 0 32 32" className="size-[34px]" fill="none" aria-hidden="true">
                    <circle cx="14.5" cy="8" r="2" fill={colors.headerActionIcon} />
                    <circle cx="14.5" cy="14" r="2" fill={colors.headerActionIcon} />
                    <circle cx="14.5" cy="20" r="2" fill={colors.headerActionIcon} />
                    {showMenuIndicator ? (
                        <>
                            <circle cx="21.9" cy="6.2" r="4" fill={colors.header} />
                            <circle cx="21.9" cy="6.2" r="3.15" fill={colors.menuIndicator} />
                        </>
                    ) : null}
                </svg>
            </button>
        </header>
    );
}

function HeaderIcon({
    label,
    color,
    children,
    className = '',
}: {
    label: string;
    color: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={`flex size-[42px] shrink-0 items-center justify-center ${className}`}
            style={{ color }}
            aria-label={label}
        >
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
                {children}
            </svg>
        </button>
    );
}
