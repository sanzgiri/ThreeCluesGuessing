import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import { suggestPeople } from '@/data/peopleHelpers';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  onGiveUp?: () => void;
  disabled?: boolean;
  /** Bumping this number triggers a shake to signal a wrong guess. */
  shakeKey?: number;
}

export default function GuessInput({ onSubmit, onGiveUp, disabled = false, shakeKey = 0 }: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => (guess.trim() ? suggestPeople(guess) : []), [guess]);

  useEffect(() => {
    setHighlight(0);
  }, [guess]);

  // Close the suggestion list when clicking outside.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setGuess('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (open && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => (h + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        submit(suggestions[highlight]?.name ?? guess);
        return;
      }
    } else if (e.key === 'Enter') {
      submit(guess);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto relative">
      <motion.div
        key={shakeKey}
        animate={shakeKey > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-2"
      >
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter your guess..."
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="text-lg px-4 py-3"
            data-testid="input-guess"
            autoComplete="off"
            autoFocus
            role="combobox"
            aria-expanded={open && suggestions.length > 0}
            aria-autocomplete="list"
            aria-label="Enter your guess for the person"
          />

          {open && suggestions.length > 0 && (
            <ul
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg"
              role="listbox"
            >
              {suggestions.map((person, i) => (
                <li
                  key={person.id}
                  role="option"
                  aria-selected={i === highlight}
                  className={`cursor-pointer px-4 py-2 text-left text-sm ${
                    i === highlight ? 'bg-accent text-accent-foreground' : ''
                  }`}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submit(person.name);
                  }}
                  data-testid={`suggestion-${i}`}
                >
                  <span className="font-medium">{person.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{person.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

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
