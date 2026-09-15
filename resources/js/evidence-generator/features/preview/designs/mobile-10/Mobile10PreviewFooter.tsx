import type { PreviewThemeMode } from '../../../../types';
import { Mobile10BackIcon } from './components/navigation/Mobile10BackIcon';
import { Mobile10HomeIcon } from './components/navigation/Mobile10HomeIcon';
import { Mobile10RecentsIcon } from './components/navigation/Mobile10RecentsIcon';

const MOBILE9_FOOTER_LIGHT_BACKGROUND = '#F9F9FB';
const MOBILE9_FOOTER_LIGHT_FOREGROUND = '#787878';

export function Mobile10PreviewFooter({
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
    const backgroundColor = systemFooterBackground ?? (isSmsVariant ? '#101417' : isDark ? '#000000' : MOBILE9_FOOTER_LIGHT_BACKGROUND);
    const foregroundColor = systemFooterForeground ?? (isSmsVariant ? '#ECEDEF' : isDark ? '#EFEFEF' : MOBILE9_FOOTER_LIGHT_FOREGROUND);

    return (
      <div
        className="flex h-[48px] w-full shrink-0 items-center justify-center"
        style={{ backgroundColor, color: foregroundColor }}
        data-mobile10-system-navigation="three-button"
    >
        <div className="flex items-center justify-center gap-[60px]">
            <Mobile10RecentsIcon />
            <Mobile10HomeIcon />
            <Mobile10BackIcon />
        </div>
    </div>
    );
}
