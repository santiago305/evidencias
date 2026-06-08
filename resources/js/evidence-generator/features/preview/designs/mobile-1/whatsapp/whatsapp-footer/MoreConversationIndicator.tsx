import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import { MoreConversationIcon } from '../../../iconos/MoreConversationIcon';

interface MoreConversationIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    iconClassName?: string;
}

export function MoreConversationIndicator({ className, iconClassName, ...props }: MoreConversationIndicatorProps) {
    return (
        <div
            aria-label="Hay más conversación abajo"
            role="status"
            className={cn(
                'flex h-6.5 w-6.5 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#54656f] shadow-lg shadow-black/10 backdrop-blur-sm',
                className,
            )}
            {...props}
        >
            <MoreConversationIcon aria-hidden="true" className={cn('h-2.5/c w-2.5', iconClassName)} />
        </div>
    );
}

export default MoreConversationIndicator;
