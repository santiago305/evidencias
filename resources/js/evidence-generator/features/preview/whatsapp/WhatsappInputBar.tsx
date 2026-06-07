import { useState } from 'react';
import { Paperclip } from 'lucide-react';
import type { PreviewThemeMode } from '../../../types';

export function WhatsappInputBar({
  themeMode = 'light',
  deviceMode = 'desktop',
}: {
  themeMode?: PreviewThemeMode;
  deviceMode?: 'desktop' | 'mobile';
}) {
  const isDark = themeMode === 'dark';
  const [messageValue, setMessageValue] = useState('');
  const hasMessageValue = messageValue.length > 0;

  if (deviceMode === 'mobile') {
    return (
      <div className="p-1 pb-1.5">
        <div className="flex items-center gap-1">
          <div className={["flex min-h-10 flex-1 items-center gap-2 rounded-full p-1.5", isDark ? "bg-[#202c33] text-slate-300" : "bg-white text-[#54656f]"].join(" ")}>
            <button type="button" aria-label="Emojis" className="grid h-7 w-7 shrink-0 place-items-center rounded-full">
              <svg viewBox="0 0 24 24" height="18" width="18" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
                <path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z" fill="currentColor" />
                <path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z" fill="currentColor" />
              </svg>
            </button>

            <input
              aria-label="Mensaje"
              autoComplete="off"
              className="segoe-ui min-w-0 flex-1 bg-transparent text-[13px] text-current outline-none placeholder:text-current/70"
              style={{ fontFamily: "'Whatsapp Segoe UI', 'Segoe UI', system-ui, sans-serif", pointerEvents: 'auto' }}
              placeholder="Mensaje"
              spellCheck={false}
              type="text"
              value={messageValue}
              onChange={(event) => setMessageValue(event.target.value)}
            />

            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" aria-label="Adjuntar" className="grid h-7 w-7 place-items-center rounded-full">
                <Paperclip className="h-[18px] w-[18px] rotate-315" aria-hidden="true" />
              </button>

              {!hasMessageValue && (
                <button type="button" aria-label="Camara" className="grid h-7 w-7 place-items-center rounded-full">
                  <svg viewBox="0 0 36 32" height="16" width="18" fill="none" aria-hidden="true">
                    <path
                      d="M34,9.11V26.89c0,1.72-1.39,3.11-3.11,3.11H5.11c-1.72,0-3.11-1.39-3.11-3.11V9.11c0-1.72,1.39-3.11,3.11-3.11h6.18c.57-1.33,1.14-2.67,1.71-4h11c.5,1.34,1,2.67,1.5,4h5.39c1.72,0,3.11,1.39,3.11,3.11Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                    <circle
                      cx="18"
                      cy="16"
                      r="6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <button type="button" aria-label="Grabar audio" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1EAA61] text-white">
            <svg viewBox="0 0 24 24" height="20" width="20" preserveAspectRatio="xMidYMid meet" fill="currentColor" aria-hidden="true">
              <path d="M12 14.5C11.05 14.5 10.24 14.16 9.57 13.49C8.9 12.82 8.56 12.01 8.56 11.06V5.44C8.56 4.49 8.9 3.68 9.57 3.01C10.24 2.34 11.05 2 12 2C12.95 2 13.76 2.34 14.43 3.01C15.1 3.68 15.44 4.49 15.44 5.44V11.06C15.44 12.01 15.1 12.82 14.43 13.49C13.76 14.16 12.95 14.5 12 14.5Z" />
              <path d="M12 22C11.45 22 11 21.55 11 21V18.92C9.23 18.7 7.75 17.93 6.58 16.61C5.6 15.5 5.02 14.22 4.84 12.77C4.78 12.22 5.23 11.75 5.79 11.75C6.29 11.75 6.72 12.12 6.82 12.61C7.02 13.58 7.5 14.42 8.25 15.13C9.27 16.09 10.52 16.56 12 16.56C13.48 16.56 14.73 16.09 15.75 15.13C16.5 14.42 16.98 13.58 17.18 12.61C17.28 12.12 17.71 11.75 18.21 11.75C18.77 11.75 19.22 12.22 19.16 12.77C18.98 14.22 18.4 15.5 17.42 16.61C16.25 17.93 14.77 18.7 13 18.92V21C13 21.55 12.55 22 12 22Z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <div className="flex items-center">
        <div className={["flex flex-1 items-center justify-center rounded-full border px-2 py-2 text-[12px]", isDark ? "border-white/10 bg-[#202c33] text-slate-400" : "border-black/5 bg-white text-slate-400"].join(" ")}>
          <div className="h-full w-auto mr-2.5">
            <span aria-hidden="true" data-icon="plus-rounded" className="">
              <svg viewBox="0 0 24 24" height="16" width="16" preserveAspectRatio="xMidYMid meet" className={isDark ? "text-slate-300" : "text-black"} fill="none">
                <title>plus-rounded</title>
                <path d="M11 13H5.5C4.94772 13 4.5 12.5523 4.5 12C4.5 11.4477 4.94772 11 5.5 11H11V5.5C11 4.94772 11.4477 4.5 12 4.5C12.5523 4.5 13 4.94772 13 5.5V11H18.5C19.0523 11 19.5 11.4477 19.5 12C19.5 12.5523 19.0523 13 18.5 13H13V18.5C13 19.0523 12.5523 19.5 12 19.5C11.4477 19.5 11 19.0523 11 18.5V13Z" fill="currentColor"></path>
              </svg>
            </span>
          </div>
          <div className="h-full w-auto mr-2 mt-1 flex justify-center items-center">
            <span className="">
              <button data-tab="10" aria-label="Emojis, GIF, Stickers" aria-disabled="false" aria-expanded="false" type="button" className="">
                <div className="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl">
                  <div className="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 x1q0g3np xh8yej3 xl56j7k">
                    <div className="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 x1vjfegm">
                      <span aria-hidden="true" data-icon="expressions" className="xxk0z11 xvy4d1p">
                        <svg viewBox="0 0 24 24" height="16" width="16" preserveAspectRatio="xMidYMid meet" className={isDark ? "text-slate-300" : "text-black"} fill="none">
                          <title>expressions</title>
                          <path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z" fill="currentColor">
                          </path>
                          <path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z" fill="currentColor">
                          </path>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z" fill="currentColor">
                          </path>
                        </svg>
                      </span>
                    </div>
                    <div className="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 x1vjfegm x1c4vz4f">
                    </div>
                  </div>
                </div>
              </button>
            </span>
          </div>
          <div className="flex-1 h-full flex items-center">
            Escribe un mensaje…
          </div>
          <div>
            <span aria-hidden="true" data-icon="mic-outlined" className="h-full w-auto">
              <svg viewBox="0 0 24 24" height="18" width="18" preserveAspectRatio="xMidYMid meet" className={isDark ? "text-slate-300" : "text-black"}>
                <title>mic-outlined</title>
                <path d="M12 14C11.1667 14 10.4583 13.7083 9.875 13.125C9.29167 12.5417 9 11.8333 9 11V5C9 4.16667 9.29167 3.45833 9.875 2.875C10.4583 2.29167 11.1667 2 12 2C12.8333 2 13.5417 2.29167 14.125 2.875C14.7083 3.45833 15 4.16667 15 5V11C15 11.8333 14.7083 12.5417 14.125 13.125C13.5417 13.7083 12.8333 14 12 14ZM12 21C11.4477 21 11 20.5523 11 20V17.925C9.26667 17.6917 7.83333 16.9167 6.7 15.6C5.78727 14.5396 5.24207 13.3387 5.06441 11.9973C4.9919 11.4498 5.44772 11 6 11C6.55228 11 6.98782 11.4518 7.0905 11.9945C7.27271 12.9574 7.73004 13.805 8.4625 14.5375C9.4375 15.5125 10.6167 16 12 16C13.3833 16 14.5625 15.5125 15.5375 14.5375C16.27 13.805 16.7273 12.9574 16.9095 11.9945C17.0122 11.4518 17.4477 11 18 11C18.5523 11 19.0081 11.4498 18.9356 11.9973C18.7579 13.3387 18.2127 14.5396 17.3 15.6C16.1667 16.9167 14.7333 17.6917 13 17.925V20C13 20.5523 12.5523 21 12 21ZM12 12C12.2833 12 12.5208 11.9042 12.7125 11.7125C12.9042 11.5208 13 11.2833 13 11V5C13 4.71667 12.9042 4.47917 12.7125 4.2875C12.5208 4.09583 12.2833 4 12 4C11.7167 4 11.4792 4.09583 11.2875 4.2875C11.0958 4.47917 11 4.71667 11 5V11C11 11.2833 11.0958 11.5208 11.2875 11.7125C11.4792 11.9042 11.7167 12 12 12Z" fill="currentColor"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
