import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { Mobile1PreviewFrame } from '../../Mobile1PreviewFrame';

export function PreviewMobile1CallDesign2({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const isDark = themeMode === 'dark';

    return (
        <Mobile1PreviewFrame themeMode={themeMode}>
            <div className={['flex h-full flex-col px-6 py-8', isDark ? 'bg-black text-white' : 'bg-white text-slate-950'].join(' ')}>
                <div className="flex-1">
                    <div className={['text-xs font-medium uppercase tracking-wide', isDark ? 'text-slate-400' : 'text-slate-500'].join(' ')}>Llamada perdida</div>
                    <div className="mt-8 text-3xl font-semibold">{data.nombre || 'Cliente'}</div>
                    <div className={['mt-2 text-base', isDark ? 'text-slate-300' : 'text-slate-500'].join(' ')}>{data.telefono}</div>
                    <div className={['mt-8 rounded-2xl p-4 text-left text-sm', isDark ? 'bg-white/10' : 'bg-slate-100'].join(' ')}>
                        Duracion registrada: {data.duracion || '0'} min
                    </div>
                </div>

                <button type="button" className="mb-8 h-14 rounded-full bg-[#34c759] text-sm font-semibold text-white">
                    Devolver llamada
                </button>
            </div>
        </Mobile1PreviewFrame>
    );
}
