import { greetingMatchers } from "../../config/whatsapp/greetings.ts";

export function getGreetingSlot(text: string) {
  for (const item of greetingMatchers) {
    if (item.match.test(text)) return item.slot;
  }
  return null;
}

export function hasGreeting(lines: string[]) {
  return lines.some((line) => getGreetingSlot(line) !== null);
}

export function filterPostSimulacionOptions(
  options: string[][],
  slot: "mañana" | "tarde" | "noche",
  allowGreeting: boolean
) {
  return options.filter((lines) => {
    const slots = lines
      .map((line) => getGreetingSlot(line))
      .filter((value): value is "mañana" | "tarde" | "noche" => value !== null);

    if (slots.length === 0) return true;
    if (!allowGreeting) return false;
    return slots.every((item) => item === slot);
  });
}
