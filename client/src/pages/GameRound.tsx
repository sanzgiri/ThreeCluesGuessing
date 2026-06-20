import { useState, useEffect, useMemo } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ClueCard from '@/components/ClueCard';
import ProgressIndicator from '@/components/ProgressIndicator';
import GuessInput from '@/components/GuessInput';
import ResultCard from '@/components/ResultCard';
import Confetti from '@/components/Confetti';
import StreakMilestone from '@/components/StreakMilestone';
import ThemeToggle from '@/components/ThemeToggle';
import RoundTimer from '@/components/RoundTimer';
import AchievementToast from '@/components/AchievementToast';
import VersusResult from '@/components/VersusResult';
import ChallengeFriend from '@/components/ChallengeFriend';
import {
  getDailyPerson,
  getRandomPerson,
  findPersonByName,
  findPersonById,
} from '@/data/peopleHelpers';
import { getUserStats, setUserStats, getTodayString, setDailyPlayedDate } from '@/lib/storage';
import { evaluateAchievements } from '@/lib/achievements';
import { decodeChallenge } from '@/lib/versus';
import { useToast } from '@/hooks/use-toast';
import { useStopwatch } from '@/hooks/use-stopwatch';
import type {
  Person,
  GamePhase,
  RoundResult,
  ClueOutcome,
  VersusChallenge,
} from '@shared/types';

export default function GameRound() {
  const [, params] = useRoute('/play/:mode');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const mode = params?.mode as 'daily' | 'arcade' | 'versus';

  // Decode an incoming versus challenge from the URL hash (set by /challenge).
  const challenge = useMemo<VersusChallenge | null>(() => {
    if (mode !== 'versus') return null;
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
    return hash ? decodeChallenge(hash) : null;
  }, [mode]);

  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [person, setPerson] = useState<Person | null>(null);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [currentClue, setCurrentClue] = useState(0);
  const [revealedClues, setRevealedClues] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [roundKey, setRoundKey] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [solveMs, setSolveMs] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState(0);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Stopwatch runs while a round is in progress.
  const elapsed = useStopwatch(phase !== 'idle' && phase !== 'result', roundKey);

  useEffect(() => {
    if (mode === 'daily') {
      setPerson(getDailyPerson(getTodayString()));
    } else if (mode === 'versus') {
      const target = challenge ? findPersonById(challenge.personId) : null;
      // Fall back to a random person if the challenge link is invalid.
      setPerson(target ?? getRandomPerson());
    } else {
      setPerson(getRandomPerson());
    }
  }, [mode, challenge]);

  useEffect(() => {
    if (person && phase === 'idle') {
      setPhase('clue1');
      setRevealedClues([person.clues[0]]);
      setCurrentClue(0);
      setSeenIds((ids) => (ids.includes(person.id) ? ids : [...ids, person.id]));
    }
  }, [person, phase]);

  /** Build the per-clue colour grid for the share card. */
  const buildClueOutcomes = (
    solvedClueIndex: number | null,
    cluesSeen: number,
    gaveUp: boolean,
  ): ClueOutcome[] =>
    [0, 1, 2].map((i) => {
      if (i >= cluesSeen) return 'gaveup'; // never revealed
      if (solvedClueIndex !== null && i === solvedClueIndex) return 'solved';
      if (gaveUp && i === cluesSeen - 1) return 'gaveup';
      return 'wrong';
    });

  const finishRound = (correct: boolean, clueLevel: 1 | 2 | 3 | null, gaveUp: boolean) => {
    const stats = getUserStats();
    const basePoints = correct && clueLevel ? 4 - clueLevel : 0;
    const streakBonus = correct ? Math.min(stats.streak, 7) : 0;
    const totalPoints = basePoints + streakBonus;

    const cluesSeen = currentClue + 1;
    const solvedIdx = correct && clueLevel ? clueLevel - 1 : null;
    const timeMs = correct ? Math.round(elapsed) : null;
    setSolveMs(timeMs);

    const roundResult: RoundResult = {
      correct,
      gaveUp,
      points: basePoints,
      streakBonus,
      totalPoints,
      clueLevel: correct ? clueLevel : null,
      clueOutcomes: buildClueOutcomes(solvedIdx, cluesSeen, gaveUp),
    };

    setResult(roundResult);
    setPhase('result');

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Determine versus outcome (player wins ties on equal points if faster).
    const versusWin =
      mode === 'versus' && challenge
        ? totalPointsBeats(basePoints, timeMs, challenge.points, challenge.timeMs ?? null)
        : false;

    // Daily streak only advances in daily mode; other modes don't break it.
    const newStreak =
      mode === 'daily' ? (correct ? stats.streak + 1 : 0) : stats.streak;

    const newStats = {
      ...stats,
      totalScore: stats.totalScore + totalPoints,
      gamesPlayed: stats.gamesPlayed + 1,
      streak: newStreak,
      bestStreak: Math.max(stats.bestStreak, newStreak),
      lastPlayedDate: getTodayString(),
      wins: (stats.wins ?? 0) + (correct ? 1 : 0),
      firstClueSolves: (stats.firstClueSolves ?? 0) + (correct && clueLevel === 1 ? 1 : 0),
      fastestSolveMs:
        correct && timeMs != null
          ? Math.min(stats.fastestSolveMs ?? Infinity, timeMs)
          : stats.fastestSolveMs ?? null,
      versusWins: (stats.versusWins ?? 0) + (versusWin ? 1 : 0),
    };

    // Detect newly-unlocked achievements.
    const already = new Set(stats.achievements ?? []);
    const nowUnlocked = evaluateAchievements(newStats);
    const fresh = nowUnlocked.filter((id) => !already.has(id));
    newStats.achievements = Array.from(new Set([...(stats.achievements ?? []), ...nowUnlocked]));

    setUserStats(newStats);
    if (fresh.length > 0) {
      // Slight delay so it doesn't clash with the result animation.
      setTimeout(() => setNewAchievements(fresh), 700);
    }

    if (mode === 'daily') {
      setDailyPlayedDate(getTodayString());
    }

    if (mode === 'daily' && correct && (newStreak === 3 || newStreak === 7 || newStreak === 30)) {
      setTimeout(() => {
        setMilestoneStreak(newStreak);
        setShowMilestone(true);
      }, 2000);
    }
  };

  const handleGuess = (guess: string) => {
    if (!person || phase === 'result') return;

    const foundPerson = findPersonByName(guess);
    const correct = foundPerson?.id === person.id;

    if (correct) {
      finishRound(true, (currentClue + 1) as 1 | 2 | 3, false);
      return;
    }

    setWrongGuesses((g) => [...g, guess]);
    setShakeKey((k) => k + 1);

    if (currentClue < 2) {
      const nextIndex = currentClue + 1;
      setCurrentClue(nextIndex);
      setRevealedClues([...revealedClues, person.clues[nextIndex]]);
      setPhase(nextIndex === 1 ? 'clue2' : 'clue3');
      toast({
        title: foundPerson ? `Not ${foundPerson.name}` : 'Not quite',
        description: `Here's clue ${nextIndex + 1}.`,
        duration: 2000,
      });
      return;
    }

    finishRound(false, null, false);
  };

  const handleGiveUp = () => {
    if (!person || phase === 'result') return;
    finishRound(false, null, true);
  };

  const resetRound = (next: Person) => {
    setPerson(next);
    setPhase('idle');
    setCurrentClue(0);
    setRevealedClues([]);
    setWrongGuesses([]);
    setResult(null);
    setSolveMs(null);
    setRoundKey((k) => k + 1);
  };

  const handlePlayAgain = () => {
    if (mode === 'arcade' || mode === 'versus') {
      resetRound(getRandomPerson(seenIds));
    } else {
      setLocation('/');
    }
  };

  // Build a challenge object so the player can pass this same puzzle to a friend.
  const myChallenge: VersusChallenge | null =
    person && result
      ? {
          personId: person.id,
          by: 'A friend',
          clueLevel: result.clueLevel,
          points: result.points,
          timeMs: solveMs,
        }
      : null;

  const versusOutcome: 'win' | 'lose' | 'tie' | null =
    mode === 'versus' && challenge && result
      ? computeVersusOutcome(result.points, solveMs, challenge.points, challenge.timeMs ?? null)
      : null;

  if (!person) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <Confetti />}
      {showMilestone && (
        <StreakMilestone streak={milestoneStreak} onClose={() => setShowMilestone(false)} />
      )}
      <AchievementToast ids={newAchievements} onDone={() => setNewAchievements([])} />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {mode}
            </span>
            <span
              className="text-sm font-medium text-muted-foreground"
              role="status"
              aria-label={`Category: ${person.category}`}
            >
              {person.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {phase !== 'result' && <RoundTimer ms={elapsed} />}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
              data-testid="button-close"
              aria-label="Close game and return home"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {mode === 'versus' && challenge && phase !== 'result' && (
          <div className="mb-6 rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm">
            <span className="font-semibold">{challenge.by}</span> challenged you — they scored{' '}
            <span className="font-semibold text-primary">{challenge.points}</span>
            {challenge.clueLevel ? ` on clue ${challenge.clueLevel}` : ' but missed it'}. Beat them!
          </div>
        )}

        {phase !== 'result' && (
          <div
            className="mb-8"
            role="status"
            aria-live="polite"
            aria-label={`Clue ${currentClue + 1} of 3`}
          >
            <ProgressIndicator currentStep={currentClue} totalSteps={3} />
          </div>
        )}

        <div className="space-y-6">
          {revealedClues.map((clue, index) => (
            <ClueCard key={index} clueNumber={index + 1} clueText={clue} revealed={true} />
          ))}

          {phase !== 'result' && wrongGuesses.length > 0 && (
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              aria-label="Your previous guesses"
            >
              <span className="text-xs text-muted-foreground">Tried:</span>
              {wrongGuesses.map((g, i) => (
                <span
                  key={i}
                  className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive line-through"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          <div className={`py-8 ${phase === 'result' ? 'hidden' : ''}`}>
            <GuessInput onSubmit={handleGuess} onGiveUp={handleGiveUp} shakeKey={shakeKey} />
          </div>

          {phase === 'result' && result && (
            <>
              {versusOutcome && challenge && (
                <VersusResult
                  challenge={challenge}
                  yourPoints={result.points}
                  yourClueLevel={result.clueLevel}
                  yourTimeMs={solveMs}
                  outcome={versusOutcome}
                />
              )}

              <ResultCard
                correct={result.correct}
                gaveUp={result.gaveUp}
                answer={person.name}
                points={result.points}
                streakBonus={result.streakBonus}
                totalPoints={result.totalPoints}
                clueLevel={result.clueLevel}
                clueOutcomes={result.clueOutcomes ?? []}
                mode={mode}
                timeMs={solveMs}
              />

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handlePlayAgain}
                  data-testid="button-play-again"
                  aria-label={mode === 'daily' ? 'Return to home page' : 'Start a new game'}
                >
                  {mode === 'daily' ? 'Back to Home' : 'Play Again'}
                </Button>
                {myChallenge && <ChallengeFriend challenge={myChallenge} />}
                {mode !== 'daily' && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation('/')}
                    aria-label="Return to home page"
                  >
                    Home
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Lower time wins ties; more points always wins. */
function totalPointsBeats(
  myPoints: number,
  myTimeMs: number | null,
  theirPoints: number,
  theirTimeMs: number | null,
): boolean {
  if (myPoints !== theirPoints) return myPoints > theirPoints;
  if (myPoints === 0) return false; // neither solved
  if (myTimeMs == null) return false;
  if (theirTimeMs == null) return true;
  return myTimeMs < theirTimeMs;
}

function computeVersusOutcome(
  myPoints: number,
  myTimeMs: number | null,
  theirPoints: number,
  theirTimeMs: number | null,
): 'win' | 'lose' | 'tie' {
  if (myPoints !== theirPoints) return myPoints > theirPoints ? 'win' : 'lose';
  if (myPoints === 0) return 'tie'; // both missed
  if (myTimeMs == null && theirTimeMs == null) return 'tie';
  if (myTimeMs == null) return 'lose';
  if (theirTimeMs == null) return 'win';
  if (myTimeMs === theirTimeMs) return 'tie';
  return myTimeMs < theirTimeMs ? 'win' : 'lose';
}
