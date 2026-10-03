import type { PreviewThemeMode } from '../../../../../../types';
import type { SmsData } from '../smsTypes';

const BODY = {
    width: 35.5,
    height: 15.8,
    upperArc: 6.3,
    lowerArc: 6.5,
    upperTension: 0.45,
    lowerTension: 0.43,
    upperRoundness: 0.20,
    lowerRoundness: 0.34,
    top: 35.2,
};

export function SmsHeaderAvatar({ themeMode }: { data: SmsData; themeMode: PreviewThemeMode }) {
    const background = themeMode === 'dark'
        ? 'linear-gradient(180deg, #555066 0%, #48425C 45%, #3A3152 100%)'
        : 'linear-gradient(180deg, #A9B9E0 0%, #97A6D6 45%, #7F8CC6 100%)';

    return (
        <div
            data-mobile13-sms-avatar="true"
            className="relative z-[2] grid size-[50px] shrink-0 place-items-center overflow-hidden rounded-full"
            style={{ background, color: '#FFFFFF' }}
        >
            <Mobile13SmsDefaultAvatar />
        </div>
    );
}

function Mobile13SmsDefaultAvatar() {
    const centerX = 28;

    const left = centerX - BODY.width / 2;
    const right = centerX + BODY.width / 2;

    const top = BODY.top;
    const bottom = top + BODY.height;

    // Punto donde se unen los dos arcos.
    const sideY = top + BODY.upperArc;

    const upperHandle = BODY.upperArc * BODY.upperTension;
    const lowerHandle = BODY.lowerArc * BODY.lowerTension;

    const upperWidth = BODY.width * BODY.upperRoundness;
    const lowerWidth = BODY.width * BODY.lowerRoundness;

    // Dos curvas superiores y dos inferiores.
    // Todas las uniones tienen tangentes continuas.
    const bodyPath = `
        M ${left} ${sideY}

        C ${left} ${sideY - upperHandle}
          ${centerX - upperWidth} ${top}
          ${centerX} ${top}

        C ${centerX + upperWidth} ${top}
          ${right} ${sideY - upperHandle}
          ${right} ${sideY}

        C ${right} ${sideY + lowerHandle}
          ${centerX + lowerWidth} ${bottom}
          ${centerX} ${bottom}

        C ${centerX - lowerWidth} ${bottom}
          ${left} ${sideY + lowerHandle}
          ${left} ${sideY}

        Z
    `;

    return (
        <svg
            viewBox="0 0 56 56"
            className="block size-full"
            preserveAspectRatio="xMidYMid meet"
            shapeRendering="geometricPrecision"
            aria-hidden="true"
            data-mobile13-sms-default-avatar="true"
        >
            {/* Cabeza original */}
            <circle
                cx="28"
                cy="20.2"
                r="10.5"
                fill="#FFFFFF"
            />

            {/* Cuerpo con arcos continuos */}
            <path
                d={bodyPath}
                fill="#FFFFFF"
                data-mobile13-sms-default-avatar-body="true"
            />
        </svg>
    );
}
