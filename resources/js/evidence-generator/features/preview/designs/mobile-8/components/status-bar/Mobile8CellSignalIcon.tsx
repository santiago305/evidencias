import type { SVGProps } from 'react';

type Mobile8CellSignalIconProps = SVGProps<SVGSVGElement>;

export function Mobile8CellSignalIcon(props: Mobile8CellSignalIconProps) {
    return (
        <svg viewBox="0 0 20 18" fill="none" aria-hidden="true" {...props}>
            <rect x="0.5" y="13.5" width="2.8" height="4" rx="0.9" fill="currentColor" />
            <rect x="5" y="10.5" width="2.8" height="7" rx="0.9" fill="currentColor" />
            <rect x="9.5" y="7" width="2.8" height="10.5" rx="0.9" fill="currentColor" />
            <rect x="14" y="3" width="2.8" height="14.5" rx="0.9" fill="currentColor" />
        </svg>
    );
}
