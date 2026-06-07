export type WhatsappAvatarTheme = {
  bg: string;
  icon: string;
  border: string;
  badgeBg: string;
  badgeIcon: string;
  badgeRing: string;
};

type WhatsappAvatarThemeMode = "light" | "dark";

const DEFAULT_BADGE_THEME: Pick<
  WhatsappAvatarTheme,
  "badgeBg" | "badgeIcon" | "badgeRing"
> = {
  badgeBg: "#f7f5f3",
  badgeIcon: "#667781",
  badgeRing: "#ffffff",
};

const DEFAULT_DARK_BADGE_THEME: Pick<
  WhatsappAvatarTheme,
  "badgeBg" | "badgeIcon" | "badgeRing"
> = {
  badgeBg: "#202c33",
  badgeIcon: "#aebac1",
  badgeRing: "#111b21",
};

const WHATSAPP_AVATAR_THEMES: WhatsappAvatarTheme[] = [
  // 1. Azul WhatsApp claro
  {
    bg: "#d2e8fe",
    icon: "#0063cb",
    border: "#b8d4f0",
    ...DEFAULT_BADGE_THEME,
  },

  // 2. Coral / naranja suave
  {
    bg: "#fee2d8",
    icon: "#c4532d",
    border: "#edc7ba",
    ...DEFAULT_BADGE_THEME,
  },

  // 3. Verde agua / teal
  {
    bg: "#cbf2ee",
    icon: "#028377",
    border: "#afe0dc",
    ...DEFAULT_BADGE_THEME,
  },

  // 4. Rosado WhatsApp
  {
    bg: "#fbd8dc",
    icon: "#b80531",
    border: "#edbdc5",
    ...DEFAULT_BADGE_THEME,
  },

  // 5. Marrón / beige
  {
    bg: "#f4ded1",
    icon: "#855538",
    border: "#dec2b2",
    ...DEFAULT_BADGE_THEME,
  },

  // 6. Amarillo crema
  {
    bg: "#fff0d4",
    icon: "#9d6c2c",
    border: "#ead3a3",
    ...DEFAULT_BADGE_THEME,
  },

  // 7. Celeste WhatsApp
  {
    bg: "#caecfa",
    icon: "#027eb5",
    border: "#acd9eb",
    ...DEFAULT_BADGE_THEME,
  },

  // 8. Naranja WhatsApp
  {
    bg: "#fee2d8",
    icon: "#c4532d",
    border: "#edc7ba",
    ...DEFAULT_BADGE_THEME,
  },

  // 9. Verde claro
  {
    bg: "#d9fdd3",
    icon: "#1b8755",
    border: "#bcecad",
    ...DEFAULT_BADGE_THEME,
  },
];

const WHATSAPP_DARK_AVATAR_THEMES: WhatsappAvatarTheme[] = [
  {
    bg: "#3b261f",
    icon: "#d8a078",
    border: "#4a332b",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#17324d",
    icon: "#8ecbff",
    border: "#254963",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#43251d",
    icon: "#ffb59c",
    border: "#5d3429",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#123d3a",
    icon: "#7ee5da",
    border: "#1f5954",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#44202b",
    icon: "#ff9bb0",
    border: "#613040",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#3d2b22",
    icon: "#e5b48f",
    border: "#584033",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#443519",
    icon: "#ffd589",
    border: "#604d28",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#113747",
    icon: "#8edcff",
    border: "#205166",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#43251d",
    icon: "#ffb59c",
    border: "#5d3429",
    ...DEFAULT_DARK_BADGE_THEME,
  },
  {
    bg: "#163820",
    icon: "#9ee99c",
    border: "#245231",
    ...DEFAULT_DARK_BADGE_THEME,
  },
];

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createWhatsappAvatarTheme(seedInput?: string, themeMode: WhatsappAvatarThemeMode = "light"): WhatsappAvatarTheme {
  const normalizedSeed = (seedInput ?? "contact").trim().toLowerCase() || "contact";
  const seed = hashString(normalizedSeed);
  const themes = themeMode === "dark" ? WHATSAPP_DARK_AVATAR_THEMES : WHATSAPP_AVATAR_THEMES;

  const themeIndex = seed % themes.length;
  const theme = themes[themeIndex];

  return { ...theme };
}
