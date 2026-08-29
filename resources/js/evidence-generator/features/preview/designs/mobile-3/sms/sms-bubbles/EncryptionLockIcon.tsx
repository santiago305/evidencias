export function EncryptionLockIcon({ color }: { color: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-[12px] shrink-0"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
            <rect x="5.5" y="10" width="13" height="10" rx="1.8" />
            <circle cx="12" cy="14.2" r="1.05" fill={color} stroke="none" />
            <path d="M12 15.1v2" strokeWidth="1.6" />
        </svg>
    );
}
