import { Card } from '@/components/ui/card';
import { Swords } from 'lucide-react';
import { formatTime } from '@/hooks/use-stopwatch';
import type { VersusChallenge } from '@shared/types';

interface VersusResultProps {
  challenge: VersusChallenge;
  /** The current player's points for this round. */
  yourPoints: number;
  yourClueLevel: 1 | 2 | 3 | null;
  yourTimeMs: number | null;
  outcome: 'win' | 'lose' | 'tie';
}

function describe(clueLevel: 1 | 2 | 3 | null, points: number, timeMs: number | null): string {
  if (clueLevel == null) return 'Did not solve';
  const t = timeMs != null ? ` · ${formatTime(timeMs)}` : '';
  return `Clue ${clueLevel} · ${points} pt${points === 1 ? '' : 's'}${t}`;
}

export default function VersusResult({
  challenge,
  yourPoints,
  yourClueLevel,
  yourTimeMs,
  outcome,
}: VersusResultProps) {
  const banner =
    outcome === 'win'
      ? { text: 'You win! 🏆', cls: 'text-primary' }
      : outcome === 'lose'
        ? { text: 'You lose 😤', cls: 'text-destructive' }
        : { text: "It's a tie 🤝", cls: 'text-foreground' };

  return (
    <Card className="p-6 text-center" data-testid="versus-result">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Swords className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Versus
        </span>
      </div>

      <h3 className={`mb-5 text-2xl font-bold ${banner.cls}`}>{banner.text}</h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border bg-card p-3">
          <p className="mb-1 font-semibold">You</p>
          <p className="text-muted-foreground" data-testid="versus-you">
            {describe(yourClueLevel, yourPoints, yourTimeMs)}
          </p>
        </div>
        <div className="rounded-md border bg-card p-3">
          <p className="mb-1 truncate font-semibold" title={challenge.by}>
            {challenge.by}
          </p>
          <p className="text-muted-foreground" data-testid="versus-them">
            {describe(challenge.clueLevel, challenge.points, challenge.timeMs ?? null)}
          </p>
        </div>
      </div>
    </Card>
  );
}
