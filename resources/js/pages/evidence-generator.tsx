import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import EvidenceGeneratorApp from '@/evidence-generator/App';
import type { MobileDesignKey, PreviewDeviceMode, PreviewThemeMode, WhatsappDesktopScale } from '@/evidence-generator/types';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';

interface EvidenceGeneratorPageProps extends SharedData {
    availableMobileDesigns: MobileDesignKey[];
    globalMobileDesigns: MobileDesignKey[];
    registeredMobileDesigns: MobileDesignKey[];
}

export default function EvidenceGeneratorPage() {
    const { auth, availableMobileDesigns, globalMobileDesigns, registeredMobileDesigns } = usePage<EvidenceGeneratorPageProps>().props;
    const whatsappDesktopScale: WhatsappDesktopScale = auth.user.whatsapp_desktop_scale ?? 80;
    const evidenceThemeMode: PreviewThemeMode = auth.user.evidence_theme_mode ?? 'light';
    const evidenceDeviceMode: PreviewDeviceMode = auth.user.evidence_device_mode ?? 'desktop';

    return (
        <div className="relative min-h-screen">
            <Head title="Inicio" />

            <div className="absolute top-4 left-4 z-[500]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="h-10 gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                            <UserRound className="size-4" />
                            Usuario
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <EvidenceGeneratorApp
                currentUser={auth.user}
                availableMobileDesigns={availableMobileDesigns}
                globalMobileDesigns={globalMobileDesigns}
                registeredMobileDesigns={registeredMobileDesigns}
                whatsappDesktopScale={whatsappDesktopScale}
                evidenceThemeMode={evidenceThemeMode}
                evidenceDeviceMode={evidenceDeviceMode}
            />
        </div>
    );
}
