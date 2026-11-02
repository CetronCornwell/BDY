// A timezone-free date string means midnight in the visitor's local timezone.
export const birthdayTime = () => new Date(2026, 10, 19).getTime();
export function countdownParts(now: number, target = birthdayTime()) {
  const remaining = Math.max(0, target - now);
  return { days: Math.floor(remaining / 864e5), hours: Math.floor(remaining / 36e5) % 24, minutes: Math.floor(remaining / 6e4) % 60, seconds: Math.floor(remaining / 1e3) % 60, arrived: remaining === 0 };
}
export function toggleCandle(candles: boolean[], index: number) {
  return candles.map((value, i) => i === index ? !value : value);
}
export function extinguishCandles(candles: boolean[]) {
  return candles.map(() => false);
}
