import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { resolveValidWhatsappAvatarImageSrc } from './WhatsappAvatarImageSrc';

export function WhatsappAvatarImage({
    img64,
    alt,
    className,
    style,
    children,
}: {
    img64?: string | null;
    alt: string;
    className: string;
    style?: CSSProperties;
    children: ReactNode;
}) {
    const imageSrc = useMemo(() => resolveValidWhatsappAvatarImageSrc(img64), [img64]);
    const [hasImageError, setHasImageError] = useState(false);

    useEffect(() => {
        setHasImageError(false);
    }, [imageSrc]);

    if (!imageSrc || hasImageError) {
        return <>{children}</>;
    }

    return <img src={imageSrc} alt={alt} className={className} style={style} onError={() => setHasImageError(true)} />;
}
