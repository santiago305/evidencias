import { Fragment, useState } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { EncryptionLockIcon, SmsMobileTextBubble } from './sms-bubbles';
import { SmsDateSeparator } from './sms-date';
import { SmsMobileInputBar } from './sms-footer';
import { getSmsColors } from './smsAppearance';
import { buildSmsConversationHeader } from './smsDateTime';
import { buildSmsMessages, getSmsGroupPosition, shouldShowSmsDateSeparator, shouldShowSmsMessageMetadata } from './smsMessages';
import type { SmsData } from './smsTypes';

export function SmsConversation({ data, themeMode, currentDate }: { data: SmsData; themeMode: PreviewThemeMode; currentDate?: Date }) {
    const colors = getSmsColors(themeMode);
    const messages = buildSmsMessages(data);
    const firstMessage = messages[0];
    const [conversationHeader] = useState(() => buildSmsConversationHeader(data));

    return (
        <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[28px]" style={{ backgroundColor: colors.conversation }}>
            <div className="flex-1 [scrollbar-width:none] overflow-y-auto px-2 pt-5 pb-[15px] [&::-webkit-scrollbar]:hidden">
                {firstMessage ? (
                    <SmsDateSeparator
                        dateKey={firstMessage.dateKey}
                        time={firstMessage.time}
                        color={colors.secondaryText}
                        currentDate={currentDate}
                    />
                ) : null}
                <div
                    className={`text-center text-[11.5px] leading-4 ${conversationHeader.kind === 'sms' ? 'mb-[13px]' : 'mb-[0px]'}`}
                    style={{ color: colors.secondaryText }}
                >
                    {conversationHeader.kind === 'sms' ? conversationHeader.title : `Chat RCS con ${data.telefono.trim() || '-'}`}
                </div>
                {conversationHeader.kind === 'rcs' ? (
                    <div
                        className="mb-[26px] flex items-center justify-center gap-1.5 text-[10.5px] leading-[15px]"
                        style={{ color: colors.secondaryText }}
                    >
                        <EncryptionLockIcon color={colors.metadataIcon} />
                        <span>Ahora el chat está encriptado de extremo a extremo.</span>
                        <span className="underline underline-offset-2" style={{ color: colors.link }}>
                            Más información
                        </span>
                    </div>
                ) : null}

                {messages.map((message, index) => {
                    const previous = messages[index - 1];
                    const showDateSeparator = index > 0 && shouldShowSmsDateSeparator(previous?.dateKey, message.dateKey, currentDate);

                    return (
                        <Fragment key={`${data.seedCode ?? data.fechaHoraRegistro ?? 'sms'}-${message.id}`}>
                            {showDateSeparator ? (
                                <SmsDateSeparator
                                    dateKey={message.dateKey}
                                    time={message.time}
                                    color={colors.secondaryText}
                                    currentDate={currentDate}
                                />
                            ) : null}
                            <SmsMobileTextBubble
                                message={message}
                                showMetadata={shouldShowSmsMessageMetadata(index, messages.length)}
                                showLock={conversationHeader.kind === 'rcs'}
                                conversationType={conversationHeader.kind}
                                data={data}
                                colors={colors}
                                currentDate={currentDate}
                                groupPosition={getSmsGroupPosition(messages, index)}
                            />
                        </Fragment>
                    );
                })}
            </div>
            <SmsMobileInputBar themeMode={themeMode} />
        </main>
    );
}
