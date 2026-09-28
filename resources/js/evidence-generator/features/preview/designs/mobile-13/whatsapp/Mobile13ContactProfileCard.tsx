import { useMemo } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { createWhatsappAvatarTheme } from './avatarTheme';
import { buildWhatsappAvatarSeed } from './whatsappAppearance';
import { WhatsappAvatarImage } from './WhatsappAvatarImage';
import type { WhatsappData } from './whatsappTypes';

type Mobile13ContactProfileCardProps = {
    data: WhatsappData;
    themeMode: PreviewThemeMode;
    profileTitle: string;
    profileSubtitle: string;
    showAddContactAction: boolean;
};

function BlockIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
            <path d="m6 6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function    AddContactIcon({ isDark }: { isDark: boolean }) {
    
    const iconForeground = isDark ? '#FAFAFA' : '#111B21';
    const plusForeground = isDark ? '#111B21' : '#111B21';
    const borderColor = isDark ? '#000000' : '#FAFAFA';
    const plusBackground = isDark ? '#FAFAFA' : '#FAFAFA';
    return (
        <svg width="35" height="35" viewBox="0 0 32 32" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
            <path
                d="M12.5 4.5C9.46 4.5 7 6.96 7 10C7 13.04 9.46 15.5 12.5 15.5C15.54 15.5 18 13.04 18 10C18 6.96 15.54 4.5 12.5 4.5Z"
                fill={iconForeground}
            />
            <path
                d="M12.5 18C7.53 18 3.5 20.88 3.5 24.43V25.5C3.5 26.05 3.95 26.5 4.5 26.5H20.5C21.05 26.5 21.5 26.05 21.5 25.5V24.43C21.5 20.88 17.47 18 12.5 18Z"
                fill={iconForeground}
            />
            <circle cx="24.5" cy="22.5" r="7" fill={plusBackground} stroke={borderColor} strokeWidth="0.8"/>
            <path d="M24.5 19.5V25.5M21.5 22.5H27.5" stroke={plusForeground} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function Mobile13ContactProfileCard({
    data,
    themeMode,
    profileTitle,
    profileSubtitle,
    showAddContactAction,
}: Mobile13ContactProfileCardProps) {
    const isDark = themeMode === 'dark';
    const avatarTheme = useMemo(() => createWhatsappAvatarTheme(buildWhatsappAvatarSeed(data), themeMode), [data, themeMode]);
    const mobileAvatarInitial = useMemo(() => {
        const firstCharacter = showAddContactAction ? '' : (Array.from(profileTitle.trim())[0] ?? '');

        return /^\p{L}$/u.test(firstCharacter) ? firstCharacter.toLocaleUpperCase('es-PE') : null;
    }, [profileTitle, showAddContactAction]);

    return (
        <section
            data-mobile13-whatsapp-contact-card="true"
            data-mobile13-whatsapp-contact-add-state={showAddContactAction ? 'available' : 'unavailable'}
            className={[
                'mx-[23px] my-[12px] flex min-h-[250px] flex-col items-center rounded-[25px] px-[13px] pt-[16px] pb-[0px]',
                isDark ? 'bg-[#242625]' : 'bg-[#ffffff]',
            ].join(' ')}
        >
            <div data-mobile13-whatsapp-contact-avatar="true" className="h-[88px] w-[88px] overflow-hidden rounded-full">
                <WhatsappAvatarImage img64={data.img_64} alt={profileTitle} className="block h-full w-full rounded-full object-cover">
                    {mobileAvatarInitial ? (
                        <span
                            aria-hidden="true"
                            className="grid h-full w-full place-items-center rounded-full text-[42px] leading-none font-bold"
                            style={{ backgroundColor: avatarTheme.bg, color: avatarTheme.icon }}
                        >
                            {mobileAvatarInitial}
                        </span>
                    ) : (
                        <span aria-hidden="true" className="block h-full w-full rounded-full" style={{ backgroundColor: avatarTheme.bg }}>
                            <svg viewBox="0 0 48 48" className="h-full w-full rounded-full" fill="none" aria-hidden="true">
                                <path
                                    d="M24 23q-1.857 0-3.178-1.322Q19.5 20.357 19.5 18.5t1.322-3.178T24 14t3.178 1.322T28.5 18.5t-1.322 3.178T24 23m-6.75 10q-.928 0-1.59-.66-.66-.662-.66-1.59v-.9q0-.956.492-1.758A3.3 3.3 0 0 1 16.8 26.87a16.7 16.7 0 0 1 3.544-1.308q1.8-.435 3.656-.436 1.856 0 3.656.436T31.2 26.87q.816.422 1.308 1.223T33 29.85v.9q0 .928-.66 1.59-.662.66-1.59.66z"
                                    fill={avatarTheme.icon}
                                />
                            </svg>
                        </span>
                    )}
                </WhatsappAvatarImage>
            </div>

            <div className="mt-[7px] flex flex-col items-center gap-[3px] text-center">
                <div
                    data-mobile13-whatsapp-contact-title="true"
                    className={
                        isDark ? 'text-[17.5px] leading-[21px] font-medium text-[#F5F5F5]' : 'text-[17.5px] leading-[21px] font-medium text-[#111B21]'
                    }
                >
                    {profileTitle}
                </div>
                <div
                    data-mobile13-whatsapp-contact-subtitle="true"
                    className={isDark ? 'text-[13.5px] leading-[17px] text-[#9A9A9A]' : 'text-[13.5px] leading-[17px] text-[#667781]'}
                >
                    {profileSubtitle}
                </div>
            </div>

            <div data-mobile13-whatsapp-contact-actions="true" className="mt-[52px] flex w-full gap-[8px]">
                <button
                    type="button"
                    aria-label="Bloquear"
                    data-mobile13-whatsapp-block="true"
                    className={[
                        'flex h-[35px] min-w-0 flex-1 items-center justify-center gap-[5px] rounded-full text-[16px] leading-none font-semibold text-[#EA5362]',
                        isDark ? 'bg-[#3B3B3B]' : 'bg-[#e7e4df]',
                    ].join(' ')}
                >
                    <BlockIcon />
                    <span>Bloquear</span>
                </button>
                <button
                    type="button"
                    aria-label="Añadir"
                    data-mobile13-whatsapp-add="true"
                    className={[
                        'flex h-[35px] min-w-0 flex-1 items-center justify-center gap-[5px] rounded-full text-[16px] leading-none font-semibold',
                        isDark ? 'bg-[#3B3B3B] text-[#F5F5F5]' : 'bg-[#e7e4df] text-[#111B21]',
                    ].join(' ')}
                >
                    <AddContactIcon isDark={isDark} />
                    <span>Añadir</span>
                </button>
            </div>
        </section>
    );
}
