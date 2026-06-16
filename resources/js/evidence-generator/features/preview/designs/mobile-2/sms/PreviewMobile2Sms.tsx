import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { Row } from '../../../components/Row';
import { Mobile2PreviewFrame } from '../Mobile2PreviewFrame';

export function PreviewMobile2Sms({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const isDark = themeMode === 'dark';

    return (
        <Mobile2PreviewFrame
            themeMode={themeMode}
            notificationSeed={[data.seedCode, data.conversationId, data.telefono, data.dniCliente]
                .filter((value) => value !== undefined && value !== null && `${value}`.trim() !== '')
                .join('|')}
        >
            <div className={['flex h-full flex-col', isDark ? 'bg-[#0f172a]' : 'bg-[#f6f7fb]'].join(' ')}>
                <div
                    className={[
                        'border-b px-5 py-[15px]',
                        isDark ? 'border-white/10 bg-[#111827] text-white' : 'border-slate-200 bg-white text-slate-950',
                    ].join(' ')}
                >
                    <div className="text-[17.5px] font-semibold">SMS</div>
                    <div className={['text-[13.75px]', isDark ? 'text-slate-400' : 'text-slate-500'].join(' ')}>{data.telefono}</div>
                </div>

                <div className="flex-1 space-y-[15px] overflow-y-auto p-5">
                    <div
                        className={[
                            'max-w-[78%] rounded-[20px] rounded-tl-[5px] px-[15px] py-2.5 text-[15px]',
                            isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm',
                        ].join(' ')}
                    >
                        Hola {data.nombre || 'cliente'}, tenemos informacion sobre tu solicitud.
                    </div>
                    <div className="ml-auto max-w-[78%] rounded-[20px] rounded-tr-[5px] bg-[#007aff] px-[15px] py-2.5 text-[15px] text-white">
                        Monto: {data.monto || '-'} | Cuota: {data.cuota || '-'}
                    </div>
                    <div className="grid gap-2.5 pt-[15px]">
                        <Row k="Asesor" v={data.nombreAsesor} themeMode={themeMode} />
                        <Row k="DNI" v={data.dni} themeMode={themeMode} />
                    </div>
                </div>
            </div>
        </Mobile2PreviewFrame>
    );
}
