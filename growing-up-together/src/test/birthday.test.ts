import { describe, expect, it } from 'vitest';
import { birthdayTime, countdownParts, extinguishCandles, toggleCandle } from '@/lib/birthday';
describe('Birthday rules', () => {
  it('targets November 19 2026 at visitor local midnight', () => {
    const date = new Date(birthdayTime());
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 10, 19, 0]);
  });
  it('calculates every countdown part from current time', () => {
    expect(countdownParts(0, 864e5 + 2 * 36e5 + 3 * 6e4 + 4000)).toEqual({days: 1, hours: 2, minutes: 3, seconds: 4, arrived: false});
  });
  it('stops at zero on the birthday', () => {
    expect(countdownParts(200, 100)).toEqual({days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true});
  });
  it('each candle extinguishes and relights independently', () => {
    const off = toggleCandle([true, true, true, true, true], 2);
    expect(off).toEqual([true, true, false, true, true]);
    expect(toggleCandle(off, 2)).toEqual([true, true, true, true, true]);
  });
  it('blows out all five flames without removing any candles', () => {
    const candles = [true, true, true, true, true];
    expect(extinguishCandles(candles)).toEqual([false, false, false, false, false]);
    expect(candles).toEqual([true, true, true, true, true]);
  });
});
