import type { PreviewThemeMode } from '../../../../../../types';
import { getMobile13SmsHeaderColors } from '../smsAppearance';
import type { SmsData } from '../smsTypes';
import { SmsHeaderGlassPill } from './SmsHeaderGlassPill';
import { getSmsHeaderDisplayValue } from './smsHeaderIdentity';

export { formatMobile13SmsPhone } from './smsHeaderIdentity';

export function SmsHeaderContactPill({ data, themeMode }: { data: SmsData; themeMode: PreviewThemeMode }) {
    const displayValue = getSmsHeaderDisplayValue(data.nombre, data.telefono);
    const colors = getMobile13SmsHeaderColors(themeMode);

    return (
        <SmsHeaderGlassPill data-mobile13-sms-contact-pill="true" themeMode={themeMode} darkComposerMaterial className="z-[1] -mt-[5px] h-[30px] max-w-[calc(100vw-48px)]">
            <div className="flex h-full min-w-0 items-center justify-center gap-[7px] px-[10px]">
                <span
                    className={`min-w-0 truncate text-center font-sans text-[15px] leading-[20px] ${themeMode === 'dark' ? 'font-medium' : 'font-bold'}`}
                    style={{ color: themeMode === 'dark' ? colors.pillText : '#101114' }}
                >
                    {displayValue}
                </span>
                <svg viewBox="0 0 9 18" className="h-[50px] w-[5px] shrink-0" fill="none" aria-hidden="true">
                    <path
                        d="M1 1L8 9L1 17"
                        stroke={themeMode === 'dark' ? colors.pillChevron : '#A4A6AC'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </SmsHeaderGlassPill>
    );
}
