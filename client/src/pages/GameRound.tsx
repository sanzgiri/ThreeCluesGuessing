import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import ClueCard from '@/components/ClueCard';
import ProgressIndicator from '@/components/ProgressIndicator';
import GuessInput from '@/components/GuessInput';
import ResultCard from '@/components/ResultCard';
import Confetti from '@/components/Confetti';
import StreakMilestone from '@/components/StreakMilestone';
import { getDailyPerson, getRandomPerson, findPersonByName } from '@/data/people';
import { getUserStats, setUserStats, getTodayString, setDailyPlayedDate } from '@/lib/storage';
import type { Person, GamePhase, RoundResult } from '@shared/types';

export default function GameRound() {
  const [, params] = useRoute('/play/:mode');
  const [, setLocation] = useLocation();
  const mode = params?.mode as 'daily' | 'arcade';

  const [person, setPerson] = useState<Person | null>(null);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [currentClue, setCurrentClue] = useState(0);
  const [revealedClues, setRevealedClues] = useState<string[]>([]);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState(0);

  useEffect(() => {
    if (mode === 'daily') {
      setPerson(getDailyPerson(getTodayString()));
    } else {
      setPerson(getRandomPerson());
    }
  }, [mode]);

  useEffect(() => {
    if (person && phase === 'idle') {
      setPhase('clue1');
      setRevealedClues([person.clues[0]]);
      setCurrentClue(0);
    }
  }, [person, phase]);

  const handleRevealNextClue = () => {
    if (!person) return;
    
    if (currentClue === 0) {
      setPhase('clue2');
      setRevealedClues([...revealedClues, person.clues[1]]);
      setCurrentClue(1);
    } else if (currentClue === 1) {
      setPhase('clue3');
      setRevealedClues([...revealedClues, person.clues[2]]);
      setCurrentClue(2);
    }
  };

  const handleGuess = (guess: string) => {
    if (!person) return;

    const foundPerson = findPersonByName(guess);
    const correct = foundPerson?.id === person.id;
    
    const clueLevel = (currentClue + 1) as 1 | 2 | 3;
    const basePoints = correct ? (4 - clueLevel) : 0;
    
    const stats = getUserStats();
    const streakBonus = Math.min(stats.streak, 7);
    const totalPoints = basePoints + (correct ? streakBonus : 0);

    const roundResult: RoundResult = {
      correct,
      points: basePoints,
      streakBonus: correct ? streakBonus : 0,
      totalPoints,
      clueLevel: correct ? clueLevel : null,
    };

    setResult(roundResult);
    setPhase('result');

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const newStreak = correct ? stats.streak + 1 : 0;
    const newStats = {
      ...stats,
      totalScore: stats.totalScore + totalPoints,
      gamesPlayed: stats.gamesPlayed + 1,
      streak: newStreak,
      bestStreak: correct ? Math.max(stats.bestStreak, newStreak) : stats.bestStreak,
      lastPlayedDate: getTodayString(),
    };

    setUserStats(newStats);

    if (mode === 'daily') {
      setDailyPlayedDate(getTodayString());
    }

    if (correct && (newStreak === 3 || newStreak === 7 || newStreak === 30)) {
      setTimeout(() => {
        setMilestoneStreak(newStreak);
        setShowMilestone(true);
      }, 2000);
    }
  };

  const handlePlayAgain = () => {
    if (mode === 'arcade') {
      setPerson(getRandomPerson());
      setPhase('idle');
      setCurrentClue(0);
      setRevealedClues([]);
      setResult(null);
    } else {
      setLocation('/');
    }
  };

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
        <StreakMilestone
          streak={milestoneStreak}
          onClose={() => setShowMilestone(false)}
        />
      )}
      
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {person.category}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            data-testid="button-close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {phase !== 'result' && (
          <div className="mb-8">
            <ProgressIndicator currentStep={currentClue} totalSteps={3} />
          </div>
        )}

        <div className="space-y-6">
          {phase !== 'result' ? (
            <>
              {revealedClues.map((clue, index) => (
                <ClueCard
                  key={index}
                  clueNumber={index + 1}
                  clueText={clue}
                  revealed={true}
                />
              ))}

              <div className="py-8">
                <GuessInput onSubmit={handleGuess} />
              </div>

              {currentClue < 2 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleRevealNextClue}
                    data-testid="button-reveal-clue"
                  >
                    Reveal Next Clue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : result && (
            <>
              <ResultCard
                correct={result.correct}
                answer={person.name}
                points={result.points}
                streakBonus={result.streakBonus}
                totalPoints={result.totalPoints}
              />

              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handlePlayAgain}
                  data-testid="button-play-again"
                >
                  {mode === 'arcade' ? 'Play Again' : 'Back to Home'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
