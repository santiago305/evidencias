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
  color: string;
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

export type SavedData = FormState & {
  tipoCliente: TipoCliente;
  conversationId?: string;
  seedCode?: string;
  generatedMessages?: GeneratedMessage[];
  progress?: ConversationProgressSummary;
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
