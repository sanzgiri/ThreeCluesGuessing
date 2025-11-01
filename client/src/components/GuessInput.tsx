import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { people } from '@/data/people';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled?: boolean;
}

export default function GuessInput({ onSubmit, disabled = false }: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (value: string) => {
    setGuess(value);
    
    if (value.length > 0) {
      const filtered = people
        .map(p => p.name)
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      onSubmit(value.trim());
      setGuess('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setGuess(name);
    setShowSuggestions(false);
    handleSubmit(name);
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
            aria-describedby={showSuggestions ? "guess-suggestions" : undefined}
          />
          {showSuggestions && (
            <div 
              id="guess-suggestions"
              role="listbox"
              aria-label="Suggested names"
              className="absolute top-full left-0 right-0 mt-1 bg-popover border border-popover-border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
            >
              {suggestions.map((name, index) => (
                <button
                  key={index}
                  role="option"
                  onClick={() => handleSuggestionClick(name)}
                  className="w-full px-4 py-3 text-left hover-elevate active-elevate-2 text-sm"
                  data-testid={`suggestion-${index}`}
                  aria-label={`Select ${name}`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
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
