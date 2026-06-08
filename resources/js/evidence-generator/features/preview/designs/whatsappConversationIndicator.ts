export type ConversationScrollVariant = 'mobile' | 'desktop';

export function getConversationMoreIndicatorThreshold(variant: ConversationScrollVariant): number {
    return variant === 'mobile' ? 0.98 : 0.95;
}

export function shouldShowConversationMoreIndicator(
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
    variant: ConversationScrollVariant,
): boolean {
    if (!Number.isFinite(scrollTop) || !Number.isFinite(scrollHeight) || !Number.isFinite(clientHeight)) {
        return false;
    }

    if (scrollHeight <= clientHeight) {
        return false;
    }

    const maxScrollTop = scrollHeight - clientHeight;

    if (maxScrollTop <= 0) {
        return false;
    }

    const scrollProgress = scrollTop / maxScrollTop;

    return scrollProgress < getConversationMoreIndicatorThreshold(variant);
}
