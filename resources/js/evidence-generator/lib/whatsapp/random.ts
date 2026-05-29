export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: readonly T[], rng: () => number) {
  return arr[Math.floor(rng() * arr.length)];
}

export function pickWithFallback<T>(
  arr: readonly T[],
  fallback: readonly T[],
  rng: () => number
) {
  if (arr.length > 0) return pick(arr, rng);
  return pick(fallback, rng);
}
