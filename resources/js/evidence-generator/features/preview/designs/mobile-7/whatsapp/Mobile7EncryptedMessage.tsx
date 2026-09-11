import type { PreviewThemeMode } from '../../../../../types';

export function Mobile7EncryptedMessage({ themeMode = 'light' }: { themeMode?: PreviewThemeMode }) {
    const isDark = themeMode === 'dark';
    const encryptedTextSize = 'text-[11.5px] leading-[15px]';
    const horizontalPadding = 'px-10';
    const maxWidth = 'max-w-none';

    return (
        <div className="relative">
            <div>
                <div className="relative pb-2.5">
                    <div className="flex justify-center">
                        <div>
                            <div className={`mx-auto flex ${maxWidth} flex-col justify-center ${horizontalPadding}`}>
                                <span></span>

                                <div
                                    className={[
                                        'relative mb-0 box-border inline-block max-w-full flex-none rounded-[9.1875px] px-[15px] pt-[5px] pb-[6.25px] text-center text-[12.5px] leading-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]',
                                        isDark ? 'bg-[#12181C] text-[#EECC84]' : 'bg-[#FFF0D4] text-black/60',
                                    ].join(' ')}
                                >
                                    <div className="relative z-10 rounded-[9.1875px]">
                                        <div className="cursorpointer">
                                            <span>
                                                <div
                                                    className={[
                                                        'me-[2.5px] mt-[2.5px] inline-block align-top',
                                                        isDark ? 'text-[#EECC84]' : 'text-black/60',
                                                    ].join(' ')}
                                                >
                                                    <span aria-hidden="true" data-icon="lock-small">
                                                        <svg
                                                            viewBox="0 0 10 12"
                                                            height="10"
                                                            width="8.75"
                                                            preserveAspectRatio="xMidYMid meet"
                                                            version="1.1"
                                                        >
                                                            <title>lock-small</title>
                                                            <path
                                                                d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z"
                                                                fill="currentColor"
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>

                                                <span className={`visible min-h-0 wrap-break-word ${encryptedTextSize}`}>
                                                    Los mensajes y las llamadas están cifrados de extremo a extremo. Solo las personas en este chat
                                                    pueden leerlos, escucharlos o compartirlos.{' '}
                                                    <strong className="font-semibold">Más información.</strong>
                                                </span>
                                            </span>
                                        </div>

                                        <span></span>
                                        <div></div>
                                    </div>

                                    <div className="absolute top-1/2 order-0 -mt-[16.25px] flex min-h-0 w-[126.25px] min-w-0 shrink grow-0 basis-auto flex-row flex-nowrap items-center justify-start self-auto justify-self-auto px-[5px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
