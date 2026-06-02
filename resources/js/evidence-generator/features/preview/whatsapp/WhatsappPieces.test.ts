import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("DayChip sticks to the top of the WhatsApp conversation scroll", () => {
  const source = readFileSync(
    new URL("./WhatsappPieces.tsx", import.meta.url),
    "utf8",
  );
  const dayChipSource = source.slice(
    source.indexOf("export function DayChip"),
    source.indexOf("export function IncomingBubble"),
  );

  assert.match(dayChipSource, /sticky/);
  assert.match(dayChipSource, /top-2/);
  assert.match(dayChipSource, /z-\d+/);
});
