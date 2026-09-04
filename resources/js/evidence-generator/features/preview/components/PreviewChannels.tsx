import type { MobileDesignKey, PreviewDeviceMode, PreviewProps, WhatsappDesktopScale } from '../../../types';
import { PreviewMobile1CallDesign1, PreviewMobile1Sms, PreviewMobile1Whatsapp } from '../designs/mobile-1';
import { PreviewMobile2CallDesign1, PreviewMobile2Sms, PreviewMobile2Whatsapp } from '../designs/mobile-2';
import {
    PreviewMobile1CallDesign1 as PreviewMobile3CallDesign1,
    PreviewMobile1Sms as PreviewMobile3Sms,
    PreviewMobile1Whatsapp as PreviewMobile3Whatsapp,
} from '../designs/mobile-3';
import { PreviewMobile4CallDesign1, PreviewMobile4Sms, PreviewMobile4Whatsapp } from '../designs/mobile-4';
import { PreviewWhatsappDesktop } from '../designs/whatsapp-desktop';

interface PreviewWhatsappProps extends PreviewProps {
    deviceMode: PreviewDeviceMode;
    mobileDesignKey: MobileDesignKey;
    whatsappDesktopScale: WhatsappDesktopScale;
}

// Componente que muestra el preview estilo WhatsApp.
export function PreviewWhatsApp({ data, deviceMode, mobileDesignKey, whatsappDesktopScale, themeMode }: PreviewWhatsappProps) {
    if (deviceMode !== 'mobile') {
        return <PreviewWhatsappDesktop data={data} whatsappDesktopScale={whatsappDesktopScale} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-2') {
        return <PreviewMobile2Whatsapp data={data} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-3') {
        return <PreviewMobile3Whatsapp data={data} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-4') {
        return <PreviewMobile4Whatsapp data={data} themeMode={themeMode} />;
    }

    return <PreviewMobile1Whatsapp data={data} themeMode={themeMode} />;
}

// Componente que muestra el preview estilo llamada.
export function PreviewLlamada({ data, themeMode, mobileDesignKey }: PreviewProps & { mobileDesignKey: MobileDesignKey }) {
    if (mobileDesignKey === 'mobile-2') {
        return <PreviewMobile2CallDesign1 data={data} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-3') {
        return <PreviewMobile3CallDesign1 data={data} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-4') {
        return <PreviewMobile4CallDesign1 data={data} themeMode={themeMode} />;
    }

    return <PreviewMobile1CallDesign1 data={data} themeMode={themeMode} />;
}

// Componente que muestra el preview estilo SMS.
export function PreviewSMS({ data, themeMode, mobileDesignKey }: PreviewProps & { mobileDesignKey: MobileDesignKey }) {
    if (mobileDesignKey === 'mobile-2') {
        return <PreviewMobile2Sms data={data} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-3') {
        return <PreviewMobile3Sms data={data} themeMode={themeMode} />;
    }

    if (mobileDesignKey === 'mobile-4') {
        return <PreviewMobile4Sms data={data} themeMode={themeMode} />;
    }

    return <PreviewMobile1Sms data={data} themeMode={themeMode} />;
}
