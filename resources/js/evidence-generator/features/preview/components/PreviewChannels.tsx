import type { MobileDesignKey, PreviewDeviceMode, PreviewProps, WhatsappDesktopScale } from "../../../types";
import { PreviewMobile1CallDesign1, PreviewMobile1Sms, PreviewMobile1Whatsapp } from "../designs/mobile-1";
import { PreviewMobile2CallDesign1, PreviewMobile2Sms, PreviewMobile2Whatsapp } from "../designs/mobile-2";
import { PreviewWhatsappDesktop } from "../designs/whatsapp-desktop";

interface PreviewWhatsappProps extends PreviewProps {
  deviceMode: PreviewDeviceMode;
  mobileDesignKey: MobileDesignKey;
  whatsappDesktopScale: WhatsappDesktopScale;
}

// Componente que muestra el preview estilo WhatsApp.
export function PreviewWhatsApp({ data, deviceMode, mobileDesignKey, whatsappDesktopScale, themeMode }: PreviewWhatsappProps) {
  if (deviceMode !== "mobile") {
    return (
    <PreviewWhatsappDesktop data={data} whatsappDesktopScale={whatsappDesktopScale} themeMode={themeMode} />
    );
  }

  return mobileDesignKey === "mobile-2" ? (
    <PreviewMobile2Whatsapp data={data} themeMode={themeMode} />
  ) : (
    <PreviewMobile1Whatsapp data={data} themeMode={themeMode} />
  );
}

// Componente que muestra el preview estilo llamada.
export function PreviewLlamada({ data, themeMode, mobileDesignKey }: PreviewProps & { mobileDesignKey: MobileDesignKey }) {
  return mobileDesignKey === "mobile-2" ? (
    <PreviewMobile2CallDesign1 data={data} themeMode={themeMode} />
  ) : (
    <PreviewMobile1CallDesign1 data={data} themeMode={themeMode} />
  );
}

// Componente que muestra el preview estilo SMS.
export function PreviewSMS({ data, themeMode, mobileDesignKey }: PreviewProps & { mobileDesignKey: MobileDesignKey }) {
  return mobileDesignKey === "mobile-2" ? (
    <PreviewMobile2Sms data={data} themeMode={themeMode} />
  ) : (
    <PreviewMobile1Sms data={data} themeMode={themeMode} />
  );
}
