import { Timer } from 'lucide-react';
import { formatTime } from '@/hooks/use-stopwatch';

interface RoundTimerProps {
  ms: number;
}

export default function RoundTimer({ ms }: RoundTimerProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground"
      role="timer"
      aria-label={`Elapsed time ${formatTime(ms)}`}
      data-testid="round-timer"
    >
      <Timer className="h-3.5 w-3.5" />
      {formatTime(ms)}
    </span>
  );
}
