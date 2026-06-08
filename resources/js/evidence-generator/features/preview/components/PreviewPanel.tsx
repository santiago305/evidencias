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
  canRegisterMobileDesign: boolean;
  isRegisteringMobileDesign: boolean;
  mobileDesignLabel: string;
  onRegisterMobileDesign: () => void;
}

// PreviewPanel.tsx
export function PreviewPanel({
  activeDesign,
  saved,
  whatsappPreviewMode,
  themeMode,
  canRegisterMobileDesign,
  isRegisteringMobileDesign,
  mobileDesignLabel,
  onRegisterMobileDesign,
}: PreviewPanelProps) {
  return (
    <div className="lg:col-span-6 flex h-screen">
      <div className="h-full overflow-hidden w-full flex flex-col">
        <div className="min-h-0 flex-1">
          {activeDesign === "whatsapp" && <PreviewWhatsApp data={saved} deviceMode={whatsappPreviewMode} themeMode={themeMode} />}
          {activeDesign === "llamada" && <PreviewLlamada data={saved} themeMode={themeMode} />}
          {activeDesign === "sms" && <PreviewSMS data={saved} themeMode={themeMode} />}
        </div>

        {canRegisterMobileDesign ? (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={onRegisterMobileDesign}
              disabled={isRegisteringMobileDesign}
              className={[
                "inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold",
                "bg-slate-900 text-white shadow-sm transition hover:bg-slate-800",
                "focus:ring-2 focus:ring-slate-900/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {isRegisteringMobileDesign ? "Registrando..." : `Registrar ${mobileDesignLabel}`}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
