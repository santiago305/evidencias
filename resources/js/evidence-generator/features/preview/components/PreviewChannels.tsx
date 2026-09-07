import type { MobileDesignKey, PreviewDeviceMode, PreviewProps, WhatsappDesktopScale } from '../../../types';
import { mobilePreviewRegistry } from '../designs/mobilePreviewProfiles';
import { PreviewWhatsappDesktop } from '../designs/whatsapp-desktop';
export { mobilePreviewRegistry } from '../designs/mobilePreviewProfiles';
export type { MobilePreviewRegistration } from '../designs/shared/mobile-preview';

interface PreviewWhatsappProps extends PreviewProps {
    deviceMode: PreviewDeviceMode;
    mobileDesignKey: MobileDesignKey;
    whatsappDesktopScale: WhatsappDesktopScale;
}

export function PreviewWhatsApp({ data, deviceMode, mobileDesignKey, whatsappDesktopScale, themeMode }: PreviewWhatsappProps) {
    if (deviceMode !== 'mobile') {
        return <PreviewWhatsappDesktop data={data} whatsappDesktopScale={whatsappDesktopScale} themeMode={themeMode} />;
    }

    const Preview = mobilePreviewRegistry[mobileDesignKey].whatsapp;

    return <Preview data={data} themeMode={themeMode} />;
}

export function PreviewLlamada({ data, themeMode, mobileDesignKey }: PreviewProps & { mobileDesignKey: MobileDesignKey }) {
    const Preview = mobilePreviewRegistry[mobileDesignKey].call;

    return <Preview data={data} themeMode={themeMode} />;
}

export function PreviewSMS({ data, themeMode, mobileDesignKey }: PreviewProps & { mobileDesignKey: MobileDesignKey }) {
    const Preview = mobilePreviewRegistry[mobileDesignKey].sms;

    return <Preview data={data} themeMode={themeMode} />;
}
