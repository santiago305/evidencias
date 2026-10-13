import EvidenceGeneratorApp from '@/evidence-generator/App';
import type { MobileDesignKey, PreviewDevicePreference, PreviewThemeMode, WhatsappDesktopScale } from '@/evidence-generator/types';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface EvidenceGeneratorPageProps extends SharedData {
    availableMobileDesigns: MobileDesignKey[];
    globalMobileDesigns: MobileDesignKey[];
    registeredMobileDesigns: MobileDesignKey[];
}

export default function EvidenceGeneratorPage() {
    const { auth, availableMobileDesigns, globalMobileDesigns, registeredMobileDesigns } = usePage<EvidenceGeneratorPageProps>().props;
    const whatsappDesktopScale: WhatsappDesktopScale = auth.user.whatsapp_desktop_scale ?? 80;
    const evidenceThemeMode: PreviewThemeMode = auth.user.evidence_theme_mode ?? 'light';
    const evidenceDesktopThemeMode: PreviewThemeMode = auth.user.evidence_desktop_theme_mode ?? evidenceThemeMode;
    const evidenceMobileThemeMode: PreviewThemeMode = auth.user.evidence_mobile_theme_mode ?? evidenceThemeMode;
    const evidenceDeviceMode: PreviewDevicePreference = auth.user.evidence_device_mode ?? 'desktop';

    return (
        <div className="relative min-h-screen">
            <Head title="Inicio" />

            <EvidenceGeneratorApp
                currentUser={auth.user}
                availableMobileDesigns={availableMobileDesigns}
                globalMobileDesigns={globalMobileDesigns}
                registeredMobileDesigns={registeredMobileDesigns}
                whatsappDesktopScale={whatsappDesktopScale}
                evidenceThemeMode={evidenceThemeMode}
                evidenceDesktopThemeMode={evidenceDesktopThemeMode}
                evidenceMobileThemeMode={evidenceMobileThemeMode}
                evidenceDeviceMode={evidenceDeviceMode}
            />
        </div>
    );
}
