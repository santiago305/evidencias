import { useMemo } from "react";
import type { PreviewProps } from "../../../types";
import { EmptyState } from "../components/EmptyState";
import { WhatsappHeaderUser } from "./WhatsappHeaderUser";
import { WhatsappConversation } from "./WhatsappConversation";
import { WhatsappRightAside } from "./WhatsappRightAside";
import type { MsgStatus } from "./WhatsappPieces";


export function PreviewBlockWhatsapp({ data }: PreviewProps) {
  if (!data) return <EmptyState />;

  const messageStatus = useMemo<MsgStatus>(
    () => (Math.random() < 0.5 ? "read" : "delivered"),
    [data]
  );

  return (
    <div className="flex h-full w-full flex-col bg-[#efeae2]" id="CAPTURA">
      {/* Layout: SOLO chat + panel derecho (sin lista de chats) */}
      <div className="flex min-h-0 flex-1 w-full">
        <div className="flex-5 min-w-0 flex flex-col">
          <WhatsappHeaderUser data={data} status={messageStatus} />

          <WhatsappConversation
            data={data}
            messageStatus={messageStatus}
            messages={data.generatedMessages}
          />
        </div>
        {/* Chat area */}

        {/* Panel derecho FIJO (sticky). Esto es lo que pediste. */}
        <WhatsappRightAside data={data} />
      </div>
      <div className="h-10 w-full shrink-0 bg-gray-300 text-center text-sm text-gray-700">
        hola
      </div>
    </div>
  );
}
