import type { PreviewThemeMode } from '../../../../../../types';
import { getMobile13SmsHeaderColors } from '../smsAppearance';
import type { SmsData } from '../smsTypes';
import { SmsHeaderAvatar } from './SmsHeaderAvatar';
import { SmsHeaderContactPill } from './SmsHeaderContactPill';
import { SmsHeaderGlassPill } from './SmsHeaderGlassPill';

export function SmsMobileHeader({ data, themeMode }: { data: SmsData; themeMode: PreviewThemeMode }) {
    const colors = getMobile13SmsHeaderColors(themeMode);
    const isDark = themeMode === 'dark';
    return (
        <header
            data-mobile13-sms-floating-header="true"
            className="pointer-events-none absolute inset-x-0 top-1.5 z-30 h-[110px] bg-transparent px-3"
            style={{ color: colors.headerText, backgroundColor: 'transparent' }}
        >
            <div className="absolute top-[8px] left-[10px]">
                <SmsHeaderGlassPill themeMode={themeMode} darkComposerMaterial className="h-[35px] w-[38px]">
                    <button
                        type="button"
                        className={[
                            'pointer-events-auto flex h-full w-full items-center justify-center gap-[8px] rounded-full px-[10px] transition-colors',
                            isDark ? 'active:bg-white/[0.08]' : 'active:bg-black/[0.04]',
                        ].join(' ')}
                        style={{ color: isDark ? colors.backButtonText : '#161719' }}
                        aria-label="Volver"
                        title="Volver"
                    >
                        <svg viewBox="0 0 28 40" className="h-[23px] w-[12px] shrink-0" aria-hidden="true" fill="none">
                            <path d="M21 4L6 20L21 36" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {/* <span className="flex h-[21px] min-w-[26px] items-center justify-center rounded-full bg-[#191A1D] px-[4px] text-[11px] font-semibold text-white">
                            {unreadCount}
                        </span> */}
                    </button>
                </SmsHeaderGlassPill>
            </div>

            <div className="flex flex-col items-center gap-0 pt-[10px]">
                <SmsHeaderAvatar data={data} themeMode={themeMode} />
                <SmsHeaderContactPill data={data} themeMode={themeMode} />
            </div>
        </header>
    );
}
