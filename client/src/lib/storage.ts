import type { UserStats } from '@shared/types';

const STATS_KEY = 'three-clues-stats';
const DAILY_PLAYED_KEY = 'three-clues-daily-played';

const defaultStats: UserStats = {
  totalScore: 0,
  streak: 0,
  lastPlayedDate: null,
  gamesPlayed: 0,
  bestStreak: 0,
};

export function getUserStats(): UserStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultStats;
    return JSON.parse(stored);
  } catch {
    return defaultStats;
  }
}

export function setUserStats(stats: UserStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getDailyPlayedDate(): string | null {
  return localStorage.getItem(DAILY_PLAYED_KEY);
}

export function setDailyPlayedDate(date: string): void {
  localStorage.setItem(DAILY_PLAYED_KEY, date);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function hasPlayedToday(): boolean {
  const lastPlayed = getDailyPlayedDate();
  const today = getTodayString();
  return lastPlayed === today;
}
