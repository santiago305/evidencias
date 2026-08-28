import type { PreviewProps } from '../../../../../types';
import { EmptyState } from '../../../components/EmptyState';
import { buildMobilePreviewNotificationIds } from '../../../mobileNotifications';
import { Mobile1PreviewFrame } from '../Mobile1PreviewFrame';

/* =========================================================
   FORMATO DE FECHA
   Ejemplo:
   miércoles, 22 jul. · 3:33 p. m.
========================================================= */
function formatSmsDate(date: Date) {
    const weekday = new Intl.DateTimeFormat('es-PE', {
        weekday: 'long',
    }).format(date);

    const day = new Intl.DateTimeFormat('es-PE', {
        day: 'numeric',
    }).format(date);

    const month = new Intl.DateTimeFormat('es-PE', {
        month: 'short',
    }).format(date);

    const time = new Intl.DateTimeFormat('es-PE', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
        .format(date)
        .toLowerCase();

    return `${weekday}, ${day} ${month} · ${time}`;
}

/* =========================================================
   FORMATO SOLO HORA
   Ejemplo:
   4:47 p. m.
========================================================= */
function formatSmsTime(date: Date) {
    return new Intl.DateTimeFormat('es-PE', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
        .format(date)
        .toLowerCase();
}

/* =========================================================
   VERIFICAR SI LA FECHA ES HOY
========================================================= */
function isToday(date: Date) {
    const now = new Date();

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    );
}

/* =========================================================
   DOBLE CHECK

   El segundo check se pinta por encima del primero.

   El círculo sólido con backgroundColor funciona como
   máscara para que NO se vea el borde del primer círculo
   atravesando el segundo.
========================================================= */
function DoubleCheckIcon({
    color,
    backgroundColor,
}: {
    color: string;
    backgroundColor: string;
}) {
    return (
        <svg
            viewBox="0 0 30 20"
            className="h-[17px] w-[27px] shrink-0"
            fill="none"
            aria-hidden="true"
        >
            {/* =========================================
                PRIMER CHECK
            ========================================= */}
            <circle
                cx="9.5"
                cy="10"
                r="7.2"
                stroke={color}
                strokeWidth="1.65"
            />

            <path
                d="M6.1 10.1L8.7 12.5L13.1 7.9"
                stroke={color}
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* =========================================
                MÁSCARA DEL SEGUNDO CHECK

                Primero tapa la zona del primer círculo
                que queda debajo.
            ========================================= */}
            <circle
                cx="19.8"
                cy="10"
                r="8.15"
                fill={backgroundColor}
            />

            {/* =========================================
                SEGUNDO CHECK
            ========================================= */}
            <circle
                cx="19.8"
                cy="10"
                r="7.2"
                stroke={color}
                strokeWidth="1.65"
            />

            <path
                d="M16.4 10.1L19 12.5L23.4 7.9"
                stroke={color}
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* =========================================================
   CANDADO DE ESTADO DEL MENSAJE

   Es el mismo estilo del candado superior:
   - arco
   - cuerpo
   - ranura interior
========================================================= */
function MessageStatusLockIcon({
    color,
}: {
    color: string;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-[14px] w-[14px] shrink-0"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Arco */}
            <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />

            {/* Cuerpo */}
            <rect
                x="5.5"
                y="10"
                width="13"
                height="10"
                rx="1.8"
            />

            {/* Ranura */}
            <circle
                cx="12"
                cy="14.2"
                r="1.05"
                fill={color}
                stroke="none"
            />

            <path
                d="M12 15.1v2"
                strokeWidth="1.6"
            />
        </svg>
    );
}

/* =========================================================
   PREVIEW
========================================================= */
export function PreviewMobile1Sms({
    data,
    themeMode,
}: PreviewProps) {
    if (!data) {
        return <EmptyState />;
    }

    const isDark = themeMode === 'dark';

    const telefono = data.telefono || '995 592 200';

    const nombreCliente =
        data.nombre || 'Richard Cesar Cusi Angeles';

    const nombreAsesor =
        data.nombreAsesor || 'Franklin Vega Silva';

    const monto = data.monto || '65044.00';

    /* =====================================================
       FECHA DEL MENSAJE

       Intenta obtenerla de varias propiedades posibles.
       Si no existe ninguna, toma la hora actual.
    ===================================================== */
    const rawData = data as unknown as Record<string, unknown>;

    const rawMessageDate =
        rawData.fechaEnvio ??
        rawData.sentAt ??
        rawData.createdAt ??
        rawData.fecha;

    let messageDate = new Date();

    if (
        typeof rawMessageDate === 'string' ||
        typeof rawMessageDate === 'number' ||
        rawMessageDate instanceof Date
    ) {
        const parsedDate = new Date(rawMessageDate);

        if (!Number.isNaN(parsedDate.getTime())) {
            messageDate = parsedDate;
        }
    }

    const fechaConversacion = formatSmsDate(messageDate);
    const messageTime = formatSmsTime(messageDate);
    const messageIsToday = isToday(messageDate);

    /* =====================================================
       COLORES

       LIGHT
       Basados en la captura clara.

       DARK
       Basados en las dos capturas oscuras.
    ===================================================== */
    const colors = isDark
        ? {
              shell: '#1B1F22',
              header: '#1B1F22',

              conversation: '#0D1215',

              receivedBubble: '#1C2124',

              sentBubble: '#00627D',

              primaryText: '#E6E1E6',
              secondaryText: '#BFC0C5',

              headerIcon: '#C5C7CF',

              composer: '#1C2124',

              tealPoint: '#70B9D1',

              link: '#68B8D0',

              audioBackground: '#51456D',
              audioIcon: '#E4DDEF',

              redPoint: '#E9A0A5',

              statusCheck: '#C8C8CF',
          }
        : {
              shell: '#E9EEF2',
              header: '#E9EEF2',

              conversation: '#F6FAFD',

              receivedBubble: '#E9EEF2',

              sentBubble: '#00688D',

              primaryText: '#202124',
              secondaryText: '#5F6368',

              headerIcon: '#303438',

              composer: '#E9EEF2',

              tealPoint: '#008C95',

              link: '#147B86',

              audioBackground: '#E5DEFF',
              audioIcon: '#28243A',

              redPoint: '#B3261E',

              statusCheck: '#62676B',
          };

    return (
        <Mobile1PreviewFrame
            themeMode={themeMode}
            notificationIds={buildMobilePreviewNotificationIds(
                data,
                'mobile-3',
                'sms',
            )}
        >
            <div
                className="
                    flex
                    h-full
                    min-h-0
                    flex-col
                    overflow-hidden
                "
                style={{
                    backgroundColor: colors.shell,
                    color: colors.primaryText,
                    fontFamily:
                        'Roboto, "Google Sans", "Noto Sans", Arial, Helvetica, sans-serif',
                }}
            >
                {/* ======================================================
                    HEADER
                ====================================================== */}
                <header
                    className="
                        flex
                        h-[72px]
                        shrink-0
                        items-center
                        px-[12px]
                    "
                    style={{
                        backgroundColor: colors.header,
                    }}
                >
                    {/* ==================================================
                        VOLVER
                    ================================================== */}
                    <button
                        type="button"
                        className="
                            mr-[3px]
                            flex
                            h-[42px]
                            w-[42px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                        "
                        style={{
                            color: colors.headerIcon,
                        }}
                        aria-label="Volver"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-[26px] w-[26px]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* ==================================================
                        AVATAR
                    ================================================== */}
                    <div
                        className="
                            flex
                            h-[44px]
                            w-[44px]
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            bg-[#49B866]
                        "
                    >
                        <svg
                            viewBox="0 0 48 48"
                            className="h-[35px] w-[35px]"
                            fill={isDark ? '#15191C' : '#FFFFFF'}
                        >
                            <circle
                                cx="24"
                                cy="15.5"
                                r="8"
                            />

                            <path
                                d="
                                    M8 42
                                    C9.3 33
                                    15.5 28
                                    24 28
                                    C32.5 28
                                    38.7 33
                                    40 42
                                    Z
                                "
                            />
                        </svg>
                    </div>

                    {/* ==================================================
                        TELÉFONO
                    ================================================== */}
                    <div className="min-w-0 flex-1 pl-[11px]">
                        <div
                            className="
                                truncate
                                text-[17px]
                                font-normal
                                leading-none
                                tracking-[-0.2px]
                            "
                            style={{
                                color: colors.primaryText,
                            }}
                        >
                            {telefono}
                        </div>
                    </div>

                    {/* ==================================================
                        LLAMADA
                    ================================================== */}
                    <button
                        type="button"
                        className="
                            flex
                            h-[42px]
                            w-[42px]
                            shrink-0
                            items-center
                            justify-center
                        "
                        style={{
                            color: colors.headerIcon,
                        }}
                        aria-label="Llamar"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-[24px] w-[24px]"
                            fill="currentColor"
                        >
                            <path
                                d="
                                    M6.62 10.79
                                    A15.46 15.46 0 0 0 13.21 17.38
                                    L15.41 15.18
                                    A1 1 0 0 1 16.43 14.94
                                    A11.2 11.2 0 0 0 19.93 15.5
                                    A1 1 0 0 1 20.93 16.5
                                    V20
                                    A1 1 0 0 1 19.93 21
                                    C10.55 21 3 13.45 3 4
                                    A1 1 0 0 1 4 3
                                    H7.5
                                    A1 1 0 0 1 8.5 4
                                    A11.2 11.2 0 0 0 9.06 7.5
                                    A1 1 0 0 1 8.81 8.52
                                    Z
                                "
                            />
                        </svg>
                    </button>

                    {/* ==================================================
                        VIDEOLLAMADA
                    ================================================== */}
                    <button
                        type="button"
                        className="
                            flex
                            h-[42px]
                            w-[42px]
                            shrink-0
                            items-center
                            justify-center
                        "
                        style={{
                            color: colors.headerIcon,
                        }}
                        aria-label="Videollamada"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-[25px] w-[25px]"
                            fill="currentColor"
                        >
                            <path
                                d="
                                    M4 5
                                    H15
                                    A2 2 0 0 1 17 7
                                    V9.15
                                    L20.4 6.75
                                    A1 1 0 0 1 22 7.57
                                    V16.43
                                    A1 1 0 0 1 20.4 17.25
                                    L17 14.85
                                    V17
                                    A2 2 0 0 1 15 19
                                    H4
                                    A2 2 0 0 1 2 17
                                    V7
                                    A2 2 0 0 1 4 5
                                    Z
                                "
                            />
                        </svg>
                    </button>

                    {/* ==================================================
                        OPCIONES + PUNTO ROJO
                    ================================================== */}
                    <button
                        type="button"
                        className="
                            flex
                            h-[42px]
                            w-[35px]
                            shrink-0
                            items-center
                            justify-center
                        "
                        aria-label="Opciones"
                    >
                        <svg
                            viewBox="0 0 32 32"
                            className="h-[30px] w-[30px]"
                            fill="none"
                        >
                            <circle
                                cx="14.5"
                                cy="10"
                                r="2"
                                fill={colors.headerIcon}
                            />

                            <circle
                                cx="14.5"
                                cy="16"
                                r="2"
                                fill={colors.headerIcon}
                            />

                            <circle
                                cx="14.5"
                                cy="22"
                                r="2"
                                fill={colors.headerIcon}
                            />

                            {/* Borde alrededor del rojo */}
                            <circle
                                cx="21.9"
                                cy="6.2"
                                r="4"
                                fill={colors.header}
                            />

                            {/* Punto rojo */}
                            <circle
                                cx="21.9"
                                cy="6.2"
                                r="3.15"
                                fill={colors.redPoint}
                            />
                        </svg>
                    </button>
                </header>

                {/* ======================================================
                    CONVERSACIÓN
                ====================================================== */}
                <main
                    className="
                        relative
                        flex
                        min-h-0
                        flex-1
                        flex-col
                        overflow-hidden
                        rounded-t-[28px]
                    "
                    style={{
                        backgroundColor: colors.conversation,
                    }}
                >
                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            px-[8px]
                            pb-[15px]
                            pt-[20px]
                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                        "
                    >
                        {/* ==================================================
                            FECHA SUPERIOR
                        ================================================== */}
                        <div className="mb-[25px] flex justify-center">
                            <span
                                className="
                                    text-[11.5px]
                                    font-medium
                                    leading-none
                                    tracking-[-0.1px]
                                "
                                style={{
                                    color: colors.secondaryText,
                                }}
                            >
                                {fechaConversacion}
                            </span>
                        </div>

                        {/* ==================================================
                            RCS
                        ================================================== */}
                        <div className="mb-[7px] text-center">
                            <div
                                className="
                                    text-[11.5px]
                                    font-normal
                                    leading-[16px]
                                "
                                style={{
                                    color: colors.secondaryText,
                                }}
                            >
                                Chat RCS con {telefono}
                            </div>
                        </div>

                        {/* ==================================================
                            ENCRIPTACIÓN
                        ================================================== */}
                        <div
                            className="
                                mb-[26px]
                                flex
                                items-center
                                justify-center
                                gap-[6px]
                                text-[10.5px]
                                font-normal
                                leading-[15px]
                            "
                            style={{
                                color: colors.secondaryText,
                            }}
                        >
                            {/* Candado */}
                            <svg
                                viewBox="0 0 24 24"
                                className="h-[13px] w-[13px] shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />

                                <rect
                                    x="5.5"
                                    y="10"
                                    width="13"
                                    height="10"
                                    rx="1.8"
                                />

                                <circle
                                    cx="12"
                                    cy="14.2"
                                    r="1.05"
                                    fill="currentColor"
                                    stroke="none"
                                />

                                <path
                                    d="M12 15.1v2"
                                    strokeWidth="1.6"
                                />
                            </svg>

                            <span>
                                Ahora el chat está encriptado de extremo a extremo.
                            </span>

                            <span
                                className="
                                    underline
                                    underline-offset-2
                                "
                                style={{
                                    color: colors.link,
                                }}
                            >
                                Más información
                            </span>
                        </div>

                        {/* ==================================================
                            MENSAJE RECIBIDO
                        ================================================== */}
                        <div className="mb-[18px] flex justify-start px-[1px]">
                            <div
                                className="
                                    max-w-[72%]
                                    rounded-[23px]
                                    px-[14px]
                                    py-[9px]
                                    text-[15.5px]
                                    font-normal
                                    leading-[1.34]
                                    tracking-[-0.18px]
                                "
                                style={{
                                    backgroundColor:
                                        colors.receivedBubble,
                                    color: colors.primaryText,
                                }}
                            >
                                Buenas tardes, escriba un mensaje
                            </div>
                        </div>

                        {/* ==================================================
                            MENSAJES ENVIADOS
                        ================================================== */}
                        <div
                            className="
                                flex
                                flex-col
                                items-end
                                gap-[2px]
                                px-[1px]
                            "
                        >
                            {/* MENSAJE 1 */}
                            <div
                                className="
                                    max-w-[78%]
                                    rounded-[21px]
                                    rounded-br-[5px]
                                    px-[14px]
                                    py-[10px]
                                    text-[15.5px]
                                    font-normal
                                    leading-[1.39]
                                    tracking-[-0.18px]
                                "
                                style={{
                                    backgroundColor: colors.sentBubble,
                                    color: '#F8FCFF',
                                }}
                            >
                                Buenas tardes Sr {nombreCliente}, le habla{' '}
                                {nombreAsesor} asesor de la empresa impulsa a365
                                por encargo del banco de la nación
                            </div>

                            {/* MENSAJE 2 */}
                            <div
                                className="
                                    max-w-[78%]
                                    rounded-[21px]
                                    rounded-tr-[5px]
                                    rounded-br-[5px]
                                    px-[14px]
                                    py-[10px]
                                    text-[15.5px]
                                    font-normal
                                    leading-[1.39]
                                    tracking-[-0.18px]
                                "
                                style={{
                                    backgroundColor: colors.sentBubble,
                                    color: '#F8FCFF',
                                }}
                            >
                                Comentarte que hemos intentado comunicarnos con
                                usted a través de una llamada para brindarle lo
                                que es una pequeña información que actualmente
                                usted cuenta con un préstamo pre aprobado de S/{' '}
                                {monto} soles con una tasa promocional de 15.49%
                            </div>

                            {/* MENSAJE 3 */}
                            <div
                                className="
                                    max-w-[78%]
                                    rounded-[21px]
                                    rounded-tr-[5px]
                                    rounded-br-[5px]
                                    px-[14px]
                                    py-[10px]
                                    text-[15.5px]
                                    font-normal
                                    leading-[1.39]
                                    tracking-[-0.18px]
                                "
                                style={{
                                    backgroundColor: colors.sentBubble,
                                    color: '#F8FCFF',
                                }}
                            >
                                Tendrá unos minutos para darle toda la
                                información a través de una llamada
                            </div>

                            {/* MENSAJE 4 */}
                            <div
                                className="
                                    max-w-[78%]
                                    rounded-[21px]
                                    rounded-tr-[5px]
                                    px-[14px]
                                    py-[10px]
                                    text-[15.5px]
                                    font-normal
                                    leading-[1.39]
                                    tracking-[-0.18px]
                                "
                                style={{
                                    backgroundColor: colors.sentBubble,
                                    color: '#F8FCFF',
                                }}
                            >
                                Toda la información brindada luego la puede
                                corroborar asistiendo al banco de la nación con
                                su DNI
                            </div>

                            {/* =================================================
                                ESTADO DEL MENSAJE DE HOY

                                Hora + doble check + candado
                            ================================================= */}
                            {messageIsToday && (
                                <div
                                    className="
                                        mt-[7px]
                                        flex
                                        items-center
                                        justify-end
                                        gap-[5px]
                                        pr-[5px]
                                    "
                                    style={{
                                        color: colors.secondaryText,
                                    }}
                                >
                                    {/* Hora */}
                                    <span
                                        className="
                                            text-[10.5px]
                                            font-normal
                                            leading-none
                                        "
                                    >
                                        {messageTime}
                                    </span>

                                    {/* Doble check */}
                                    <DoubleCheckIcon
                                        color={colors.statusCheck}
                                        backgroundColor={
                                            colors.conversation
                                        }
                                    />

                                    {/* Candado */}
                                    <MessageStatusLockIcon
                                        color={colors.statusCheck}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ==================================================
                            FECHA / SIM PARA MENSAJES ANTIGUOS
                        ================================================== */}
                        {!messageIsToday && (
                            <>
                                <div className="mt-[25px] flex justify-center">
                                    <span
                                        className="
                                            text-[11.5px]
                                            font-medium
                                            leading-none
                                            tracking-[-0.1px]
                                        "
                                        style={{
                                            color: colors.secondaryText,
                                        }}
                                    >
                                        {fechaConversacion}
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-[22px]
                                        flex
                                        items-center
                                        justify-center
                                        gap-[4px]
                                        text-[10.5px]
                                    "
                                    style={{
                                        color: colors.secondaryText,
                                    }}
                                >
                                    <span>Enviado con</span>

                                    <span
                                        className="
                                            underline
                                            underline-offset-2
                                        "
                                        style={{
                                            color: colors.link,
                                        }}
                                    >
                                        3 SIM 1
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ======================================================
                        INPUT INFERIOR
                    ====================================================== */}
                    <div
                        className="
                            shrink-0
                            px-[8px]
                            pb-[10px]
                            pt-[6px]
                        "
                        style={{
                            backgroundColor: colors.conversation,
                        }}
                    >
                        <div className="flex items-end gap-[7px]">
                            {/* =================================================
                                INPUT
                            ================================================= */}
                            <div
                                className="
                                    flex
                                    min-h-[54px]
                                    flex-1
                                    items-center
                                    rounded-[29px]
                                    px-[11px]
                                "
                                style={{
                                    backgroundColor: colors.composer,
                                }}
                            >
                                {/* ==========================================
                                    +
                                ========================================== */}
                                <button
                                    type="button"
                                    className="
                                        mr-[7px]
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                    "
                                    style={{
                                        color: colors.headerIcon,
                                    }}
                                    aria-label="Agregar"
                                >
                                    <svg
                                        viewBox="0 0 32 32"
                                        className="h-[30px] w-[30px]"
                                        fill="none"
                                    >
                                        {/* círculo */}
                                        <circle
                                            cx="15"
                                            cy="16"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2.1"
                                        />

                                        {/* + */}
                                        <path
                                            d="M15 11v10M10 16h10"
                                            stroke="currentColor"
                                            strokeWidth="2.1"
                                            strokeLinecap="round"
                                        />

                                        {/* máscara */}
                                        <circle
                                            cx="22.2"
                                            cy="8.8"
                                            r="4.05"
                                            fill={colors.composer}
                                        />

                                        {/* punto turquesa */}
                                        <circle
                                            cx="22.2"
                                            cy="8.8"
                                            r="3.55"
                                            fill={colors.tealPoint}
                                        />
                                    </svg>
                                </button>

                                {/* ==========================================
                                    MENSAJE RCS
                                ========================================== */}
                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                        truncate
                                        pl-[1px]
                                        text-[15.7px]
                                        font-normal
                                        tracking-[-0.12px]
                                    "
                                    style={{
                                        color: colors.secondaryText,
                                    }}
                                >
                                    Mensaje RCS
                                </div>

                                {/* ==========================================
                                    EMOJI
                                ========================================== */}
                                <button
                                    type="button"
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                    "
                                    style={{
                                        color: colors.headerIcon,
                                    }}
                                    aria-label="Emoji"
                                >
                                    <svg
                                        viewBox="0 0 32 32"
                                        className="h-[30px] w-[30px]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Cara */}
                                        <circle
                                            cx="15"
                                            cy="16"
                                            r="10.8"
                                        />

                                        {/* Ojo izquierdo */}
                                        <circle
                                            cx="11.4"
                                            cy="12.8"
                                            r="1.3"
                                            fill="currentColor"
                                            stroke="none"
                                        />

                                        {/* Ojo derecho */}
                                        <circle
                                            cx="18.6"
                                            cy="12.8"
                                            r="1.3"
                                            fill="currentColor"
                                            stroke="none"
                                        />

                                        {/* Sonrisa */}
                                        <path
                                            d="
                                                M10.2 18.1
                                                C11.35 20.3
                                                13.05 21.3
                                                15.15 21.3
                                                C17.2 21.3
                                                18.95 20.3
                                                20.1 18.1
                                            "
                                        />

                                        {/* máscara */}
                                        <circle
                                            cx="22.7"
                                            cy="8.3"
                                            r="3.95"
                                            fill={colors.composer}
                                            stroke="none"
                                        />

                                        {/* punto turquesa */}
                                        <circle
                                            cx="22.7"
                                            cy="8.3"
                                            r="3.45"
                                            fill={colors.tealPoint}
                                            stroke="none"
                                        />
                                    </svg>
                                </button>

                                {/* ==========================================
                                    GALERÍA
                                ========================================== */}
                                <button
                                    type="button"
                                    className="
                                        ml-[2px]
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                    "
                                    aria-label="Galería"
                                >
                                    <svg
                                        viewBox="0 0 32 32"
                                        className="h-[30px] w-[30px]"
                                        fill="none"
                                    >
                                        {/* marco */}
                                        <rect
                                            x="5"
                                            y="5"
                                            width="22"
                                            height="22"
                                            rx="3"
                                            stroke={colors.headerIcon}
                                            strokeWidth="2.1"
                                        />

                                        {/* sol */}
                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="2.15"
                                            fill={colors.headerIcon}
                                        />

                                        {/* montaña pequeña */}
                                        <path
                                            d="
                                                M7 24
                                                L11.4 18.6
                                                C11.8 18.1
                                                12.4 18.1
                                                12.8 18.6
                                                L16.9 24
                                                Z
                                            "
                                            fill={colors.headerIcon}
                                        />

                                        {/* montaña grande */}
                                        <path
                                            d="
                                                M12.8 24
                                                L19 16.4
                                                C19.4 15.9
                                                20.1 15.9
                                                20.5 16.4
                                                L26 23.2
                                                V24
                                                Z
                                            "
                                            fill={colors.headerIcon}
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* =================================================
                                AUDIO
                            ================================================= */}
                            <button
                                type="button"
                                className="
                                    flex
                                    h-[54px]
                                    w-[54px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                "
                                style={{
                                    backgroundColor:
                                        colors.audioBackground,
                                    color: colors.audioIcon,
                                }}
                                aria-label="Mensaje de voz"
                            >
                                <svg
                                    viewBox="0 0 30 30"
                                    className="h-[27px] w-[27px]"
                                    fill="currentColor"
                                >
                                    <rect
                                        x="3"
                                        y="12"
                                        width="2.2"
                                        height="6"
                                        rx="1.1"
                                    />

                                    <rect
                                        x="7"
                                        y="9"
                                        width="2.2"
                                        height="12"
                                        rx="1.1"
                                    />

                                    <rect
                                        x="11"
                                        y="6"
                                        width="2.2"
                                        height="18"
                                        rx="1.1"
                                    />

                                    <rect
                                        x="15"
                                        y="8"
                                        width="2.2"
                                        height="14"
                                        rx="1.1"
                                    />

                                    <rect
                                        x="19"
                                        y="10"
                                        width="2.2"
                                        height="10"
                                        rx="1.1"
                                    />

                                    <rect
                                        x="23"
                                        y="12"
                                        width="2.2"
                                        height="6"
                                        rx="1.1"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </Mobile1PreviewFrame>
    );
}