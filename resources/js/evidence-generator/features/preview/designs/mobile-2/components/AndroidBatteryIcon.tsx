import type { SVGProps } from 'react';

type AndroidBatteryIconProps = SVGProps<SVGSVGElement> & {
    level?: number;
};

export function AndroidBatteryIcon({ level = 75, className, ...props }: AndroidBatteryIconProps) {
    const safeLevel = Math.max(0, Math.min(100, level));
    const fillWidth = (17.5 * safeLevel) / 100;

    return (
        <svg viewBox="0 0 26 13" fill="none" className={className} aria-hidden="true" {...props}>
            <rect x="0.75" y="1.25" width="21" height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />

            <rect x="2.6" y="3" width={fillWidth} height="7" rx="1.2" fill="currentColor" />

            <rect x="22.4" y="4" width="2.6" height="5" rx="1.2" fill="currentColor" />
        </svg>
    );
}
