import type { ChangeEvent } from 'react';

export type ActiveDesign = 'whatsapp' | 'llamada' | 'sms';
export type PreviewDeviceMode = 'desktop' | 'mobile';
export type PreviewThemeMode = 'light' | 'dark';
export type WhatsappDesktopScale = 80 | 85 | 90 | 95 | 100;
export type ModoEntrada = 'informativo' | 'contactado';
export type TipoCliente = 'apurado' | 'sereno' | 'desconfiado' | 'frio' | 'conversador' | 'indeciso';
export type ConversationStatus = 'production' | 'development';
export type MobileDesignKey = 'mobile-1' | 'mobile-2';

export interface MobileDesignDefinition {
    key: MobileDesignKey;
    label: string;
    status: 'development' | 'production' | 'registered';
}

export interface FormState {
    telefono: string;
    nombre: string;
    dniCliente: string;
    monto: string;
    tasa: string;
    cuota: string;
    plazo: string;
    fechaHora: string;
    fechaHoraRegistro: string;
    duracion: string;
    img_64: string;
    img_64_file: File | null;
    modoEntrada: ModoEntrada;
}

export type FormInputKey = Exclude<keyof FormState, 'img_64_file'>;

export interface GeneratedMessage {
    side: 'in' | 'out';
    time: string;
    dateKey?: string;
    lines: string[];
    status?: 'sent' | 'delivered' | 'read';
    id_?: string;
    quote?: {
        side: 'in' | 'out';
        text: string;
    };
}

export interface ConversationProgressSummary {
    cycle: number;
    used: number;
    pending: number;
    total: number;
}

export interface WindowsTrayIcon {
    key: string;
    glyph: string;
    title: string;
    className?: string | null;
    iconClassName?: string | null;
}

export interface WindowsTrayLanguage {
    top: string;
    bottom?: string | null;
}

export interface WindowsTrayProfile {
    taskbarColor: string;
    icons: WindowsTrayIcon[];
    language: WindowsTrayLanguage;
    languagePosition: 'next-to-hidden' | 'next-to-clock';
}

export interface PreviewTemporalBehavior {
    showTemporaryIcon: boolean;
    showDefaultTemporalMessage: boolean;
    temporalStatusLabel: '90 días' | 'Desactivado';
    inlineTemporalMode: 'active' | 'deactive' | null;
}

export interface PreviewSnapshot {
    messageStatus: 'read' | 'delivered';
    temporalBehavior: PreviewTemporalBehavior;
    inlineTemporalInsertIndex: number | null;
    trayTime: string;
    trayDate: string;
    trayProfile: WindowsTrayProfile;
}

export type SavedData = FormState & {
    nombreAsesor: string;
    dni: string;
    sexualidadAsesor: 'M' | 'F';
    tipoCliente: TipoCliente;
    conversationId?: string;
    seedCode?: string;
    generatedMessages?: GeneratedMessage[];
    progress?: ConversationProgressSummary;
    trayProfile?: WindowsTrayProfile;
    previewSnapshot?: PreviewSnapshot;
};

export interface InputProps {
    label: string;
    type?: string;
    id?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    hint?: string;
    readOnly?: boolean;
    compact?: boolean;
    maxLength?: number;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    pattern?: string;
}

export interface PreviewProps {
    data: SavedData | null;
    themeMode: PreviewThemeMode;
}

export interface WhatsappDesktopScaleProps {
    whatsappDesktopScale: WhatsappDesktopScale;
}

export interface PreviewBlockProps extends PreviewProps {
    title: string;
    badge: string;
}

export interface RowProps {
    k: string;
    v: string;
    themeMode?: PreviewThemeMode;
}
