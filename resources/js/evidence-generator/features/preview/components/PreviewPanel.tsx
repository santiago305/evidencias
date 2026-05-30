import type { ActiveDesign, SavedData } from "../../../types";
import {
  PreviewLlamada,
  PreviewSMS,
  PreviewWhatsApp,
} from "./PreviewChannels";

interface PreviewPanelProps {
  activeDesign: ActiveDesign;
  saved: SavedData | null;
}

// PreviewPanel.tsx
export function PreviewPanel({ activeDesign, saved }: PreviewPanelProps) {
  return (
    <div className="lg:col-span-6 flex border-black border h-screen">
      <div className="h-full overflow-hidden w-full flex flex-col">
        {activeDesign === "whatsapp" && <PreviewWhatsApp data={saved} />}
        {activeDesign === "llamada" && <PreviewLlamada data={saved} />}
        {activeDesign === "sms" && <PreviewSMS data={saved} />}
      </div>
    </div>
  );
}
