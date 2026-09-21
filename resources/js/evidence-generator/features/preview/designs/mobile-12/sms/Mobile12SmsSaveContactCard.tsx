import type { PreviewThemeMode } from '../../../../../types';

type Mobile12SmsSaveContactCardProps = {
    telefono: string;
    themeMode: PreviewThemeMode;
};

export function Mobile12SmsSaveContactCard({ telefono }: Mobile12SmsSaveContactCardProps) {
    return (
        <div
            className="w-full pt-[0px] pb-[10px]"
            data-mobile12-sms-save-contact-card="true"
            role="group"
            aria-label={`Acciones para ${telefono}`}
        >
            <div className="flex w-full items-center gap-[10px] px-[18px]">
                <button
                    type="button"
                    className="flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-full text-[13px] leading-normal font-[500]"
                    style={{ backgroundColor: '#2B2B2B', color: '#EAEAEA' }}
                >
                    Añadir a Contactos
                </button>

                <button
                    type="button"
                    className="flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-full text-[13px] leading-normal font-[500]"
                    style={{ backgroundColor: '#2B2B2B', color: '#EAEAEA' }}
                >
                    Bloquear número
                </button>
            </div>
        </div>
    );
}
