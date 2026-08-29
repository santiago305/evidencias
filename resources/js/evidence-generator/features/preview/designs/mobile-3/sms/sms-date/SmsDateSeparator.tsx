import { buildSmsDateSeparatorLabel } from '../smsDateTime';

export function SmsDateSeparator({ dateKey, time, color, currentDate }: { dateKey: string; time: string; color: string; currentDate?: Date }) {
    const label = buildSmsDateSeparatorLabel(dateKey, time, currentDate);

    return (
        <div className="my-5 flex justify-center" role="separator" aria-label={`${label.dateLabel} ${label.timeLabel}`.trim()}>
            <span className="text-[11.5px] leading-none font-medium tracking-[-0.1px]" style={{ color }}>
                {label.dateLabel ? (
                    <>
                        {label.dateLabel} <span className="px-0.5 text-[14px] leading-none">·</span>{' '}
                    </>
                ) : null}
                {label.timeLabel}
            </span>
        </div>
    );
}
