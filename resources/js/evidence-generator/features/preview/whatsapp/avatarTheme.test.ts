import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createWhatsappAvatarTheme } from "./avatarTheme";

test("createWhatsappAvatarTheme supports dark mode avatar colors", () => {
  const source = readFileSync(new URL("./avatarTheme.ts", import.meta.url), "utf8");
  const lightTheme = createWhatsappAvatarTheme("Miguel", "light");
  const darkTheme = createWhatsappAvatarTheme("Miguel", "dark");

  assert.notEqual(darkTheme.bg, lightTheme.bg);
  assert.notEqual(darkTheme.icon, lightTheme.icon);
  assert.match(source, /bg: "#3b261f"/);
  assert.match(source, /icon: "#d8a078"/);
  assert.match(source, /border: "#4a332b"/);
  assert.equal(darkTheme.badgeBg, "#202c33");
  assert.equal(darkTheme.badgeIcon, "#aebac1");
  assert.equal(darkTheme.badgeRing, "#111b21");
});
