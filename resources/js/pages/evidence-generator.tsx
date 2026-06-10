import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import EvidenceGeneratorApp from '@/evidence-generator/App';
import type { MobileDesignKey, WhatsappDesktopScale } from '@/evidence-generator/types';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';

interface EvidenceGeneratorPageProps extends SharedData {
    globalMobileDesigns: MobileDesignKey[];
    registeredMobileDesigns: MobileDesignKey[];
}

export default function EvidenceGeneratorPage() {
    const { auth, globalMobileDesigns, registeredMobileDesigns } = usePage<EvidenceGeneratorPageProps>().props;
    const whatsappDesktopScale: WhatsappDesktopScale = auth.user.whatsapp_desktop_scale ?? 80;

    return (
        <div className="relative min-h-screen">
            <Head title="Inicio" />

            <div className="absolute top-4 right-4 z-[500]">
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
                globalMobileDesigns={globalMobileDesigns}
                registeredMobileDesigns={registeredMobileDesigns}
                whatsappDesktopScale={whatsappDesktopScale}
            />
        </div>
    );
}
