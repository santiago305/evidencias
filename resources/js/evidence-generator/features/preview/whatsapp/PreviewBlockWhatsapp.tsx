import { useMemo } from "react";
import type { PreviewProps } from "../../../types";
import { EmptyState } from "../components/EmptyState";
import { WhatsappHeaderUser } from "./WhatsappHeaderUser";
import { WhatsappConversation } from "./WhatsappConversation";
import { WhatsappRightAside } from "./WhatsappRightAside";
import type { MsgStatus } from "./WhatsappPieces";

type WinTrayIconProps = {
  glyph: string;
  title?: string;
  className?: string;
  iconClassName?: string;
};

function WinTrayIcon({
  glyph,
  title,
  className = "",
  iconClassName = "",
}: WinTrayIconProps) {
  return (
    <span
      title={title}
      className={`flex h-10 min-w-[24px] select-none items-center justify-center ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center leading-none text-white ${iconClassName}`}
        style={{
          fontFamily: "'Segoe Fluent Icons', 'Segoe MDL2 Assets'",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {glyph}
      </span>
    </span>
  );
}

function WindowsTrayBar() {
  return (
    <div
      className="flex h-10 w-full shrink-0 items-center justify-end border-t border-white/10 bg-[#1f1f1f] pl-3 pr-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div className="flex h-10 items-center gap-0 overflow-hidden">
        {/* Mostrar iconos ocultos */}
        <WinTrayIcon
          glyph={"\uE70E"}
          title="Mostrar iconos ocultos"
          className="min-w-[26px]"
          iconClassName="text-[10px]"
        />

        {/* Idioma */}
        <div className="flex h-10 min-w-[39px] flex-col items-center justify-center text-[11px] leading-[14px] tracking-tight text-white">
          <span>ESP</span>
          <span>LAA</span>
        </div>

        {/* Red / internet */}
        <WinTrayIcon
          glyph={"\uE701"}
          title="WiFi"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE839"}
          title="Ethernet"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE774"}
          title="Internet"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE705"}
          title="VPN"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE709"}
          title="Modo avión"
          iconClassName="text-[14px]"
        />

        {/* Audio */}
        <WinTrayIcon
          glyph={"\uE995"}
          title="Volumen"
          className="min-w-5.5"
          iconClassName="text-[13px]"
        />
        <WinTrayIcon
          glyph={"\uE74F"}
          title="Silenciado"
          iconClassName="text-[14px]"
        />

        {/* Energía */}
        <WinTrayIcon
          glyph={"\uE83E"}
          title="Batería cargando"
          iconClassName="text-[15px] text-[#9adf9a]"
        />
        <WinTrayIcon
          glyph={"\uE83F"}
          title="Batería llena"
          iconClassName="text-[15px]"
        />

        {/* Conectividad / dispositivos */}
        <WinTrayIcon
          glyph={"\uE702"}
          title="Bluetooth"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE88E"}
          title="USB"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE977"}
          title="PC / Monitor"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE749"}
          title="Impresora"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE765"}
          title="Teclado"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE962"}
          title="Mouse"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE720"}
          title="Micrófono"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE722"}
          title="Cámara"
          iconClassName="text-[14px]"
        />

        {/* Sistema / apps */}
        <WinTrayIcon
          glyph={"\uE753"}
          title="Cloud / OneDrive"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uE83D"}
          title="Windows Defender"
          iconClassName="text-[14px]"
        />
        <WinTrayIcon
          glyph={"\uEB50"}
          title="Notificaciones"
          iconClassName="text-[14px]"
        />

        {/* Hora y fecha */}
        <div
          id="fecha-captura"
          className="ml-[7px] flex h-10 min-w-[50px] flex-col items-end justify-center text-[11px] leading-[14px] tracking-tight text-white"
        >
          <span>20:31</span>
          <span>31/05/2026</span>
        </div>
      </div>
    </div>
  );
}

export function PreviewBlockWhatsapp({ data }: PreviewProps) {
  const messageStatus = useMemo<MsgStatus>(
    () => (Math.random() < 0.5 ? "read" : "delivered"),
    [data]
  );

  const temporalBehavior = useMemo(() => {
    const showsTimerIcon = Math.random() < 0.5;

    if (!showsTimerIcon) {
      return {
        showTemporaryIcon: false,
        showDefaultTemporalMessage: true,
        temporalStatusLabel: "Desactivado" as const,
        inlineTemporalMode: "deactive" as const,
      };
    }

    const usesInlineActivationVariant = Math.random() < 0.5;

    if (usesInlineActivationVariant) {
      return {
        showTemporaryIcon: true,
        showDefaultTemporalMessage: false,
        temporalStatusLabel: "90 días" as const,
        inlineTemporalMode: "active" as const,
      };
    }

    return {
      showTemporaryIcon: true,
      showDefaultTemporalMessage: true,
      temporalStatusLabel: "90 días" as const,
      inlineTemporalMode: null,
    };
  }, [data]);

  if (!data) return <EmptyState />;

  return (
    <div className="flex h-full w-full flex-col bg-[#efeae2]" id="CAPTURA">
      <div className="flex min-h-0 w-full flex-1">
        <div className="flex-[3.3] min-w-0 flex flex-col">
          <WhatsappHeaderUser
            data={data}
            status={messageStatus}
            showTemporaryIndicator={temporalBehavior.showTemporaryIcon}
          />

          <WhatsappConversation
            data={data}
            messageStatus={messageStatus}
            messages={data.generatedMessages}
            showDefaultTemporalMessage={temporalBehavior.showDefaultTemporalMessage}
            inlineTemporalMode={temporalBehavior.inlineTemporalMode}
          />
        </div>

        <WhatsappRightAside
          data={data}
          temporalStatusLabel={temporalBehavior.temporalStatusLabel}
        />
      </div>

      <WindowsTrayBar />
    </div>
  );
}
