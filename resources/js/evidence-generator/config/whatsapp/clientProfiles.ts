import type { TipoCliente } from "../../types";

export const clientProfileOptions: {
  value: TipoCliente;
  label: string;
  description: string;
}[] = [
  {
    value: "apurado",
    label: "Apurado",
    description: "Va al grano y prioriza rapidez.",
  },
  {
    value: "sereno",
    label: "Sereno",
    description: "Analiza antes de decidir y pide claridad.",
  },
  {
    value: "desconfiado",
    label: "Desconfiado",
    description: "Necesita validar que el proceso sea real.",
  },
  {
    value: "frio",
    label: "Frio",
    description: "Responde poco y suele tardar mas.",
  },
  {
    value: "conversador",
    label: "Conversador",
    description: "Habla bastante y da contexto personal.",
  },
  {
    value: "indeciso",
    label: "Indeciso",
    description: "Tiene interes, pero duda antes de avanzar.",
  },
] as const;

export const clientProfileConfigMap: Record<
  TipoCliente,
  {
    durationMinutes: {
      min: number;
      max: number;
    };
  }
> = {
  apurado: {
    durationMinutes: { min: 4, max: 6 },
  },
  sereno: {
    durationMinutes: { min: 6, max: 8 },
  },
  desconfiado: {
    durationMinutes: { min: 7, max: 9 },
  },
  frio: {
    durationMinutes: { min: 9, max: 10 },
  },
  conversador: {
    durationMinutes: { min: 8, max: 10 },
  },
  indeciso: {
    durationMinutes: { min: 7, max: 9 },
  },
};

export function pickRandomClientProfile(randomValue = Math.random()) {
  const safeRandomValue =
    randomValue >= 0 && randomValue < 1 ? randomValue : Math.random();
  const index = Math.floor(safeRandomValue * clientProfileOptions.length);

  return clientProfileOptions[index]?.value ?? "sereno";
}
