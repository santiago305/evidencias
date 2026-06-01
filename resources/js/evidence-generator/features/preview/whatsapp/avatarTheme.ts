export type WhatsappAvatarTheme = {
  bg: string;
  icon: string;
  border: string;
  badgeBg: string;
  badgeIcon: string;
  badgeRing: string;
};

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: number): () => number {
  let state = seed || 1;

  return () => {
    state += 0x6d2b79f5;
    let temp = state;
    temp = Math.imul(temp ^ (temp >>> 15), temp | 1);
    temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);
    return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  if (s === 0) {
    const gray = Math.round(l * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${gray}${gray}${gray}`;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const toChannel = (t: number): string => {
    let value = t;

    if (value < 0) {
      value += 1;
    }
    if (value > 1) {
      value -= 1;
    }

    let channel = p;

    if (value < 1 / 6) {
      channel = p + (q - p) * 6 * value;
    } else if (value < 1 / 2) {
      channel = q;
    } else if (value < 2 / 3) {
      channel = p + (q - p) * (2 / 3 - value) * 6;
    }

    return Math.round(channel * 255)
      .toString(16)
      .padStart(2, "0");
  };

  const red = toChannel(h + 1 / 3);
  const green = toChannel(h);
  const blue = toChannel(h - 1 / 3);

  return `#${red}${green}${blue}`;
}

export function createWhatsappAvatarTheme(seedInput?: string): WhatsappAvatarTheme {
  const seed = hashString((seedInput || "contact").trim().toLowerCase());
  const random = createSeededRandom(seed);

  // Base naranja WhatsApp, con variaciones suaves y apagadas.
  const baseHue = 28;
  const hue = baseHue + Math.round((random() - 0.5) * 14);

  const bgSaturation = 42 + Math.round(random() * 10);
  const bgLightness = 83 + Math.round(random() * 7);

  const iconSaturation = 43 + Math.round(random() * 12);
  const iconLightness = 33 + Math.round(random() * 8);

  const borderSaturation = Math.max(30, bgSaturation - 8);
  const borderLightness = Math.max(68, bgLightness - 8);

  // TODO: modo dark temporalmente desactivado, no eliminar referencia.
  // const darkThemePreset: WhatsappAvatarTheme = {
  //   bg: "#3b261f",
  //   icon: "#d8a078",
  //   border: "#4a332b",
  //   badgeBg: "#202c33",
  //   badgeIcon: "#aebac1",
  //   badgeRing: "#111b21",
  // };

  return {
    bg: hslToHex(hue, bgSaturation, bgLightness),
    icon: hslToHex(hue + 2, iconSaturation, iconLightness),
    border: hslToHex(hue, borderSaturation, borderLightness),
    badgeBg: "#f7f5f3",
    badgeIcon: "#667781",
    badgeRing: "#ffffff",
  };
}
