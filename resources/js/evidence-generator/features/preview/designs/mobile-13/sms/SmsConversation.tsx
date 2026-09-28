import { Fragment, useState } from 'react';
import type { PreviewThemeMode } from '../../../../../types';
import { SMS_INITIAL_CONTENT_OFFSET } from './smsHeaderLayout';
import { SmsMobileTextBubble } from './sms-bubbles';
import { SmsDateSeparator } from './sms-date';
import { SmsMobileInputBar, SmsQuickReplies } from './sms-footer';
import { getMobile13SmsContentColors } from './smsContentAppearance';
import { buildSmsMessages, getSmsGroupPosition, shouldShowSmsDateSeparator } from './smsMessages';
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
    const colors = getMobile13SmsContentColors(themeMode);
    const messages = buildSmsMessages(data);
    const firstMessage = messages[0];
    const [draft, setDraft] = useState('');
    const [isComposerFocused, setIsComposerFocused] = useState(false);
    const suggestions = getSmsQuickReplies(data.generatedMessages);
    const supportsQuickReplies = true;

    return (
        <main className="group relative flex min-h-0 flex-1 flex-col overflow-hidden" style={{ backgroundColor: colors.conversation }}>
            <div
                data-mobile13-sms-scroll-area="true"
                className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto px-2 pb-[80px] [&::-webkit-scrollbar]:hidden"
                style={{ paddingTop: `${SMS_INITIAL_CONTENT_OFFSET}px` }}
            >
                <div className="mb-[0px] text-center text-[10px] leading-4" style={{ color: colors.secondaryText }}>
                    <span>Mensajes de texto • SMS</span>
                </div>
                {firstMessage ? (
                    <SmsDateSeparator
                        dateKey={firstMessage.dateKey}
                        time={firstMessage.time}
                        color={colors.secondaryText}
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
                                    color={colors.secondaryText}
                                    currentDate={currentDate}
                                />
                            ) : null}
                            <SmsMobileTextBubble
                                message={message}
                                showMetadata={false}
                                colors={colors}
                                groupPosition={getSmsGroupPosition(messages, index)}
                                compactBottomSpacing={index === messages.length - 1}
                                currentDate={currentDate}
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
                    className={
                        isComposerFocused ? 'hidden flex-row-reverse justify-start' : 'hidden flex-row-reverse justify-start group-focus-within:flex'
                    }
                    onSuggestionClick={(suggestion) => setDraft(suggestion.label)}
                />
            ) : null}
            <SmsMobileInputBar
                themeMode={themeMode}
                draft={draft}
                onDraftChange={setDraft}
                composerLayout={composerLayout}
                onInputFocusChange={(isFocused) => setIsComposerFocused(isFocused)}
            />
        </main>
    );
}
