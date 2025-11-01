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
}

export interface RoundResult {
  correct: boolean;
  points: number;
  streakBonus: number;
  totalPoints: number;
  clueLevel: 1 | 2 | 3 | null;
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
