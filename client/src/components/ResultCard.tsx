import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Flag, Share2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { buildShareText, copyToClipboard } from '@/lib/share';
import { getTodayString } from '@/lib/storage';
import { formatTime } from '@/hooks/use-stopwatch';
import type { ClueOutcome } from '@shared/types';

interface ResultCardProps {
  correct: boolean;
  gaveUp?: boolean;
  answer: string;
  points: number;
  streakBonus: number;
  totalPoints: number;
  clueLevel: 1 | 2 | 3 | null;
  clueOutcomes: ClueOutcome[];
  mode: 'daily' | 'arcade' | 'versus';
  timeMs?: number | null;
}

const OUTCOME_CLASS: Record<ClueOutcome, string> = {
  solved: 'bg-primary text-primary-foreground',
  wrong: 'bg-destructive/80 text-destructive-foreground',
  gaveup: 'bg-muted text-muted-foreground',
};

const OUTCOME_GLYPH: Record<ClueOutcome, string> = {
  solved: '✓',
  wrong: '✕',
  gaveup: '–',
};

export default function ResultCard({
  correct,
  gaveUp,
  answer,
  points,
  streakBonus,
  totalPoints,
  clueLevel,
  clueOutcomes,
  mode,
  timeMs,
}: ResultCardProps) {
  const { toast } = useToast();
  const [shared, setShared] = useState(false);

  const heading = correct ? 'Correct!' : gaveUp ? 'Answer Revealed' : 'Not Quite';

  const handleShare = async () => {
    const text = buildShareText({
      mode,
      correct,
      clueLevel,
      clueOutcomes,
      dateLabel: getTodayString(),
      timeMs,
    });

    // Prefer the native share sheet on mobile, fall back to clipboard.
    if (navigator.share && (mode === 'daily' || mode === 'versus')) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // user cancelled or unsupported — fall through to clipboard
      }
    }

    const ok = await copyToClipboard(text);
    setShared(ok);
    toast({
      title: ok ? 'Copied to clipboard' : 'Copy failed',
      description: ok ? 'Share your result anywhere!' : 'Your browser blocked clipboard access.',
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-8 md:p-12 text-center">
        <div
          className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            correct ? 'bg-primary/10' : gaveUp ? 'bg-muted' : 'bg-destructive/10'
          }`}
        >
          {correct ? (
            <Check className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          ) : gaveUp ? (
            <Flag className="w-9 h-9 md:w-11 md:h-11 text-muted-foreground" />
          ) : (
            <X className="w-10 h-10 md:w-12 md:h-12 text-destructive" />
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-2">{heading}</h2>

        {correct && clueLevel && (
          <p className="text-sm text-muted-foreground mb-1">
            Solved on clue {clueLevel} of 3{timeMs != null ? ` · ${formatTime(timeMs)}` : ''}
          </p>
        )}

        <p className="text-muted-foreground mb-6">
          The answer was:{' '}
          <span className="font-semibold text-foreground" data-testid="text-answer">
            {answer}
          </span>
        </p>

        {/* Clue outcome grid */}
        {clueOutcomes.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-6" aria-hidden="true">
            {clueOutcomes.map((o, i) => (
              <div
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold ${OUTCOME_CLASS[o]}`}
              >
                {OUTCOME_GLYPH[o]}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 max-w-sm mx-auto">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Points for this guess:</span>
            <span
              className="font-display text-xl font-bold tabular-nums"
              data-testid="text-base-points"
            >
              {points}
            </span>
          </div>

          {streakBonus > 0 && (
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Streak bonus:</span>
              <span
                className="font-display text-xl font-bold text-primary tabular-nums"
                data-testid="text-streak-bonus"
              >
                +{streakBonus}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">Total Points:</span>
            <span
              className="font-display text-3xl font-bold text-primary tabular-nums"
              data-testid="text-total-points"
            >
              {totalPoints}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2"
            data-testid="button-share"
            aria-label="Share your result"
          >
            {shared ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {shared ? 'Copied!' : 'Share result'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
