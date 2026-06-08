import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { HTMLAttributes } from 'react';

interface MoreConversationIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    iconClassName?: string;
}

export function MoreConversationIndicator({ className, iconClassName, ...props }: MoreConversationIndicatorProps) {
    return (
        <div
            aria-label="Hay más conversación abajo"
            role="status"
            className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#54656f] shadow-lg shadow-black/10 backdrop-blur-sm',
                className,
            )}
            {...props}
        >
            <ChevronDown aria-hidden="true" className={cn('h-5 w-5', iconClassName)} strokeWidth={2.25} />
        </div>
    );
}

export default MoreConversationIndicator;
