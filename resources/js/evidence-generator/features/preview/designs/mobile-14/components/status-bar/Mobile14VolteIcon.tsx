type Mobile14VolteIconProps = {
    className?: string;
    color?: string;
};

export function Mobile14VolteIcon({ className = '', color }: Mobile14VolteIconProps) {
    return (
        <span
            className={['text-[6.5px] leading-[0.9375] font-[800] tracking-[-0.04em] ml-1', className].filter(Boolean).join(' ')}
            style={color ? { color } : undefined}
            aria-hidden="true"
        >
            Vo
            <br />
            LTE
        </span>
    );
}
