import React from 'react';
import type { PreviewThemeMode } from '../../../../../../types';

type MsgStatus = 'sent' | 'delivered' | 'read';

type QuotedMessage = {
    author: string;
    text: string;
    accentClassName?: string;
    accentColor?: string;
    authorColor?: string;
};

type WhatsappTextBubbleProps = {
    side: 'in' | 'out';
    firstInGroup?: boolean;
    time?: string;
    status?: MsgStatus;
    id?: string;
    quote?: QuotedMessage;
    themeMode?: PreviewThemeMode;
    children: React.ReactNode;
};

function BubbleTail({ side, colorClass }: { side: 'left' | 'right'; colorClass: string }) {
    if (side === 'left') {
        return (
            <span className={`absolute -left-1.75 ${colorClass}`}>
                <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet">
                    <title>tail-in</title>
                    <path opacity="0.13" fill="#000000" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z" />
                    <path fill="currentColor" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z" />
                </svg>
            </span>
        );
    }

    return (
        <span className={`absolute -right-1.75 ${colorClass}`}>
            <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet">
                <title>tail-out</title>
                <path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z" fill="#000000" />
                <path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z" />
            </svg>
        </span>
    );
}

function QuotedMessageBox({ quote, themeMode }: { quote: QuotedMessage; themeMode: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['rounded-[7px]', isDark ? 'bg-black/20' : 'bg-black/5'].join(' ')}>
            <div className="mb-0.75 flex overflow-hidden rounded-[6px]">
                <div
                    className={['w-1 shrink-0 rounded-s-[6px]', quote.accentColor ? '' : (quote.accentClassName ?? 'bg-[#0063CB]')].join(' ')}
                    style={quote.accentColor ? { backgroundColor: quote.accentColor } : undefined}
                />
                <div className="flex min-w-0 flex-col gap-1.5 px-2 pt-1 pb-2">
                    <p className="truncate text-[10.5px] leading-4 font-semibold text-[#0078D7]" style={quote.authorColor ? { color: quote.authorColor } : undefined}>
                        {quote.author}
                    </p>
                    <p className={['line-clamp-2 text-[11px] leading-4', isDark ? 'text-[#878F92]' : 'text-black/60'].join(' ')}>{quote.text}</p>
                </div>
            </div>
        </div>
    );
}

function renderBubbleContent(children: React.ReactNode): React.ReactNode {
    const nodes = React.Children.toArray(children);

    if (nodes.length <= 1) {
        return children;
    }

    return nodes.map((node, idx) => {
        const isLast = idx === nodes.length - 1;

        if (React.isValidElement<{ className?: string }>(node)) {
            const currentClassName = node.props.className ?? '';
            const nextClassName = [currentClassName, !isLast ? 'block' : ''].filter(Boolean).join(' ');

            return React.cloneElement(node, {
                className: nextClassName || undefined,
            });
        }

        return (
            <span key={idx} className={!isLast ? 'block' : undefined}>
                {node}
            </span>
        );
    });
}

function Ticks({ status, themeMode }: { status: MsgStatus; themeMode: PreviewThemeMode }) {
    const color = status === 'read' ? (themeMode === 'dark' ? 'text-[#53BDEB]' : 'text-[#007BFC]') : themeMode === 'dark' ? 'text-[#878F92]' : 'text-[rgba(0,0,0,0.6)]';

    return (
        <span className={`${color} inline-block`}>
            <svg viewBox="0 0 16 11" height="8" width="12" fill="currentColor">
                <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z" />
                <path d="M8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" />
            </svg>
        </span>
    );
}

export function WhatsappDesktopTextBubble({ side, firstInGroup, time, status, id, quote, themeMode = 'light', children }: WhatsappTextBubbleProps) {
    const isOut = side === 'out';
    const isDark = themeMode === 'dark';
    const bubbleBg = isDark ? (isOut ? 'bg-[#134D37]' : 'bg-[#242626]') : isOut ? 'bg-[#D9FDD3]' : 'bg-white';
    const bubbleText = isDark ? 'text-[#FBFEFF]' : 'text-[#111B21]';
    const tailColor = isDark ? (isOut ? 'text-[#134D37]' : 'text-[#242626]') : isOut ? 'text-[#D9FDD3]' : 'text-white';
    const metaText = isDark ? 'text-[#878F92]' : 'text-[rgba(0,0,0,0.6)]';
    const cornerCut = firstInGroup ? (isOut ? 'rounded-tr-none' : 'rounded-tl-none') : '';
    const content = renderBubbleContent(children);

    return (
        <div id={id} className={`flex px-15.75 ${isOut ? 'justify-end' : 'justify-start'}`}>
            <div className="relative max-w-[70%] flex-none text-[14.2px] leading-4.75">
                {firstInGroup && <BubbleTail side={isOut ? 'right' : 'left'} colorClass={tailColor} />}

                <div className={['relative z-10 rounded-[7.5px]', cornerCut, bubbleBg, bubbleText, 'shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]'].join(' ')}>
                    <div className="box-border py-1 px-0.5 select-text">
                        {quote ? <QuotedMessageBox quote={quote} themeMode={themeMode} /> : null}

                        <div className="relative overflow-hidden ps-1.25 pe-1.25 break-words whitespace-pre-wrap">
                            <span data-testid="selectable-text" dir="ltr" className="visible text-[12px] leading-4.5 font-normal tracking-[0.005rem] select-text" style={{ minHeight: '0px' }}>
                                {content}
                            </span>
                            <span>
                                <span aria-hidden="true" className="invisible inline-flex h-0 align-middle text-[0.6875rem] leading-4.75">
                                    {isOut ? <span className="w-4 shrink-0 grow-0" /> : null}
                                    <span className="shrink-0 grow-0">{time ?? ''}</span>
                                </span>
                            </span>
                        </div>

                        {(time || (isOut && status)) && (
                            <div className="relative z-10 float-right -mt-3 -mb-1.25 ps-0 pe-1">
                                <div className={['flex h-3.75 items-center text-[0.6875rem] leading-3.75 whitespace-nowrap', metaText, isOut ? 'cursor-pointer' : ''].join(' ')}>
                                    {time && (
                                        <span className="inline-block align-top" dir="auto">
                                            <span className={['inline min-w-0 max-w-full wrap-break-word text-[10px] leading-4 font-normal break-all whitespace-pre-line select-text', metaText].join(' ')}>
                                                {time}
                                            </span>
                                        </span>
                                    )}
                                    {isOut && status && (
                                        <div className="flex justify-end ps-0.75">
                                            <Ticks status={status} themeMode={themeMode} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
