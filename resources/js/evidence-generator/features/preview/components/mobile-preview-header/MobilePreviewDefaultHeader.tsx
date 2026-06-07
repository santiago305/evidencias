import { BatteryFull, Signal, Wifi } from 'lucide-react';

export function MobilePreviewDefaultHeader({ themeMode }: { themeMode: 'light' | 'dark' }) {
    const isDark = themeMode === 'dark';

    return (
        <div className={['shrink-0 px-3 py-1.5', isDark ? 'bg-[#101418] text-white' : 'bg-white text-slate-950'].join(' ')}>
            <div className="flex h-4 items-center justify-between text-[10px] font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                    <Signal className="h-3 w-3" aria-hidden="true" />
                    <Wifi className="h-3 w-3" aria-hidden="true" />
                    <BatteryFull className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}
