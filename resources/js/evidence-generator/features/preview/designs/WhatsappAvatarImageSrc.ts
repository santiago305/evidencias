const IMAGE_DATA_URL_PATTERN = /^data:image\/(?:jpeg|jpg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/i;

export function resolveValidWhatsappAvatarImageSrc(value?: string | null): string | null {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return null;
    }

    const match = IMAGE_DATA_URL_PATTERN.exec(trimmedValue);
    const base64Payload = match?.[1] ?? '';

    if (!match || base64Payload.length % 4 !== 0) {
        return null;
    }

    return trimmedValue;
}
