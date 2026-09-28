export type ContactIdentityInput = {
    nombre?: string | null;
    telefono?: string | null;
};

export type ContactIdentityOptions = {
    formatPhone?: (phone: string) => string;
};

export type ContactHeaderIdentity = {
    title: string;
    hasName: boolean;
    displaysPhone: boolean;
};

export function resolveContactHeaderIdentity(
    data: ContactIdentityInput,
    options: ContactIdentityOptions = {},
): ContactHeaderIdentity {
    const name = data.nombre?.trim() ?? '';
    const phone = data.telefono?.trim() ?? '';

    if (name) {
        return { title: name, hasName: true, displaysPhone: false };
    }

    if (phone) {
        return {
            title: options.formatPhone ? options.formatPhone(phone) : phone,
            hasName: false,
            displaysPhone: true,
        };
    }

    return { title: '-', hasName: false, displaysPhone: false };
}
