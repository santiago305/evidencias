export const peruDayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
] as const;

export const greetingMatchers = [
  { slot: "mañana", match: /buenos dias|buen dia|que tengas buen dia/i },
  { slot: "tarde", match: /buenas tardes|buena tarde|que tengas buena tarde/i },
  { slot: "noche", match: /buenas noches|buena noche|que tengas buena noche/i },
] as const;

export const timeOfDayConfig = {
  morning: { maxHourExclusive: 12, saludo: "Buenos dias", tramo: "mañana" },
  afternoon: { maxHourExclusive: 19, saludo: "Buenas tardes", tramo: "tarde" },
  night: { saludo: "Buenas noches", tramo: "noche" },
} as const;
