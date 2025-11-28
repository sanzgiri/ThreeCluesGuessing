import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { people } from '@/data/peopleHelpers';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled?: boolean;
}

export default function GuessInput({ onSubmit, disabled = false }: GuessInputProps) {
  const [guess, setGuess] = useState('');

  const handleInputChange = (value: string) => {
    setGuess(value);
  };

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      const trimmedValue = value.trim();
      // Call parent submit handler
      onSubmit(trimmedValue);
      // Clear input after submission
      setGuess('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter your guess..."
            value={guess}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(guess)}
            disabled={disabled}
            className="text-lg px-4 py-3"
            data-testid="input-guess"
            autoComplete="off"
            autoFocus
            aria-label="Enter your guess for the person"
          />
        </div>
        <Button
          onClick={() => handleSubmit(guess)}
          disabled={disabled || !guess.trim()}
          size="lg"
          className="px-8"
          data-testid="button-submit-guess"
          aria-label="Submit your guess"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
