import { afterEach, describe, expect, it, vi } from 'vitest';
import { playBirthdaySong } from '@/lib/birthday-audio';

class TestAudio extends EventTarget {
  currentTime = 27;
  volume = 1;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
}

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('Birthday song rules', () => {
  function setup() {
    vi.useFakeTimers();
    const audio = new TestAudio();
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    return audio;
  }
  it('starts from the beginning only when invoked', async () => {
    const audio = setup();
    expect(audio.play).not.toHaveBeenCalled();
    const stop = playBirthdaySong('/audio/birthday-song.mp3');
    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledOnce();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(1000);
    expect(audio.volume).toBe(0.25);
    stop();
  });
  it('stops and rewinds after at most 15 seconds', async () => {
    const audio = setup();
    playBirthdaySong('/audio/birthday-song.mp3');
    await vi.advanceTimersByTimeAsync(14_999);
    expect(audio.pause).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(audio.pause).toHaveBeenCalledOnce();
    expect(audio.currentTime).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('contains missing audio failures and cleans up without throwing', async () => {
    const audio = setup();
    audio.play.mockRejectedValueOnce(new Error('Missing audio'));
    expect(() => playBirthdaySong('/audio/missing.mp3')).not.toThrow();
    await vi.advanceTimersByTimeAsync(0);
    expect(audio.pause).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('stops playback and timers when the scene is cleaned up', async () => {
    const audio = setup();
    const stop = playBirthdaySong('/audio/birthday-song.mp3');
    await Promise.resolve();
    stop();
    expect(audio.pause).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
});