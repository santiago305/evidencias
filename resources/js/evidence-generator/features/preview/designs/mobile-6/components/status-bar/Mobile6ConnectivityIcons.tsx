import type { ReactNode } from 'react';

import { Mobile6CellSignalIcon } from './Mobile6CellSignalIcon';
import { Mobile6VoLTEIcon } from './Mobile6VoLTEIcon';

type Mobile6ConnectivityIconsProps = {
    wifiIcon: ReactNode;
    smsDark?: boolean;
};

export function Mobile6ConnectivityIcons({ wifiIcon, smsDark = false }: Mobile6ConnectivityIconsProps) {
    return (
        <div className={`flex shrink-0 items-center gap-[5px] whitespace-nowrap ${smsDark ? 'text-[#F4F4F4]' : 'text-[#4D4D4D]'}`}>
            {wifiIcon}
            <Mobile6VoLTEIcon inverted={smsDark} className="mt-1 h-[17px] w-[26px]" />
            <Mobile6CellSignalIcon className="h-[18px] w-[20px]" />
        </div>
    );
}
