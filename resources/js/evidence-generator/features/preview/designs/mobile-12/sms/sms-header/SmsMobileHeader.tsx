import videoCallIcon from '../../components/icons/capt.png';
import phoneIcon from '../../components/icons/tephon.png';
import type { SmsData } from '../smsTypes';

type SmsMobileHeaderProps = {
    data: SmsData;
    themeMode: 'light' | 'dark';
    showVideoCall?: boolean;
};

export function SmsMobileHeader({ data, showVideoCall = false }: SmsMobileHeaderProps) {
    const displayTelefono = data.telefono.trim() || '-';

    return (
        <header
            className="flex h-[58px] shrink-0 mt-1 items-center border-r border-[#303030] pr-0 pl-[2px] text-white"
            style={{ backgroundColor: '#010101' }}
        >
            <button type="button" className="flex size-11 shrink-0 items-center justify-center rounded-full active:bg-white/10" aria-label="Volver">
                <BackChevronIcon />
            </button>

            <div className="min-w-0 flex-1 truncate pr-2 text-[18px] leading-none font-normal tracking-[-0.15px]">{displayTelefono}</div>

            <div className="flex shrink-0 items-center">
                <button
                    type="button"
                    className="flex size-14 shrink-0 items-center justify-center rounded-full active:bg-white/10"
                    aria-label="Llamar"
                >
                    <img src={phoneIcon} alt="" aria-hidden="true" width={34} height={34} />
                </button>

                {showVideoCall ? (
                    <button
                        type="button"
                        className="flex size-14 shrink-0 items-center justify-center rounded-full active:bg-white/10"
                        aria-label="Videollamada"
                    >
                        <img src={videoCallIcon} alt="" aria-hidden="true" width={32} height={35} />
                    </button>
                ) : null}

                <button
                    type="button"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full active:bg-white/10"
                    aria-label="Opciones"
                >
                    <MoreVerticalIcon />
                </button>
            </div>
        </header>
    );
}

function BackChevronIcon() {
    return (
        <svg viewBox="0 0 12 22" className="h-[21px] w-3" fill="none" aria-hidden="true">
            <path d="M9.5 2.5 2 11l7.5 8.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function MoreVerticalIcon() {
    return (
        <svg viewBox="0 0 6 18" className="h-[20px] w-2.5" fill="currentColor" aria-hidden="true">
            <circle cx="3" cy="3.5" r="1.55" />
            <circle cx="3" cy="9.5" r="1.55" />
            <circle cx="3" cy="15.5" r="1.55" />
        </svg>
    );
}
