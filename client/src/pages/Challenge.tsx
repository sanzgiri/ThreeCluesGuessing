import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Swords, Home as HomeIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { decodeChallenge } from '@/lib/versus';
import { findPersonById } from '@/data/peopleHelpers';
import type { VersusChallenge } from '@shared/types';

/**
 * Landing page for an incoming versus link (/challenge#<token>). Shows who
 * challenged the player, then forwards them into the versus round (preserving
 * the hash so GameRound can decode it).
 */
export default function Challenge() {
  const [, setLocation] = useLocation();
  const [hash, setHash] = useState('');

  useEffect(() => {
    setHash(window.location.hash.replace(/^#/, ''));
  }, []);

  const challenge = useMemo<VersusChallenge | null>(
    () => (hash ? decodeChallenge(hash) : null),
    [hash],
  );

  const valid = challenge != null && findPersonById(challenge.personId) != null;

  const startDuel = () => {
    // Keep the token in the hash so the game round can read it.
    setLocation(`/play/versus#${hash}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Swords className="h-10 w-10 text-primary" />
          </div>

          <h1 className="font-display text-4xl font-bold mb-3">You've been challenged!</h1>

          {valid && challenge ? (
            <>
              <p className="mb-8 max-w-md text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">{challenge.by}</span> scored{' '}
                <span className="font-semibold text-primary">{challenge.points}</span>
                {challenge.clueLevel
                  ? ` by solving on clue ${challenge.clueLevel}`
                  : ' but did not solve it'}
                . Can you do better on the same puzzle?
              </p>

              <Card className="mb-8 w-full max-w-sm p-5">
                <p className="text-sm text-muted-foreground">Their score to beat</p>
                <p className="font-display text-5xl font-bold text-primary tabular-nums">
                  {challenge.points}
                </p>
              </Card>

              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="gap-2" onClick={startDuel} data-testid="button-accept-challenge">
                  <Swords className="h-4 w-4" />
                  Accept the duel
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => setLocation('/')}>
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-8 max-w-md text-lg text-muted-foreground">
                This challenge link looks invalid or expired. You can still jump into a fresh
                versus round.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="gap-2" onClick={() => setLocation('/play/versus')}>
                  <Swords className="h-4 w-4" />
                  Play Versus
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => setLocation('/')}>
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
