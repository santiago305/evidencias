import type { PreviewThemeMode } from '../../../../types';
import { Mobile14BackIcon } from './components/navigation/Mobile14BackIcon';
import { Mobile14HomeIcon } from './components/navigation/Mobile14HomeIcon';
import { Mobile14RecentsIcon } from './components/navigation/Mobile14RecentsIcon';

const MOBILE9_FOOTER_LIGHT_BACKGROUND = '#F9F9FB';
const MOBILE9_FOOTER_LIGHT_FOREGROUND = '#787878';

export function Mobile14PreviewFooter({
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
        className="flex h-[42px] w-full shrink-0 items-center justify-center"
        style={{ backgroundColor, color: foregroundColor }}
        data-mobile14-system-navigation="three-button"
    >
        <div className="flex items-center justify-center gap-[60px]">
            <Mobile14RecentsIcon />
            <Mobile14HomeIcon />
            <Mobile14BackIcon />
        </div>
    </div>
    );
}
