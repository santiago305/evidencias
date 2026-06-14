const BLOB_IMAGE_SRC_PATTERN = /^blob:/i;
const PNG_IMAGE_SRC_PATTERN = /^(?:https?:\/\/|\/|\.\/|\.\.\/).+\.png(?:[?#].*)?$/i;

export function resolveValidWhatsappAvatarImageSrc(value?: string | null): string | null {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return null;
    }

    return BLOB_IMAGE_SRC_PATTERN.test(trimmedValue) || PNG_IMAGE_SRC_PATTERN.test(trimmedValue) ? trimmedValue : null;
}
