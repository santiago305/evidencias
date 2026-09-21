import { Fragment, useState } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { Mobile12SmsSaveContactCard } from './Mobile12SmsSaveContactCard';
import { SmsMobileTextBubble } from './sms-bubbles';
import { SmsDateSeparator } from './sms-date';
import { SmsMobileInputBar, SmsQuickReplies } from './sms-footer';
import { getSmsColors } from './smsAppearance';
import { buildSmsMessages, getSmsGroupPosition, shouldShowSmsDateSeparator, shouldShowSmsMessageMetadata } from './smsMessages';
import { getSmsQuickReplies } from './smsQuickReplies';
import type { SmsData } from './smsTypes';

export function SmsConversation({
    data,
    themeMode,
    currentDate,
    composerLayout,
}: {
    data: SmsData;
    themeMode: PreviewThemeMode;
    currentDate?: Date;
    composerLayout?: {
        messageAreaMaxWidth?: string;
    };
}) {
    const colors = getSmsColors(themeMode);
    const smsTimeColor = themeMode === 'dark' ? '#A0A0A0' : colors.secondaryText;
    const displayTelefono = formatMobile12SmsPhone(data.telefono);
    const messages = buildSmsMessages(data);
    const firstMessage = messages[0];
    const [draft, setDraft] = useState('');
    const suggestions = getSmsQuickReplies(data.generatedMessages);
    const supportsQuickReplies = true;

    return (
        <main
            className="group relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[28px]"
            style={{ backgroundColor: colors.conversation }}
        >
            <div className="flex-1 [scrollbar-width:none] overflow-y-auto px-2 pt-3 pb-[15px] [&::-webkit-scrollbar]:hidden">
                <Mobile12SmsSaveContactCard telefono={displayTelefono} themeMode={themeMode} />

                {firstMessage ? (
                    <SmsDateSeparator
                        dateKey={firstMessage.dateKey}
                        time={firstMessage.time}
                        color={smsTimeColor}
                        currentDate={currentDate}
                    />
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
                                    color={smsTimeColor}
                                    currentDate={currentDate}
                                />
                            ) : null}
                            <SmsMobileTextBubble
                                message={message}
                                showMetadata={shouldShowSmsMessageMetadata(index, messages.length)}
                                colors={colors}
                                metadataTextColor={smsTimeColor}
                                groupPosition={getSmsGroupPosition(messages, index)}
                                compactBottomSpacing={index === messages.length - 1}
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
                    onSuggestionClick={(suggestion) => setDraft(suggestion.label)}
                />
            ) : null}
            <SmsMobileInputBar themeMode={themeMode} draft={draft} onDraftChange={setDraft} composerLayout={composerLayout} />
        </main>
    );
}

function formatMobile12SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    return /^\d{9}$/.test(trimmed)
        ? trimmed.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
        : trimmed;
}
