import {
  peruDayNames,
  timeOfDayConfig,
} from "../../config/whatsapp/greetings";

export function getPeruDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
  };
}

export function parsePeruDateOnly(fechaHora: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(
    fechaHora.trim()
  );
  if (!match) return null;
  const [, y, m, d] = match;
  return { year: Number(y), month: Number(m), day: Number(d) };
}

export function formatDateDMY({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}) {
  return `${day}/${month}/${year}`;
}

export function getDayChipText(fechaHora: string) {
  const input = parsePeruDateOnly(fechaHora);
  if (!input) return "Hoy";

  const todayPeru = getPeruDateParts(new Date());

  const todayUtc = Date.UTC(todayPeru.year, todayPeru.month - 1, todayPeru.day);
  const inputUtc = Date.UTC(input.year, input.month - 1, input.day);
  const diffDays = Math.floor((todayUtc - inputUtc) / 86_400_000);

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";

  if (diffDays >= 2 && diffDays <= 6) {
    const dayIndex = new Date(inputUtc).getUTCDay();
    return peruDayNames[dayIndex] ?? "Hoy";
  }

  return formatDateDMY(input);
}

export function parseLocalDateTime(fechaHora: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(
    fechaHora.trim()
  );
  if (!match) return null;
  const [, y, m, d, h, min] = match;
  return new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(h),
    Number(min)
  );
}

export function formatTimeShort(date: Date) {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours24 >= 12 ? "p. m." : "a. m.";
  return `${hours12}:${minutes} ${period}`;
}

export function getTimeOfDayParts(date: Date) {
  const hour = date.getHours();

  if (hour < timeOfDayConfig.morning.maxHourExclusive) {
    return {
      saludo: timeOfDayConfig.morning.saludo,
      tramo: timeOfDayConfig.morning.tramo,
      slot: "mañana" as const,
    };
  }

  if (hour < timeOfDayConfig.afternoon.maxHourExclusive) {
    return {
      saludo: timeOfDayConfig.afternoon.saludo,
      tramo: timeOfDayConfig.afternoon.tramo,
      slot: "tarde" as const,
    };
  }

  return {
    saludo: timeOfDayConfig.night.saludo,
    tramo: timeOfDayConfig.night.tramo,
    slot: "noche" as const,
  };
}
