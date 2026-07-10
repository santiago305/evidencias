import type { PreviewProps } from '../../../../../../types';
import { EmptyState } from '../../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../../mobileNotifications';
import { Mobile1PreviewFrame } from '../../Mobile1PreviewFrame';

export function PreviewMobile1CallDesign1({ data, themeMode }: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const isDark = themeMode === 'dark';

    return (
        <Mobile1PreviewFrame themeMode={themeMode} notificationIds={buildMobilePreviewNotificationIds(data, 'mobile-1', 'call')}>
            <div
                className={[
                    'flex h-full flex-col items-center justify-between px-10 py-15 text-center',
                    isDark ? 'bg-[#07111f] text-white' : 'bg-[#f8fafc] text-slate-950',
                ].join(' ')}
            >
                <div>
                    <div className={['text-[15px]', isDark ? 'text-slate-400' : 'text-slate-500'].join(' ')}>Llamada entrante</div>
                    <div className="mt-7.5 grid h-30 w-30 place-items-center rounded-full bg-emerald-500 text-[37.5px] font-semibold text-white">
                        {(data.nombre || 'C').trim().slice(0, 1).toUpperCase()}
                    </div>
                    <div className="mt-6.25 text-[30px] font-semibold">{data.nombre || 'Cliente'}</div>
                    <div className={['mt-1.25 text-[17.5px]', isDark ? 'text-slate-300' : 'text-slate-500'].join(' ')}>{data.telefono}</div>
                </div>

                <div className="grid w-full grid-cols-2 gap-10">
                    <button type="button" className="grid h-20 w-20 place-self-center rounded-full bg-red-500 text-[17.5px] font-semibold text-white">
                        <span className="m-auto">No</span>
                    </button>
                    <button
                        type="button"
                        className="grid h-20 w-20 place-self-center rounded-full bg-emerald-500 text-[17.5px] font-semibold text-white"
                    >
                        <span className="m-auto">Si</span>
                    </button>
                </div>
            </div>
        </Mobile1PreviewFrame>
    );
}
