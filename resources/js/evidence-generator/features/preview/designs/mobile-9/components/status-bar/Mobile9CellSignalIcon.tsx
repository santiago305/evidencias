import type { ImgHTMLAttributes } from 'react';
import type { PreviewThemeMode } from '../../../../../../types';
import signalImage from '../icons/senal-9.png';
import darkSignalImage from '../icons/senal-9-oscuro.png';

type Mobile9CellSignalIconProps = ImgHTMLAttributes<HTMLImageElement> & {
    themeMode?: PreviewThemeMode;
};

export function Mobile9CellSignalIcon({ className, themeMode = 'light', ...props }: Mobile9CellSignalIconProps) {
    return <img src={themeMode === 'dark' ? darkSignalImage : signalImage} alt="" aria-hidden="true" className={className} {...props} />;
}
