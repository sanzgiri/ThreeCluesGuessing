import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight stopwatch. Starts when `running` becomes true, stops (freezes)
 * when it becomes false. Returns elapsed milliseconds. Reset via `resetKey`.
 */
export function useStopwatch(running: boolean, resetKey: unknown = 0) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Reset whenever resetKey changes.
  useEffect(() => {
    setElapsed(0);
    startRef.current = null;
  }, [resetKey]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    if (startRef.current == null) {
      startRef.current = performance.now() - elapsed;
    }

    const tick = () => {
      if (startRef.current != null) {
        setElapsed(performance.now() - startRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, resetKey]);

  return elapsed;
}

/** Format milliseconds as m:ss or s.s for short times. */
export function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
