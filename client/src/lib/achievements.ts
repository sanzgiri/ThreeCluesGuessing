import type { Achievement, UserStats } from '@shared/types';

/** All achievements the player can unlock. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Steps',
    description: 'Win your first round.',
    icon: 'Star',
  },
  {
    id: 'sharp_eye',
    title: 'Sharp Eye',
    description: 'Solve a puzzle on the very first clue.',
    icon: 'Target',
  },
  {
    id: 'on_fire',
    title: 'On Fire',
    description: 'Reach a 3-day streak.',
    icon: 'Flame',
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Reach a 7-day streak.',
    icon: 'Zap',
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Reach a 30-day streak.',
    icon: 'Crown',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Solve a puzzle in under 10 seconds.',
    icon: 'Timer',
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Score 100 total points.',
    icon: 'Trophy',
  },
  {
    id: 'duelist',
    title: 'Duelist',
    description: 'Win a versus challenge.',
    icon: 'Swords',
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Play 25 rounds.',
    icon: 'Award',
  },
  {
    id: 'sniper',
    title: 'Sniper',
    description: 'Solve 10 puzzles on the first clue.',
    icon: 'Sparkles',
  },
];

const BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a] as const));

export function getAchievement(id: string): Achievement | undefined {
  return BY_ID.get(id);
}

/**
 * Given the latest stats, return the ids of any achievements that are now
 * satisfied. (Caller diffs against already-unlocked ids to find new ones.)
 */
export function evaluateAchievements(stats: UserStats): string[] {
  const unlocked: string[] = [];
  const add = (id: string, cond: boolean) => {
    if (cond) unlocked.push(id);
  };

  add('first_win', (stats.wins ?? 0) >= 1);
  add('sharp_eye', (stats.firstClueSolves ?? 0) >= 1);
  add('on_fire', stats.bestStreak >= 3);
  add('unstoppable', stats.bestStreak >= 7);
  add('legend', stats.bestStreak >= 30);
  add('speed_demon', stats.fastestSolveMs != null && stats.fastestSolveMs <= 10_000);
  add('centurion', stats.totalScore >= 100);
  add('duelist', (stats.versusWins ?? 0) >= 1);
  add('dedicated', stats.gamesPlayed >= 25);
  add('sniper', (stats.firstClueSolves ?? 0) >= 10);

  return unlocked;
}
