import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  onGiveUp?: () => void;
  disabled?: boolean;
  /** Bumping this number triggers a shake to signal a wrong guess. */
  shakeKey?: number;
}

export default function GuessInput({ onSubmit, onGiveUp, disabled = false, shakeKey = 0 }: GuessInputProps) {
  const [guess, setGuess] = useState('');

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setGuess('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-2"
      >
        <Input
          type="text"
          placeholder="Type the name..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(guess);
          }}
          disabled={disabled}
          className="flex-1 text-lg px-4 py-3"
          data-testid="input-guess"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus
          aria-label="Enter your guess for the person"
        />

        <Button
          onClick={() => submit(guess)}
          disabled={disabled || !guess.trim()}
          size="lg"
          className="px-8"
          data-testid="button-submit-guess"
          aria-label="Submit your guess"
        >
          Submit
        </Button>
      </motion.div>

      {onGiveUp && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onGiveUp}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            data-testid="button-give-up"
          >
            <Flag className="h-3.5 w-3.5" />
            Give up &amp; reveal answer
          </button>
        </div>
      )}
    </div>
  );
}
