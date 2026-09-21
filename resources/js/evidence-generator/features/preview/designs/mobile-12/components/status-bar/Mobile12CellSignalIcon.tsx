import type { ImgHTMLAttributes } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import signalImage from '../icons/senal-10.png';
import darkSignalImage from '../icons/senal-9-oscuro.png';

type Mobile12CellSignalIconProps = ImgHTMLAttributes<HTMLImageElement> & {
    themeMode?: PreviewThemeMode;
};

export function Mobile12CellSignalIcon({ className, themeMode = 'light', ...props }: Mobile12CellSignalIconProps) {
    return <img src={themeMode === 'dark' ? darkSignalImage : signalImage} alt="" aria-hidden="true" className={className} {...props} />;
}
