import type { ActiveDesign, PreviewDeviceMode, PreviewThemeMode, SavedData } from "../../../types";
import {
  PreviewLlamada,
  PreviewSMS,
  PreviewWhatsApp,
} from "./PreviewChannels";

interface PreviewPanelProps {
  activeDesign: ActiveDesign;
  saved: SavedData | null;
  whatsappPreviewMode: PreviewDeviceMode;
  themeMode: PreviewThemeMode;
}

// PreviewPanel.tsx
export function PreviewPanel({ activeDesign, saved, whatsappPreviewMode, themeMode }: PreviewPanelProps) {
  return (
    <div className="lg:col-span-6 flex h-screen">
      <div className="h-full overflow-hidden w-full flex flex-col">
        {activeDesign === "whatsapp" && <PreviewWhatsApp data={saved} deviceMode={whatsappPreviewMode} themeMode={themeMode} />}
        {activeDesign === "llamada" && <PreviewLlamada data={saved} themeMode={themeMode} />}
        {activeDesign === "sms" && <PreviewSMS data={saved} themeMode={themeMode} />}
      </div>
    </div>
  );
}
