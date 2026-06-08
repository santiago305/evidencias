import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { Row } from '../../../components/Row';
import { Mobile1PreviewFrame } from '../Mobile1PreviewFrame';

export function PreviewMobile1Sms({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const isDark = themeMode === 'dark';

    return (
        <Mobile1PreviewFrame themeMode={themeMode}>
            <div className={['flex h-full flex-col', isDark ? 'bg-[#0f172a]' : 'bg-[#f6f7fb]'].join(' ')}>
                <div className={['border-b px-4 py-3', isDark ? 'border-white/10 bg-[#111827] text-white' : 'border-slate-200 bg-white text-slate-950'].join(' ')}>
                    <div className="text-sm font-semibold">SMS</div>
                    <div className={['text-[11px]', isDark ? 'text-slate-400' : 'text-slate-500'].join(' ')}>{data.telefono}</div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    <div className={['max-w-[78%] rounded-2xl rounded-tl-md px-3 py-2 text-[12px]', isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm'].join(' ')}>
                        Hola {data.nombre || 'cliente'}, tenemos informacion sobre tu solicitud.
                    </div>
                    <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#007aff] px-3 py-2 text-[12px] text-white">
                        Monto: {data.monto || '-'} | Cuota: {data.cuota || '-'}
                    </div>
                    <div className="grid gap-2 pt-3">
                        <Row k="Asesor" v={data.nombreAsesor} themeMode={themeMode} />
                        <Row k="DNI" v={data.dni} themeMode={themeMode} />
                    </div>
                </div>
            </div>
        </Mobile1PreviewFrame>
    );
}
