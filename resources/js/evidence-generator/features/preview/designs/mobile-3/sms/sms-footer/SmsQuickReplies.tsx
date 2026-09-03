import type { SmsQuickReply } from '../smsQuickReplies';
import type { SmsDesignVariant } from '../smsTypes';

export function SmsQuickReplies({
    suggestions,
    onSuggestionClick,
    color,
    borderColor,
    className = '',
    variant,
}: {
    suggestions: SmsQuickReply[];
    onSuggestionClick: (suggestion: SmsQuickReply) => void;
    color: string;
    borderColor: string;
    className?: string;
    variant?: SmsDesignVariant;
}) {
    return (
        <div
            className={`shrink-0 items-center justify-center gap-2 px-2 pt-2.5 pb-3 ${className}`}
            aria-label="Sugerencias rápidas"
            data-sms-quick-replies={variant}
        >
            {suggestions.map((suggestion) => (
                <button
                    key={suggestion.id}
                    type="button"
                    className="h-11 w-fit min-w-[72px] shrink-0 rounded-full border px-[10px] text-center text-[14px] leading-none font-medium transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color, borderColor }}
                    aria-label={`Usar sugerencia ${suggestion.label}`}
                    onClick={() => onSuggestionClick(suggestion)}
                >
                    {suggestion.label}
                </button>
            ))}
        </div>
    );
}
