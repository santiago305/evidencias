import type { ReactNode } from 'react';
import { getSmsColors } from '../smsAppearance';
import type { SmsData } from '../smsTypes';

export function SmsMobileHeader({ data, themeMode }: { data: SmsData; themeMode: 'light' | 'dark' }) {
    const colors = getSmsColors(themeMode);
    const telefono = data.telefono.trim() || '-';

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
                    className="size-[26px]"
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

            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#49B866]">
                <svg viewBox="0 0 48 48" className="size-[35px]" fill={themeMode === 'dark' ? '#15191C' : '#FFFFFF'} aria-hidden="true">
                    <circle cx="24" cy="15.5" r="8" />
                    <path d="M8 42c1.3-9 7.5-14 16-14s14.7 5 16 14Z" />
                </svg>
            </div>

            <div className="min-w-0 flex-1 pl-[11px]">
                <div className="truncate text-[17px] leading-none tracking-[-0.2px]">{telefono}</div>
            </div>

            <HeaderIcon label="Llamar" color={colors.headerIcon}>
                <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.2 11.2 0 0 0 3.5.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.2 11.2 0 0 0 .6 3.5 1 1 0 0 1-.2 1Z" />
            </HeaderIcon>
            <HeaderIcon label="Videollamada" color={colors.headerIcon}>
                <path d="M4 5h11a2 2 0 0 1 2 2v2.2l3.4-2.4a1 1 0 0 1 1.6.8v8.8a1 1 0 0 1-1.6.8L17 14.8V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            </HeaderIcon>
            <button type="button" className="flex h-[42px] w-[35px] shrink-0 items-center justify-center" aria-label="Opciones">
                <svg viewBox="0 0 32 32" className="size-[30px]" fill="none" aria-hidden="true">
                    <circle cx="14.5" cy="10" r="2" fill={colors.headerIcon} />
                    <circle cx="14.5" cy="16" r="2" fill={colors.headerIcon} />
                    <circle cx="14.5" cy="22" r="2" fill={colors.headerIcon} />
                    <circle cx="21.9" cy="6.2" r="4" fill={colors.header} />
                    <circle cx="21.9" cy="6.2" r="3.15" fill={colors.redPoint} />
                </svg>
            </button>
        </header>
    );
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
