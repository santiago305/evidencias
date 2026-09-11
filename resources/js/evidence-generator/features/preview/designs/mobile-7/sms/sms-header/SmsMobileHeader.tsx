import { useState, type ReactNode } from 'react';
import { getSmsColors, shouldShowSmsAccentPoint } from '../smsAppearance';
import type { SmsData } from '../smsTypes';

export function SmsMobileHeader({ data, themeMode, showVideoCall = false }: { data: SmsData; themeMode: 'light' | 'dark'; showVideoCall?: boolean }) {
    const colors = getSmsColors(themeMode);
    const displayTelefono = formatMobile7SmsPhone(data.telefono);
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
                <svg viewBox="0 0 48 48" className="h-[31px] w-[31px] shrink-0" fill={colors.avatarForeground} aria-hidden="true">
                    <circle cx="24" cy="16" r="7.5" />
                    <ellipse cx="24" cy="35" rx="14" ry="7.8" />
                </svg>
            </div>

            <div className="min-w-0 flex-1 pl-[11px]">
                <div className="truncate text-[17px] leading-none tracking-[-0.2px]">{displayTelefono}</div>
            </div>

            <HeaderIcon label="Llamar" color={colors.headerActionIcon}>
                <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.2 11.2 0 0 0 3.5.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.2 11.2 0 0 0 .6 3.5 1 1 0 0 1-.2 1Z" />
            </HeaderIcon>

            {showVideoCall ? (
                <button type="button" className="flex size-[42px] shrink-0 items-center justify-center" aria-label="Videollamada">
                    <svg viewBox="0 0 33 27" className="h-[18px] w-[22px]" fill={colors.headerActionIcon} aria-hidden="true">
                        <rect x="0" y="0" width="27" height="27" rx="3.2" />
                        <path d="M26.5 10.1L33 6.4V20.6L26.5 16.9Z" />
                    </svg>
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

function formatMobile7SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    return /^\d{9}$/.test(trimmed)
        ? trimmed.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
        : trimmed;
}

function HeaderIcon({ label, color, children }: { label: string; color: string; children: ReactNode }) {
    return (
        <button type="button" className="flex size-[42px] shrink-0 items-center justify-center" style={{ color }} aria-label={label}>
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
                {children}
            </svg>
        </button>
    );
}
