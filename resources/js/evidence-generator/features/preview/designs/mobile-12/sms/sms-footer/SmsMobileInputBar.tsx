import stickerIcon from '../../components/icons/sticker.png';

export function SmsMobileInputBar({
    draft = '',
    onDraftChange,
}: {
    themeMode: 'light' | 'dark';
    draft?: string;
    onDraftChange?: (value: string) => void;
    composerLayout?: {
        messageAreaMaxWidth?: string;
    };
}) {
    return (
        <footer className="h-[107px] w-full shrink-0 bg-[#010101]">
            <div className="flex h-full items-end pl-[5.7%] pr-[5.75%] pb-[4px]">
                <div className="flex h-8 shrink-0 items-center gap-[15px] mb-1">
                    <button type="button" className="grid size-8 shrink-0 place-items-center" aria-label="Galería">
                        <svg viewBox="0 0 24 24" className="size-[30px]" fill="none" aria-hidden="true">
                            <rect x="3.9" y="4.5" width="16" height="15" rx="2.25" fill="#FAFAFA" />
                            <circle cx="9" cy="9.5" r="1.4" fill="#010101" />
                            <path d="m5.5 17 4-4.1a1 1 0 0 1 1.45-.02l2.15 2.18 2.05-2.04a1 1 0 0 1 1.43.04L19 15.7V17H5.5Z" fill="#010101" />
                        </svg>
                    </button>

                    <button type="button" className="grid size-8 shrink-0 place-items-center" aria-label="Cámara">
                        <svg width="23" height="24" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect x="0" y="0" width="20" height="14" rx="3" fill="#FAFAFA" />
                            <circle cx="10" cy="7" r="3.35" fill="#010101" />
                            <circle cx="15.8" cy="3.7" r="1.35" fill="#010101" />
                        </svg>
                    </button>

                    <button type="button" className="grid size-8 shrink-0 translate-x-[2px] place-items-center" aria-label="Más opciones">
                        <svg viewBox="0 0 18 18" className="size-[30px]" fill="none" aria-hidden="true">
                            <path d="M9 3.25v11.5M3.25 9h11.5" stroke="#FAFAFA" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="ml-[17px] flex h-[45px] min-w-0 flex-1 items-center rounded-full bg-[#262626] pl-[10px] pr-[9px]">
                    <input
                        value={draft}
                        onChange={(event) => onDraftChange?.(event.target.value)}
                        aria-label="Mensaje SMS"
                        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                        style={{ color: '#FAFAFA', caretColor: '#FAFAFA' }}
                    />
                    <button type="button" className="grid size-9 shrink-0 place-items-center" aria-label="Sticker">
                        <img src={stickerIcon} alt="" aria-hidden="true" className="w-14 h-9" />
                    </button>
                </div>

                <button type="button" className="ml-2 grid size-8 shrink-0 place-items-center" aria-label="Mensaje de voz">
                    <svg viewBox="0 0 20 20" className="size-[21px]" fill="none" aria-hidden="true">
                        <path d="M2.5 8v4M5.5 5.5v9M8.5 3.5v13M11.5 6v8M14.5 4.5v11M17.5 7v6" stroke="#FAFAFA" strokeWidth="1.45" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </footer>
    );
}
