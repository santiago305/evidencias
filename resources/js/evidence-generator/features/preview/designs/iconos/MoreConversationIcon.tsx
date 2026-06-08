import type { SVGProps } from 'react';

export function MoreConversationIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 50"
            fill="currentColor"
            aria-hidden="true"
            {...props}
        >
            <path d="m20,26c-1.54,0-3.07-.59-4.24-1.76L1.76,10.24C-.59,7.9-.59,4.1,1.76,1.76,4.1-.59,7.9-.59,10.24,1.76l9.76,9.76L29.76,1.76c2.34-2.34,6.14-2.34,8.48,0,2.34,2.34,2.34,6.14,0,8.48l-14,14c-1.17,1.17-2.71,1.76-4.24,1.76Z" />
            <path d="m20,50c-1.54,0-3.07-.59-4.24-1.76L1.76,34.24c-2.34-2.34-2.34-6.14,0-8.48,2.34-2.34,6.14-2.34,8.48,0l9.76,9.76,9.76-9.76c2.34-2.34,6.14-2.34,8.48,0,2.34,2.34,2.34,6.14,0,8.48l-14,14c-1.17,1.17-2.71,1.76-4.24,1.76Z" />
        </svg>
    );
}

export default MoreConversationIcon;
