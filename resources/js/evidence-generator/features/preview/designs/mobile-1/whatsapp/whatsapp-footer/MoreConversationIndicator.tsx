import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import { MoreConversationIcon } from '../../../iconos/MoreConversationIcon';

interface MoreConversationIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    iconClassName?: string;
    themeMode?: PreviewThemeMode;
}

export function MoreConversationIndicator({ className, iconClassName, themeMode = 'light', ...props }: MoreConversationIndicatorProps) {
    const isDark = themeMode === 'dark';

    return (
        <div
            aria-label="Hay más conversación abajo"
            role="status"
            className={cn(
                'flex h-[32.5px] w-[32.5px] items-center justify-center rounded-full shadow-lg shadow-black/10 backdrop-blur-sm',
                isDark ? 'border-0 bg-[#26353a] text-[#949fa5]' : 'border border-black/10 bg-white/95 text-[#54656f]',
                className,
            )}
            {...props}
        >
            <MoreConversationIcon aria-hidden="true" className={cn('h-[12.5px] w-[12.5px]', iconClassName)} />
        </div>
    );
}

export default MoreConversationIndicator;
