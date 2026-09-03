import { Fragment, useState } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { EncryptionLockIcon, SmsMobileTextBubble } from './sms-bubbles';
import { SmsDateSeparator } from './sms-date';
import { SmsMobileInputBar, SmsQuickReplies } from './sms-footer';
import { getSmsColors } from './smsAppearance';
import { buildSmsConversationHeader } from './smsDateTime';
import { buildSmsMessages, getSmsGroupPosition, shouldShowSmsDateSeparator, shouldShowSmsMessageMetadata } from './smsMessages';
import { getSmsQuickReplies } from './smsQuickReplies';
import type { SmsData, SmsDesignVariant } from './smsTypes';

export function SmsConversation({
    data,
    themeMode,
    currentDate,
    variant = 'mobile-3',
}: {
    data: SmsData;
    themeMode: PreviewThemeMode;
    currentDate?: Date;
    variant?: SmsDesignVariant;
}) {
    const colors = getSmsColors(themeMode, variant);
    const messages = buildSmsMessages(data);
    const firstMessage = messages[0];
    const [conversationHeader] = useState(() => buildSmsConversationHeader(data));
    const [draft, setDraft] = useState('');
    const suggestions = getSmsQuickReplies(data.generatedMessages);
    const supportsQuickReplies = variant === 'mobile-1' || variant === 'mobile-2';

    return (
        <main
            className="group relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[28px]"
            style={{ backgroundColor: colors.conversation }}
        >
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
                                compactBottomSpacing={variant === 'mobile-2' && index === messages.length - 1}
                            />
                        </Fragment>
                    );
                })}
            </div>
            {supportsQuickReplies ? (
                <SmsQuickReplies
                    suggestions={suggestions}
                    color={colors.secondaryText}
                    borderColor={colors.quickReplyBorder}
                    className="hidden flex-row-reverse justify-start group-focus-within:flex"
                    variant={variant}
                    onSuggestionClick={(suggestion) => setDraft(suggestion.label)}
                />
            ) : null}
            <SmsMobileInputBar themeMode={themeMode} variant={variant} draft={draft} onDraftChange={setDraft} />
        </main>
    );
}
