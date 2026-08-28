import { Fragment } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { SmsMobileTextBubble } from './sms-bubbles';
import { SmsMobileInputBar } from './sms-footer';
import { getSmsColors } from './smsAppearance';
import { formatSmsFullDate } from './smsDateTime';
import { buildSmsMessages } from './smsMessages';
import type { SmsData } from './smsTypes';

export function SmsConversation({ data, themeMode, currentDate }: { data: SmsData; themeMode: PreviewThemeMode; currentDate?: Date }) {
    const colors = getSmsColors(themeMode);
    const messages = buildSmsMessages(data);
    const firstMessage = messages[0];

    return (
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[28px]" style={{ backgroundColor: colors.conversation }}>
            <div className="flex-1 [scrollbar-width:none] overflow-y-auto px-2 pt-5 pb-[15px] [&::-webkit-scrollbar]:hidden">
                <div className="mb-[25px] flex justify-center">
                    <span className="text-[11.5px] leading-none font-medium tracking-[-0.1px]" style={{ color: colors.secondaryText }}>
                        {firstMessage ? formatSmsFullDate(firstMessage.dateKey, firstMessage.time) : 'Hoy'}
                    </span>
                </div>
                <div className="mb-[7px] text-center text-[11.5px] leading-4" style={{ color: colors.secondaryText }}>
                    Chat RCS con {data.telefono.trim() || '-'}
                </div>
                <div
                    className="mb-[26px] flex items-center justify-center gap-1.5 text-[10.5px] leading-[15px]"
                    style={{ color: colors.secondaryText }}
                >
                    <LockIcon />
                    <span>Ahora el chat está encriptado de extremo a extremo.</span>
                    <span className="underline underline-offset-2" style={{ color: colors.link }}>
                        Más información
                    </span>
                </div>

                {messages.map((message, index) => {
                    const previous = messages[index - 1];
                    const next = messages[index + 1];
                    const isFirstInGroup = !previous || previous.side !== message.side || previous.dateKey !== message.dateKey;
                    const isLastInGroup = !next || next.side !== message.side || next.dateKey !== message.dateKey;

                    return (
                        <Fragment key={message.id}>
                            <SmsMobileTextBubble
                                message={message}
                                isFirstInGroup={isFirstInGroup}
                                isLastInGroup={isLastInGroup}
                                data={data}
                                colors={colors}
                                currentDate={currentDate}
                            />
                            {next && next.dateKey !== message.dateKey ? (
                                <div className="mb-5 flex justify-center text-[11.5px] font-medium" style={{ color: colors.secondaryText }}>
                                    {formatSmsFullDate(next.dateKey, next.time)}
                                </div>
                            ) : null}
                        </Fragment>
                    );
                })}
            </div>
            <SmsMobileInputBar themeMode={themeMode} />
        </main>
    );
}

function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-[13px] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
            <rect x="5.5" y="10" width="13" height="10" rx="1.8" />
            <circle cx="12" cy="14.2" r="1.05" fill="currentColor" stroke="none" />
            <path d="M12 15.1v2" strokeWidth="1.6" />
        </svg>
    );
}
