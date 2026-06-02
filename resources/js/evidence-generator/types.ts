import type { ChangeEvent } from "react";

export type ActiveDesign = "whatsapp" | "llamada" | "sms";
export type ModoEntrada = "informativo" | "contactado";
export type TipoCliente =
  | "apurado"
  | "sereno"
  | "desconfiado"
  | "frio"
  | "conversador"
  | "indeciso";

export interface FormState {
  nombreAsesor: string;
  dni: string;
  telefono: string;
  nombre: string;
  monto: string;
  tasa: string;
  cuota: string;
  plazo: string;
  fechaHora: string;
  duracion: string;
  modoEntrada: ModoEntrada;
}

export interface GeneratedMessage {
  side: "in" | "out";
  time: string;
  lines: string[];
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
  languagePosition: "next-to-hidden" | "next-to-clock";
}

export interface PreviewTemporalBehavior {
  showTemporaryIcon: boolean;
  showDefaultTemporalMessage: boolean;
  temporalStatusLabel: "90 días" | "Desactivado";
  inlineTemporalMode: "active" | "deactive" | null;
}

export interface PreviewSnapshot {
  messageStatus: "read" | "delivered";
  temporalBehavior: PreviewTemporalBehavior;
  inlineTemporalInsertIndex: number | null;
  trayTime: string;
  trayDate: string;
  trayProfile: WindowsTrayProfile;
}

export type SavedData = FormState & {
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
}

export interface PreviewProps {
  data: SavedData | null;
}

export interface PreviewBlockProps extends PreviewProps {
  title: string;
  badge: string;
}

export interface RowProps {
  k: string;
  v: string;
}
