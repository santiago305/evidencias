import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { Mobile1PreviewFrame } from '../../Mobile1PreviewFrame';

export function PreviewMobile1CallDesign2({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const isDark = themeMode === 'dark';

    return (
        <Mobile1PreviewFrame
            themeMode={themeMode}
            notificationSeed={[data.seedCode, data.conversationId, data.telefono, data.dniCliente]
                .filter((value) => value !== undefined && value !== null && `${value}`.trim() !== '')
                .join('|')}
        >
            <div className={['flex h-full flex-col px-7.5 py-10', isDark ? 'bg-black text-white' : 'bg-white text-slate-950'].join(' ')}>
                <div className="flex-1">
                    <div className={['text-[15px] font-medium tracking-wide uppercase', isDark ? 'text-slate-400' : 'text-slate-500'].join(' ')}>
                        Llamada perdida
                    </div>
                    <div className="mt-10 text-[37.5px] font-semibold">{data.nombre || 'Cliente'}</div>
                    <div className={['mt-2.5 text-[20px]', isDark ? 'text-slate-300' : 'text-slate-500'].join(' ')}>{data.telefono}</div>
                    <div className={['mt-10 rounded-[20px] p-5 text-left text-[17.5px]', isDark ? 'bg-white/10' : 'bg-slate-100'].join(' ')}>
                        Duracion registrada: {data.duracion || '0'} min
                    </div>
                </div>

                <button type="button" className="mb-10 h-[70px] rounded-full bg-[#34c759] text-[17.5px] font-semibold text-white">
                    Devolver llamada
                </button>
            </div>
        </Mobile1PreviewFrame>
    );
}
