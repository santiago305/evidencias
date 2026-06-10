import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { Mobile2PreviewFrame } from '../../Mobile2PreviewFrame';

export function PreviewMobile2CallDesign1({ data, themeMode }: PreviewProps) {
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
            <div
                className={[
                    'flex h-full flex-col items-center justify-between px-8 py-12 text-center',
                    isDark ? 'bg-[#07111f] text-white' : 'bg-[#f8fafc] text-slate-950',
                ].join(' ')}
            >
                <div>
                    <div className={['text-xs', isDark ? 'text-slate-400' : 'text-slate-500'].join(' ')}>Llamada entrante</div>
                    <div className="mt-6 grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-3xl font-semibold text-white">
                        {(data.nombre || 'C').trim().slice(0, 1).toUpperCase()}
                    </div>
                    <div className="mt-5 text-2xl font-semibold">{data.nombre || 'Cliente'}</div>
                    <div className={['mt-1 text-sm', isDark ? 'text-slate-300' : 'text-slate-500'].join(' ')}>{data.telefono}</div>
                </div>

                <div className="grid w-full grid-cols-2 gap-8">
                    <button type="button" className="grid h-16 w-16 place-self-center rounded-full bg-red-500 text-sm font-semibold text-white">
                        <span className="m-auto">No</span>
                    </button>
                    <button type="button" className="grid h-16 w-16 place-self-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                        <span className="m-auto">Si</span>
                    </button>
                </div>
            </div>
        </Mobile2PreviewFrame>
    );
}
