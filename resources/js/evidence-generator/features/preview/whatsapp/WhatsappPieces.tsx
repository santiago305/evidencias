import React from "react";

export function MessageGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-0.5 mb-4 ${className}`}>{children}</div>;
}

export function DayChip({ text }: { text: string }) {
  return (
    <div className="sticky top-2 z-20 flex justify-center my-4">
      <span className="rounded-md bg-[#fefdfc] px-2 py-0.5 text-[10px] text-[#667781] shadow font-medium">
        {text}
      </span>
    </div>
  );
}

export function IncomingBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="segoe-ui max-w-[85%] rounded-2xl rounded-tl-md bg-white border border-black/5 px-3 py-2 text-[12px] text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </div>
  );
}

export function OutgoingBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="segoe-ui max-w-[85%] rounded-2xl rounded-tr-md bg-[#d9fdd3] border border-black/5 px-3 py-2 text-[12px] text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </div>
  );
}

export function BubbleTitle({ children }: { children: React.ReactNode }) {
  return <div className="segoe-ui text-[12px] font-semibold mb-1">{children}</div>;
}

export function BubbleRow({ k, v }: { k: string; v: string }) {
  const value = v?.trim() ? v : "—";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-slate-700">{k}</span>
      <span className="text-[11px] text-slate-900 font-medium truncate max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

export function PanelItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white px-2.5 py-2">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="text-[11px] font-semibold text-slate-900 truncate">
        {value?.trim() ? value : "—"}
      </div>
    </div>
  );
}


export type MsgStatus = "sent" | "delivered" | "read";

export type QuotedMessage = {
  author: string;
  text: string;
  accentClassName?: string;
  accentColor?: string;
  authorColor?: string;
};

function BubbleTail({
  side,
  colorClass,
}: {
  side: "left" | "right";
  colorClass: string;
}) {
  // Tail tipo WhatsApp (inline, para no depender de otro componente)
  if (side === "left") {
    return (
      <span className={`absolute -left-1.75 ${colorClass}`}>
        <svg
          viewBox="0 0 8 13"
          height="13"
          width="8"
          preserveAspectRatio="xMidYMid meet"
          version="1.1"
          x="0px"
          y="0px"
          enableBackground="new 0 0 8 13"
        >
          <title>tail-in</title>
          <path
            opacity="0.13"
            fill="#000000"
            d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"
          ></path>
          <path
            fill="currentColor"
            d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"
          ></path>
        </svg>
      </span>
    );
  }

  return (
    <span className={`absolute -right-1.75 ${colorClass}`}>
      <svg
        viewBox="0 0 8 13"
        height="13"
        width="8"
        preserveAspectRatio="xMidYMid meet"
        version="1.1"
        x="0px"
        y="0px"
        enableBackground="new 0 0 8 13"
      >
        <title>tail-out</title>
        <path
          opacity="0.13"
          d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
          fill="#000000"
        ></path>
        <path
          fill="currentColor"
          d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
        ></path>
      </svg>
    </span>
  );
}

function QuotedMessageBox({ quote }: { quote: QuotedMessage }) {
  return (
    <div className="rounded-[7px] bg-black/5">
      <div className="flex overflow-hidden rounded-[6px] mb-0.75">
        <div
          className={["w-1 shrink-0 rounded-s-[6px]", quote.accentColor ? "" : quote.accentClassName ?? "bg-[#0063CB]"].join(" ")}
          style={quote.accentColor ? { backgroundColor: quote.accentColor } : undefined}
        />

        <div className="flex min-w-0 flex-col gap-1.5 px-2 pt-1 pb-2">
          <p className="truncate text-[10.5px] font-semibold leading-4 text-[#0078D7]" style={quote.authorColor ? { color: quote.authorColor } : undefined}>
            {quote.author}
          </p>
          <p className="line-clamp-2 text-[11px] leading-4 text-black/60">{quote.text}</p>
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
      const currentClassName = node.props.className ?? "";
      const nextClassName = [currentClassName, !isLast ? "block" : ""].filter(Boolean).join(" ");

      return React.cloneElement(node, {
        className: nextClassName || undefined,
      });
    }

    return (
      <span key={idx} className={!isLast ? "block" : undefined}>
        {node}
      </span>
    );
  });
}

// Placeholder si ya lo tienes, borra esto
function Ticks({ status }: { status: MsgStatus }) {
  // Solo ejemplo: ajusta a tu implementación real
  const color =
    status === "read" ? "text-[#007BFC]" : "text-[rgba(0,0,0,0.6)]";
  return (
    <span className={`${color} inline-block`}>
      {/* Doble check */}
      <svg viewBox="0 0 16 11" height="8" width="12" fill="currentColor">
        <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z" />
        <path d="M8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" />
      </svg>
    </span>
  );
}

export function Bubble({
  side,
  firstInGroup,
  time,
  status,
  id,
  quote,
  children,
}: {
  side: "in" | "out";
  firstInGroup?: boolean;
  time?: string;
  status?: MsgStatus;
  id?: string;
  quote?: QuotedMessage;
  children: React.ReactNode;
}) {
  const isOut = side === "out";
  const bubbleBg = isOut ? "bg-[#D9FDD3]" : "bg-white";
  const tailColor = isOut ? "text-[#D9FDD3]" : "text-white";
  const cornerCut = firstInGroup ? (isOut ? "rounded-tr-none" : "rounded-tl-none") : "";
  const content = renderBubbleContent(children);

  return (
    <div id={id} className={`flex ${isOut ? "justify-end" : "justify-start"} px-15.75`}>
      <div className="relative max-w-[70%] flex-none text-[14.2px] leading-4.75">
        {firstInGroup && <BubbleTail side={isOut ? "right" : "left"} colorClass={tailColor} />}

        <div
          className={[
            "relative z-10",
            "rounded-[7.5px]",
            cornerCut,
            bubbleBg,
            "shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
          ].join(" ")}
        >
          <div className="box-border p-1 select-text">
            {quote ? <QuotedMessageBox quote={quote} /> : null}

            <div className="relative overflow-hidden whitespace-pre-wrap break-words ps-0.75 pe-0.75">
              <span
                data-testid="selectable-text"
                dir="ltr"
                className="segoe-ui visible select-text text-[12px] font-normal leading-4.5 tracking-[0.01rem]"
                style={{ minHeight: "0px" }}
              >
                {content}
              </span>

              <span>
                <span
                  aria-hidden="true"
                  className="invisible inline-flex h-0 align-middle text-[0.6875rem] leading-3.75 -mr-1"
                >
                  {isOut ? <span className="w-4 shrink-0 grow-0" /> : null}
                  <span className="shrink-0 grow-0">{time ?? ""}</span>
                </span>
              </span>
            </div>

            {(time || (isOut && status)) && (
              <div className="relative z-10 float-right -mt-3.5 -mb-1.25 ps-1 pe-0">
                <div
                  className={[
                    "flex items-center h-3.75 whitespace-nowrap text-[0.6875rem] leading-3.75",
                    "text-[rgba(0,0,0,0.6)]",
                    isOut ? "cursor-pointer" : "",
                  ].join(" ")}
                >
                  {time && (
                    <span className="inline-block align-top" dir="auto">
                      <span className="min-w-0 max-w-full inline font-normal text-[10px] leading-4 text-[rgba(0,0,0,0.6)] wrap-break-word break-all whitespace-pre-line select-text segoe-ui">
                        {time}
                      </span>
                    </span>
                  )}

                  {isOut && status && (
                    <div className="flex ps-0.75 justify-end">
                      <Ticks status={status} />
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
export function VoiceBubble({
  side,
  firstInGroup,
  time,
  status,
  duration = "0:23",
  showAvatar = false,
}: {
  side: "in" | "out";
  firstInGroup?: boolean;
  time?: string;
  status?: MsgStatus;
  duration?: string;
  showAvatar?: boolean;
}) {
  const isOut = side === "out";

  return (
    <Bubble side={side} firstInGroup={firstInGroup} time={time} status={status}>
      <div className="flex items-center gap-2">
        {/* Play */}
        <button
          className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center shrink-0"
          type="button"
          aria-label="Play"
        >
          <svg width="14" height="14" viewBox="0 0 16 16">
            <path fill="currentColor" d="M6 4.5v7l6-3.5z" />
          </svg>
        </button>

        {/* Wave */}
        <div className="flex-1 min-w-30">
          <div className="h-3 rounded-full bg-black/10 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[35%] bg-black/20" />
          </div>
          <div className="mt-1 text-[10px] text-[#667781]">{duration}</div>
        </div>

        {/* Avatar (incoming style) */}
        {showAvatar && !isOut && (
          <div className="h-9 w-9 rounded-full bg-black/10 shrink-0" />
        )}
      </div>
    </Bubble>
  );
}

export function EncryptedMessage() {
  return (
    <div className="relative">
      <div>
        <div className="relative pb-2">
          <div className="flex justify-center">
            <div>
              <div className="mx-auto flex max-w-125 flex-col justify-center px-15.75">
                <span></span>

                <div className="relative mb-0 box-border inline-block max-w-full flex-none rounded-[7.35px] bg-[#FFF0D4] px-3 pt-1.25 pb-1.5 text-center text-[10px] leading-4.25 text-black/60 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                  <div className="segoe-ui relative z-10 rounded-[7.35px]">
                    <div className="cursorpointer">
                      <span>
                        <div className="me-1 mt-1 inline-block align-top text-black/60">
                          <span aria-hidden="true" data-icon="lock-small">
                            <svg
                              viewBox="0 0 10 12"
                              height="10"
                              width="8"
                              preserveAspectRatio="xMidYMid meet"
                              version="1.1"
                            >
                              <title>lock-small</title>
                              <path
                                d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </div>

                        <span className="segoe-ui visible min-h-0 wrap-break-word text-[9.8px]">
                          Los mensajes y las llamadas están cifrados de extremo
                          a extremo. Solo las personas en este chat pueden
                          leerlos, escucharlos o compartirlos. Haz clic para
                          obtener más información.
                        </span>
                      </span>
                    </div>

                    <span></span>
                    <div></div>
                  </div>

                  <div className="absolute top-1/2 -mt-3.25 flex w-25.25 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-1 order-0 min-w-0 min-h-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function TempporalMessage() {
  return (
    <div className="relative">
      <div>
        <div className="relative pb-2">
          <div className="flex justify-center">
            <div>
              <div className="mx-auto flex max-w-125 flex-col justify-center px-15.75">
                <span></span>

                <div className="relative mb-0 box-border inline-block max-w-full flex-none rounded-[7.35px] bg-[#fefdfc] px-3 pt-1.25 pb-1.5 text-center text-[10px] leading-4.25 text-[#667781] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                  <div className="segoe-ui relative z-10 rounded-[7.35px]">
                    <div className="cursorpointer">
                      <span>
                        <div className="me-0.5 inline-block align-top text-[#667781]">
                          <span aria-hidden="true" data-icon="lock-small">
                            <svg
                              viewBox="0 0 24 24"
                              height="12"
                              width="12"
                              preserveAspectRatio="xMidYMid meet"
                              fill="currentColor"
                              className="inline-block"
                            >
                              <title>wds-ic-disappearing-messages</title>
                              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                              <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                              <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                              <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                              <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                              <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                              <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                            </svg>
                          </span>
                        </div>

                        <span className="segoe-ui visible min-h-0 wrap-break-word text-[9.8px]">
                          Usas una duración predeterminada para los mensajes temporales en chats nuevos. Los mensajes nuevos desaparecerán de este chat después de 90 días de haber sido enviados, a menos que se use la opción para conservarlos. Haz clic para cambiar la duración predeterminada.
                        </span>
                      </span>
                    </div>

                    <span></span>
                    <div></div>
                  </div>

                  <div className="absolute top-1/2 -mt-3.25 flex w-25.25 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-1 order-0 min-w-0 min-h-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActiveTemporalMessage() {
  return (
    <div className="relative">
      <div>
        <div className="relative pb-2">
          <div className="flex justify-center">
            <div>
              <div className="mx-auto flex max-w-125 flex-col justify-center px-15.75">
                <span></span>

                <div className="relative mb-0 box-border inline-block max-w-full flex-none rounded-[7.35px] bg-[#fefdfc] px-3 pt-1.25 pb-1.5 text-center text-[10px] leading-4.25 text-[#667781] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                  <div className="segoe-ui relative z-10 rounded-[7.35px]">
                    <div className="cursorpointer">
                      <span>
                        <div className="me-0.5 inline-block align-top text-[#667781]">
                          <span aria-hidden="true" data-icon="lock-small">
                            <svg
                              viewBox="0 0 24 24"
                              height="12"
                              width="12"
                              preserveAspectRatio="xMidYMid meet"
                              fill="currentColor"
                              className="inline-block"
                            >
                              <title>wds-ic-disappearing-messages</title>
                              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                              <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                              <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                              <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                              <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                              <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                              <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                            </svg>
                          </span>
                        </div>

                        <span className="segoe-ui visible min-h-0 wrap-break-word text-[9.8px]">
                          Activaste los mensajes temporales. Los mensajes nuevos desaparecerán de este chat después de 90 días de haber sido enviados, a menos que se use la opción para conservarlos. Haz clic para cambiar esto.
                        </span>
                      </span>
                    </div>

                    <span></span>
                    <div></div>
                  </div>

                  <div className="absolute top-1/2 -mt-3.25 flex w-25.25 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-1 order-0 min-w-0 min-h-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesactiveTemporalMessage() {
  return (
    <div className="relative">
      <div>
        <div className="relative pb-2">
          <div className="flex justify-center">
            <div>
              <div className="mx-auto flex flex-col justify-center px-15.75">
                <span></span>

                <div className="relative mb-0 box-border inline-block max-w-full flex-none rounded-[7.35px] bg-[#fefdfc] px-3 pt-1.25 pb-1.5 text-center text-[10px] leading-4.25 text-[#667781] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                  <div className="segoe-ui relative z-10 rounded-[7.35px]">
                    <div className="cursorpointer">
                      <span>
                        <div className="me-0.5 mb-1 inline-block align-top text-[#667781]">
                          <span aria-hidden="true" data-icon="lock-small">
                            <svg
                              viewBox="0 0 24 24"
                              height="12"
                              width="12"
                              preserveAspectRatio="xMidYMid meet"
                              fill="currentColor"
                              className="inline-block"
                            >
                              <title>wds-ic-disappearing-messages</title>
                              <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.0547 22 12.1094 21.9996 12.1639 21.9987C12.7775 21.9888 13.2669 21.4834 13.257 20.8698C13.2471 20.2563 12.7417 19.7669 12.1281 19.7767C12.0855 19.7774 12.0428 19.7778 12 19.7778C7.70445 19.7778 4.22222 16.2955 4.22222 12C4.22222 7.70445 7.70445 4.22222 12 4.22222C12.0428 4.22222 12.0855 4.22257 12.1281 4.22325C12.7417 4.23314 13.2471 3.74375 13.257 3.13018C13.2669 2.51661 12.7775 2.0112 12.1639 2.00132C12.1094 2.00044 12.0547 2 12 2Z" />
                              <path d="M16.8592 3.25814C16.3231 2.95957 15.6465 3.15213 15.3479 3.68825C15.0493 4.22437 15.2419 4.90102 15.778 5.19959C15.8522 5.24089 15.9256 5.28338 15.9983 5.32703C16.5243 5.643 17.2069 5.4727 17.5229 4.94665C17.8389 4.4206 17.6686 3.738 17.1425 3.42203C17.0491 3.36591 16.9546 3.31127 16.8592 3.25814Z" />
                              <path d="M19.0534 6.47712C19.5794 6.16115 20.262 6.33145 20.578 6.8575C20.6341 6.95093 20.6887 7.04537 20.7419 7.14077C21.0404 7.67689 20.8479 8.35353 20.3118 8.65211C19.7756 8.95068 19.099 8.75811 18.8004 8.22199C18.7591 8.14782 18.7166 8.07439 18.673 8.00173C18.357 7.47568 18.5273 6.79309 19.0534 6.47712Z" />
                              <path d="M21.9987 11.8361C21.9888 11.2225 21.4834 10.7331 20.8698 10.743C20.2563 10.7529 19.7669 11.2583 19.7767 11.8719C19.7774 11.9145 19.7778 11.9572 19.7778 12C19.7778 12.0428 19.7774 12.0855 19.7767 12.1281C19.7669 12.7417 20.2563 13.2471 20.8698 13.257C21.4834 13.2669 21.9888 12.7775 21.9987 12.1639C21.9996 12.1094 22 12.0547 22 12C22 11.9453 21.9996 11.8906 21.9987 11.8361Z" />
                              <path d="M20.3118 15.3479C20.8479 15.6465 21.0404 16.3231 20.7419 16.8592C20.6887 16.9546 20.6341 17.0491 20.578 17.1425C20.262 17.6686 19.5794 17.8389 19.0534 17.5229C18.5273 17.2069 18.357 16.5243 18.673 15.9983C18.7166 15.9256 18.7591 15.8522 18.8004 15.778C19.099 15.2419 19.7756 15.0493 20.3118 15.3479Z" />
                              <path d="M17.1425 20.578C17.6686 20.262 17.8389 19.5794 17.5229 19.0534C17.2069 18.5273 16.5243 18.357 15.9983 18.673C15.9256 18.7166 15.8522 18.7591 15.778 18.8004C15.2419 19.099 15.0493 19.7756 15.3479 20.3118C15.6465 20.8479 16.3231 21.0404 16.8592 20.7419C16.9546 20.6887 17.0491 20.6341 17.1425 20.578Z" />
                              <path d="M16.7811 7.6229C16.5556 7.39749 16.1988 7.37213 15.9438 7.5634L11.3327 11.0217C10.6836 11.5085 10.6161 12.4574 11.1899 13.0312L11.3728 13.2141C11.9465 13.7878 12.8954 13.7204 13.3823 13.0713L16.8406 8.46018C17.0318 8.20516 17.0065 7.84831 16.7811 7.6229Z" />
                            </svg>
                          </span>
                        </div>

                        <span className="segoe-ui visible min-h-0 wrap-break-word text-[9.8px]">
                          Desactivaste los mensajes temporales. Haz clic para cambiar esto.
                        </span>
                      </span>
                    </div>

                    <span></span>
                    <div></div>
                  </div>

                  <div className="absolute top-1/2 -mt-3.25 flex w-25.25 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-1 order-0 min-w-0 min-h-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
