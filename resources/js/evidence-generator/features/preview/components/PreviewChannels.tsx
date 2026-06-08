import type { PreviewDeviceMode, PreviewProps } from "../../../types";
import { PreviewMobile1CallDesign1 } from "../designs/mobile-1";
import { PreviewMobile1Sms } from "../designs/mobile-1";
import { PreviewMobile1Whatsapp } from "../designs/mobile-1";
import { PreviewWhatsappDesktop } from "../designs/whatsapp-desktop";

interface PreviewWhatsappProps extends PreviewProps {
  deviceMode: PreviewDeviceMode;
}

// Componente que muestra el preview estilo WhatsApp.
export function PreviewWhatsApp({ data, deviceMode, themeMode }: PreviewWhatsappProps) {
  return deviceMode === "mobile" ? (
    <PreviewMobile1Whatsapp data={data} themeMode={themeMode} />
  ) : (
    <PreviewWhatsappDesktop data={data} themeMode={themeMode} />
  );
}

// Componente que muestra el preview estilo llamada.
export function PreviewLlamada({ data, themeMode }: PreviewProps) {
  return <PreviewMobile1CallDesign1 data={data} themeMode={themeMode} />;
}

// Componente que muestra el preview estilo SMS.
export function PreviewSMS({ data, themeMode }: PreviewProps) {
  return <PreviewMobile1Sms data={data} themeMode={themeMode} />;
}
