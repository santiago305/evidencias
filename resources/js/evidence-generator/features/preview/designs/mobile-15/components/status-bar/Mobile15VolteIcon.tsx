import type { SVGProps } from 'react';

const VOLTE_FIRST_START_X = 2;
const VOLTE_FIRST_WIDTH = 2;
const VOLTE_SECOND_START_X = 5;
const VOLTE_SECOND_WIDTH = 6;
const VOLTE_STROKE_WIDTH = 2.6;

export function Mobile15VolteIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <span className="text-[6.1px]  leading-[0.8375] font-bold tracking-[-0.04em]" aria-label="VoLTE">
            Vo
            <svg width={7} height={10} viewBox="0 -5 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-[1px] inline-block align-[-1px]" aria-hidden="true" {...props}>
                <path
                    d={`M${VOLTE_FIRST_START_X} 6 C${VOLTE_FIRST_START_X + VOLTE_FIRST_WIDTH} 7.5 ${VOLTE_FIRST_START_X + VOLTE_FIRST_WIDTH} 15.5 ${VOLTE_FIRST_START_X} 17`}
                    stroke="currentColor"
                    strokeWidth={VOLTE_STROKE_WIDTH}
                    strokeLinecap="round"
                />
                <path
                    d={`M${VOLTE_SECOND_START_X} 4 C${VOLTE_SECOND_START_X + VOLTE_SECOND_WIDTH} 6.5 ${VOLTE_SECOND_START_X + VOLTE_SECOND_WIDTH} 16.5 ${VOLTE_SECOND_START_X} 19`}
                    stroke="currentColor"
                    strokeWidth={VOLTE_STROKE_WIDTH}
                    strokeLinecap="round"
                />
            </svg>
            <br />
            LTE
        </span>
    );
}
