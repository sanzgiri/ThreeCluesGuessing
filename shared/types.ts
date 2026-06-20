export type GameMode = 'daily' | 'arcade' | 'versus';

export type GamePhase = 'idle' | 'clue1' | 'clue2' | 'clue3' | 'result';

export interface Person {
  id: string;
  name: string;
  category: string;
  clues: [string, string, string];
  imageUrl?: string;
  metadata?: {
    aliases?: string[];
    birthYear?: number;
    works?: string[];
  };
}

export interface UserStats {
  totalScore: number;
  streak: number;
  lastPlayedDate: string | null;
  gamesPlayed: number;
  bestStreak: number;
  /** Total correct answers across all modes. */
  wins?: number;
  /** Number of rounds solved on the very first clue. */
  firstClueSolves?: number;
  /** Fastest correct solve time in milliseconds. */
  fastestSolveMs?: number | null;
  /** Number of versus duels won. */
  versusWins?: number;
  /** IDs of achievements the player has unlocked. */
  achievements?: string[];
}

export interface RoundResult {
  correct: boolean;
  /** True when the player chose to reveal the answer instead of guessing. */
  gaveUp?: boolean;
  points: number;
  streakBonus: number;
  totalPoints: number;
  clueLevel: 1 | 2 | 3 | null;
  /** Per-clue outcome, used for the Wordle-style share grid. */
  clueOutcomes?: ClueOutcome[];
}

export type ClueOutcome = 'solved' | 'wrong' | 'gaveup';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** Lucide icon name used for display. */
  icon: 'Trophy' | 'Flame' | 'Zap' | 'Target' | 'Award' | 'Crown' | 'Timer' | 'Swords' | 'Sparkles' | 'Star';
}

/** A versus challenge encoded into a shareable link. */
export interface VersusChallenge {
  /** Person id the opponent must guess. */
  personId: string;
  /** Challenger display name. */
  by: string;
  /** Clue the challenger solved on (null = failed/gave up). */
  clueLevel: 1 | 2 | 3 | null;
  /** Challenger's points for the round. */
  points: number;
  /** Challenger's solve time in ms (optional). */
  timeMs?: number | null;
}

export interface GameState {
  mode: GameMode;
  phase: GamePhase;
  person: Person;
  currentClue: number;
  revealedClues: string[];
  guessSubmitted: boolean;
  result: RoundResult | null;
}
