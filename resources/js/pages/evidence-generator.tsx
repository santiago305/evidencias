import EvidenceGeneratorApp from '@/evidence-generator/App';
import { type SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function EvidenceGeneratorPage() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-screen">
            <Head title="Inicio" />

            <div className="absolute top-4 right-4 z-[500]">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                    Cerrar sesion
                </Link>
            </div>

            <EvidenceGeneratorApp currentUser={auth.user} />
        </div>
    );
}
