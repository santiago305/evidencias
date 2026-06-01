import { Fragment, useMemo, type ReactNode } from "react";
import bgWhatsapp from "../../../assets/1.png";
import { WhatsappInputBar } from "./WhatsappInputBar";
import type { WhatsappData } from "./whatsappTypes";
import {
  ActiveTemporalMessage,
  DesactiveTemporalMessage,
  EncryptedMessage,
  DayChip,
  Bubble,
  type MsgStatus,
  TempporalMessage,
} from "./WhatsappPieces";
import { buildWhatsappConversation } from "./buildWhatsappConversation";
import { getDayChipText } from "../../../lib/whatsapp/time";
import type { GeneratedMessage } from "../../../types";
import type { WhatsappConversationMessage } from "./buildWhatsappConversation";

function linesToSpans(lines: ReactNode[]) {
  return lines.map((line, idx) => {
    const key =
      typeof line === "string" ? `${idx}-${line.slice(0, 8)}` : `${idx}`;
    return <span key={key}>{line}</span>;
  });
}

export function WhatsappConversation({
  data,
  messageStatus,
  messages,
  showDefaultTemporalMessage = true,
  inlineTemporalMode = null,
}: {
  data: WhatsappData;
  messageStatus?: MsgStatus;
  messages?: GeneratedMessage[];
  showDefaultTemporalMessage?: boolean;
  inlineTemporalMode?: "active" | "deactive" | null;
}) {
  const conversationMessages = useMemo(
    (): WhatsappConversationMessage[] =>
      messages ?? buildWhatsappConversation(data, messageStatus),
    [data, messageStatus, messages]
  );

  const inlineTemporalInsertIndex = useMemo(() => {
    if (!inlineTemporalMode || conversationMessages.length < 2) {
      return null;
    }

    return Math.floor(Math.random() * (conversationMessages.length - 1)) + 1;
  }, [conversationMessages, inlineTemporalMode, data.nombre, data.fechaHora]);

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Fondo WhatsApp */}
      <div className="relative h-full min-h-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{ backgroundImage: `url(${bgWhatsapp})` }}
        />

        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
          {/* Mensajes */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="h-full w-full overflow-y-auto scrollbar-soft">
              <DayChip text={getDayChipText(data.fechaHora)} />
              <EncryptedMessage />
              {showDefaultTemporalMessage && <TempporalMessage />}

              {conversationMessages.map((msg, idx) => {
                const prev = conversationMessages[idx - 1];
                const next = conversationMessages[idx + 1];
                const markerBeforeCurrent = inlineTemporalInsertIndex === idx;
                const markerAfterCurrent = inlineTemporalInsertIndex === idx + 1;
                const isFirstInGroup =
                  idx === 0 || markerBeforeCurrent || prev.side !== msg.side;
                const staysInSameGroup =
                  !!next && !markerAfterCurrent && next.side === msg.side;
                const wrapperSpacing = staysInSameGroup ? "mb-0.5" : "mb-4";
                const isLast = idx === conversationMessages.length - 1;

                return (
                  <Fragment key={`message-${idx}-${msg.side}`}>
                    <div className={wrapperSpacing}>
                      <Bubble
                        side={msg.side}
                        firstInGroup={isFirstInGroup}
                        time={msg.time}
                        status={msg.status}
                        id={isLast ? "ult-mensaje" : undefined}
                      >
                        {linesToSpans(msg.lines)}
                      </Bubble>
                    </div>

                    {markerAfterCurrent && inlineTemporalMode === "active" && (
                      <ActiveTemporalMessage />
                    )}
                    {markerAfterCurrent && inlineTemporalMode === "deactive" && (
                      <DesactiveTemporalMessage />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div className="shrink-0">
            <WhatsappInputBar />
          </div>
        </div>
      </div>
    </div>
  );
}
