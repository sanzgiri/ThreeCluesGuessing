import GuessInput from '../GuessInput';

export default function GuessInputExample() {
  return (
    <div className="space-y-4">
      <GuessInput
        onSubmit={(guess) => console.log('Guess submitted:', guess)}
      />
      <GuessInput
        onSubmit={(guess) => console.log('Guess submitted:', guess)}
        disabled
      />
    </div>
  );
}
