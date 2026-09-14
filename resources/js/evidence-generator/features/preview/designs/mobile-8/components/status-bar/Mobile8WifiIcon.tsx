import type { ImgHTMLAttributes } from 'react';
import wifiImage from '../icon/wif.png';

type Mobile8WifiIconProps = ImgHTMLAttributes<HTMLImageElement>;

export function Mobile8WifiIcon({ className, ...props }: Mobile8WifiIconProps) {
    return <img src={wifiImage} alt="" aria-hidden="true" className={className} {...props} />;
}
