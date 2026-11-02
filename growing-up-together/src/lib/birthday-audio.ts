// Called only by the candle gesture; no audio is created during SSR or page load.
export function playBirthdaySong(source: string): () => void {
  const audio = new Audio(source);
  audio.currentTime = 0;
  audio.volume = 0;
  let stopped = false;
  let elapsed = 0;
  let fade: ReturnType<typeof setInterval> | undefined;
  let cutoff: ReturnType<typeof setTimeout> | undefined;
  const stop = () => {
    stopped = true;
    clearInterval(fade);
    clearTimeout(cutoff);
    audio.pause();
    audio.currentTime = 0;
    audio.removeEventListener("error", stop);
    audio.removeEventListener("ended", stop);
  };
  audio.addEventListener("error", stop);
  audio.addEventListener("ended", stop);
  // Enforce the maximum even when loading or playback is delayed.
  cutoff = setTimeout(stop, 15_000);
  try {
    void audio.play().then(() => {
      if (stopped) { audio.pause(); return; }
      fade = setInterval(() => {
        elapsed += 100;
        audio.volume = 0.25 * Math.max(0, Math.min(1, elapsed / 1000, (14_500 - elapsed) / 1000));
      }, 100);
    }).catch(stop);
  } catch { stop(); }
  return stop;
}