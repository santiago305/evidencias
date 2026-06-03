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
  {
    slot: "mañana",
    match: /buenos dias|buen dia|buenos días|buen día/i,
  },
  {
    slot: "tarde",
    match: /buenas tardes/i,
  },
  { slot: "noche", match: /buenas noches/i },
] as const;

export const timeOfDayConfig = {
  morning: {
    startHourInclusive: 5,
    endHourExclusive: 12,
    saludos: ["Buenos dias", "Buen dia", "Buenos días", "Buen día"],
    tramo: "mañana",
  },
  afternoon: {
    startHourInclusive: 12,
    endHourExclusive: 19,
    saludo: "Buenas tardes",
    tramo: "tarde",
  },
  night: {
    startHourInclusive: 19,
    saludo: "Buenas noches",
    tramo: "noche",
  },
} as const;
