import { useState } from 'react';
import type { PreviewThemeMode } from '../../../../../types';

import { Mobile7SmsSaveContactIcon } from './Mobile7SmsSaveContactIcon';
import { getSmsColors } from './smsAppearance';

type Mobile7SmsSaveContactCardProps = {
    telefono: string;
    themeMode: PreviewThemeMode;
};

export function Mobile7SmsSaveContactCard({ telefono, themeMode }: Mobile7SmsSaveContactCardProps) {
    const [isVisible, setIsVisible] = useState(true);
    const isDark = themeMode === 'dark';
    const colors = getSmsColors(themeMode);

    const darkCardBackground = '#1C2023';
    const darkPrimaryText = '#E2E3E5';
    const darkSecondaryText = '#C2C7CB';
    const darkAccent = '#76D1FE';
    const darkAvatarForeground = '#003449';
    const darkCloseIcon = '#E2E3E5';

    if (!isVisible) {
        return null;
    }

    return (
        <div className="mx-[3px] pb-[20px]" data-mobile7-sms-save-contact-card="true">
            <section
                className="relative h-[130px] w-full overflow-hidden rounded-[31px]"
                style={{ backgroundColor: colors.receivedBubble }}
                aria-label={`Guardar contacto ${telefono}`}
            >
                <div className="absolute top-[16px] left-[14px] size-[44px]" aria-hidden="true">
                    <Mobile7SmsSaveContactIcon
                        className="block size-[40px]"
                        accentColor={isDark ? darkAccent : '#4D5C93'}
                        foregroundColor={isDark ? darkAvatarForeground : '#FFFFFF'}
                    />
                </div>

                <div className="absolute top-[17px] right-[42px] left-[72px]">
                    <div
                        className="text-[14.5px] leading-[21px] font-[500] tracking-[-0.1px] whitespace-nowrap"
                        style={{ color: isDark ? darkPrimaryText : '#191A1F' }}
                    >
                        ¿Quieres guardar {telefono}?
                    </div>

                    <div
                        className="mt-[2px] text-[13px] leading-[20px] font-[400] tracking-[-0.05px]"
                        style={{ color: isDark ? darkSecondaryText : '#5F6065' }}
                    >
                        Si guardas este número, se agregará un
                        <br />
                        contacto nuevo.
                    </div>
                </div>

                <button
                    type="button"
                    className="absolute top-[17px] right-[17px] grid size-[24px] place-items-center"
                    style={{ color: isDark ? darkCloseIcon : '#191A1F' }}
                    aria-label="Cerrar sugerencia"
                    onClick={() => setIsVisible(false)}
                >
                    <svg viewBox="0 0 24 24" className="block size-[22px]" fill="none" aria-hidden="true">
                        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="absolute right-[17px] bottom-[18px] flex items-center gap-[34px]">
                    <button
                        type="button"
                        className="text-[13px] leading-[18px] font-[600] tracking-[0px] whitespace-nowrap"
                        style={{ color: colors.link, textDecoration: 'none' }}
                    >
                        Denunciar spam
                    </button>

                    <button
                        type="button"
                        className="text-[13px] leading-[18px] font-[600] tracking-[0px] whitespace-nowrap"
                        style={{ color: colors.link, textDecoration: 'none' }}
                    >
                        Agregar contacto
                    </button>
                </div>
            </section>
        </div>
    );
}
