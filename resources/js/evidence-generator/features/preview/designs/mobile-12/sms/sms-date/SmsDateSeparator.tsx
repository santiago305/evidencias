import { buildSmsDateSeparatorLabel, formatSmsMessageDateTime } from '../smsDateTime';

export function SmsDateSeparator({ dateKey, time, color, currentDate }: { dateKey: string; time: string; color: string; currentDate?: Date }) {
    const label = buildSmsDateSeparatorLabel(dateKey, time, currentDate);
    const dateLabelIncludesTime = label.dateLabel.includes(label.timeLabel);
    const formattedLabel = formatSmsMessageDateTime(dateKey, time, currentDate);
    const displayLabel = formattedLabel.slice(0, formattedLabel.indexOf(' • ')).includes(',') ? formatSmsLongDate(dateKey) : formattedLabel;

    if (formattedLabel.length > 0) {
        return (
            <div className="my-5 flex justify-center" role="separator" aria-label={displayLabel}>
                <span className="text-[12px] leading-none font-medium tracking-[-0.1px]" style={{ color }}>
                    {displayLabel}
                </span>
            </div>
        );
    }

    return (
        <div className="my-5 flex justify-center" role="separator" aria-label={`${label.dateLabel} ${label.timeLabel}`.trim()}>
            <span className="text-[12px] leading-none font-medium tracking-[-0.1px]" style={{ color }}>
                {label.dateLabel ? (
                    <>
                        {label.dateLabel} <span className="px-0.5 text-[14px] leading-none">·</span>{' '}
                    </>
                ) : null}
                {!dateLabelIncludesTime ? label.timeLabel : null}
            </span>
        </div>
    );
}

function formatSmsLongDate(dateKey: string): string {
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${dateKey}T00:00:00.000Z`));
}
