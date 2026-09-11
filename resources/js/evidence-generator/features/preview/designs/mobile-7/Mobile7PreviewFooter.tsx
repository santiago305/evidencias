import type { PreviewThemeMode } from '../../../../types';
import { Mobile7BackIcon } from './components/navigation/Mobile7BackIcon';
import { Mobile7HomeIcon } from './components/navigation/Mobile7HomeIcon';
import { Mobile7RecentsIcon } from './components/navigation/Mobile7RecentsIcon';

const MOBILE7_FOOTER_LIGHT_BACKGROUND = '#F9F9FB';
const MOBILE7_FOOTER_LIGHT_FOREGROUND = '#787878';

export function Mobile7PreviewFooter({
    themeMode,
    variant = 'default',
    systemFooterBackground,
    systemFooterForeground,
}: {
    themeMode: PreviewThemeMode;
    variant?: 'default' | 'sms';
    systemFooterBackground?: string;
    systemFooterForeground?: string;
}) {
    const isDark = themeMode === 'dark';
    const isSmsVariant = variant === 'sms' && isDark;
    const backgroundColor = systemFooterBackground ?? (isSmsVariant ? '#101417' : isDark ? '#000000' : MOBILE7_FOOTER_LIGHT_BACKGROUND);
    const foregroundColor = systemFooterForeground ?? (isSmsVariant ? '#ECEDEF' : isDark ? '#EFEFEF' : MOBILE7_FOOTER_LIGHT_FOREGROUND);

    return (
      <div
        className="flex h-[48px] w-full shrink-0 items-center justify-center"
        style={{ backgroundColor, color: foregroundColor }}
        data-mobile7-system-navigation="three-button"
    >
        <div className="flex items-center justify-center gap-[60px]">
            <Mobile7RecentsIcon />
            <Mobile7HomeIcon />
            <Mobile7BackIcon />
        </div>
    </div>
    );
}
