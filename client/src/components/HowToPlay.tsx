import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function HowToPlay() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="How to play"
          title="How to play"
          data-testid="button-how-to-play"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">How to Play</DialogTitle>
          <DialogDescription>Identify the hidden person from their clues.</DialogDescription>
        </DialogHeader>

        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <span>Read the first clue and type the name you think it is. Spelling doesn't have to be perfect.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <span>
              Guess wrong? The next, more specific clue is revealed. You get up to{' '}
              <strong>three clues</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <span>The earlier you guess correctly, the more points you earn.</span>
          </li>
        </ol>

        <div className="mt-2 rounded-md border bg-muted/40 p-4 text-sm">
          <p className="mb-2 font-semibold">Scoring</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              Clue 1 → <span className="font-semibold text-foreground">3 points</span>
            </li>
            <li>
              Clue 2 → <span className="font-semibold text-foreground">2 points</span>
            </li>
            <li>
              Clue 3 → <span className="font-semibold text-foreground">1 point</span>
            </li>
            <li className="pt-1">
              Daily wins add a <span className="font-semibold text-foreground">streak bonus</span>{' '}
              (+1 per day, up to +7).
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
