import type { ClueOutcome } from '@shared/types';
import { formatTime } from '@/hooks/use-stopwatch';

const EMOJI: Record<ClueOutcome, string> = {
  solved: '🟩',
  wrong: '🟥',
  gaveup: '⬛',
};

interface ShareInput {
  mode: 'daily' | 'arcade' | 'versus';
  correct: boolean;
  clueLevel: 1 | 2 | 3 | null;
  clueOutcomes: ClueOutcome[];
  dateLabel?: string;
  timeMs?: number | null;
}

/**
 * Build a Wordle-style shareable result string, e.g.:
 *
 *   Three Clues · Daily 2026-06-18
 *   Solved on clue 2/3 🎯 in 7.4s
 *   🟥🟩⬛
 */
export function buildShareText({ mode, correct, clueLevel, clueOutcomes, dateLabel, timeMs }: ShareInput): string {
  const titleMap = {
    daily: `Three Clues · Daily ${dateLabel ?? ''}`.trim(),
    arcade: 'Three Clues · Arcade',
    versus: 'Three Clues · Versus',
  };
  const title = titleMap[mode];

  const timeSuffix = correct && timeMs != null ? ` in ${formatTime(timeMs)}` : '';
  const headline = correct && clueLevel ? `Solved on clue ${clueLevel}/3 🎯${timeSuffix}` : 'Didn\'t get it 😅';

  const grid = [0, 1, 2].map((i) => EMOJI[clueOutcomes[i] ?? 'gaveup']).join('');

  return `${title}\n${headline}\n${grid}`;
}

/** Copy text to the clipboard with a legacy fallback. Returns success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
