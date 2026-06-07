import type { PreviewDeviceMode, PreviewProps } from "../../../types";
import { PreviewBlock } from "./PreviewBlock";
import { PreviewBlockWhatsapp } from "../whatsapp/PreviewBlockWhatsapp";

interface PreviewWhatsappProps extends PreviewProps {
  deviceMode: PreviewDeviceMode;
}

// Componente que muestra el preview estilo WhatsApp.
export function PreviewWhatsApp({ data, deviceMode, themeMode }: PreviewWhatsappProps) {
  return <PreviewBlockWhatsapp data={data} deviceMode={deviceMode} themeMode={themeMode} />;
}

// Componente que muestra el preview estilo llamada.
export function PreviewLlamada({ data, themeMode }: PreviewProps) {
  return <PreviewBlock title="Llamada" badge="CALL" data={data} themeMode={themeMode} />;
}

// Componente que muestra el preview estilo SMS.
export function PreviewSMS({ data, themeMode }: PreviewProps) {
  return <PreviewBlock title="SMS" badge="MSG" data={data} themeMode={themeMode} />;
}
