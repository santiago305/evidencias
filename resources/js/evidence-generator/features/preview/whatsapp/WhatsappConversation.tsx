import { useMemo, type ReactNode } from "react";
import bgWhatsapp from "../../../assets/1.png";
import { WhatsappInputBar } from "./WhatsappInputBar";
import type { WhatsappData } from "./whatsappTypes";
import {
  MessageGroup,
  EncryptedMessage,
  DayChip,
  Bubble,
  type MsgStatus,
} from "./WhatsappPieces";
import { buildWhatsappConversation } from "./buildWhatsappConversation";
import { getDayChipText } from "../../../lib/whatsapp/time";
import type { GeneratedMessage } from "../../../types";

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
}: {
  data: WhatsappData;
  messageStatus?: MsgStatus;
  messages?: GeneratedMessage[];
}) {
  const conversationMessages = useMemo(
    () => messages ?? buildWhatsappConversation(data, messageStatus),
    [data, messageStatus, messages]
  );

  return (
    <div className="w-full h-full">
      {/* Fondo WhatsApp */}
      <div className="relative h-full">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{ backgroundImage: `url(${bgWhatsapp})` }}
        />

        <div className="relative flex h-full flex-col">
          {/* Mensajes */}
          <div className="flex-1 w-full h-full ">
            <div className="w-full h-full">
              <DayChip text={getDayChipText(data.fechaHora)} />
              <EncryptedMessage />
            
              {conversationMessages.map((msg, idx) => {
                const prev = conversationMessages[idx - 1];
                const isFirst = !prev || prev.side !== msg.side;
                const groupKey = `${msg.side}-${idx}`;

                if (!isFirst) return null;

                const group = [msg];
                for (let i = idx + 1; i < conversationMessages.length; i += 1) {
                  if (conversationMessages[i].side !== msg.side) break;
                  group.push(conversationMessages[i]);
                }

                return (
                  <MessageGroup key={groupKey}>
                    {group.map((item, itemIdx) => {
                      const overallIdx = idx + itemIdx;
                      const isLast = overallIdx === conversationMessages.length - 1;
                      return (
                      <Bubble
                        key={`${groupKey}-${itemIdx}`}
                        side={item.side}
                        firstInGroup={itemIdx === 0}
                        time={item.time}
                        status={item.status}
                        id={isLast ? "ult-mensaje" : undefined}
                      >
                        {linesToSpans(item.lines)}
                      </Bubble>
                      );
                    })}
                  </MessageGroup>
                );
              })}
            </div>
            
          </div>

          <WhatsappInputBar />
        </div>
      </div>
    </div>
  );
}
