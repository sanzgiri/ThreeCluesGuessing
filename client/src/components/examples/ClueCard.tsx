import ClueCard from '../ClueCard';

export default function ClueCardExample() {
  return (
    <div className="space-y-4">
      <ClueCard
        clueNumber={1}
        clueText="I was born in the 19th century and transformed physics with revolutionary theories."
        revealed={true}
      />
      <ClueCard
        clueNumber={2}
        clueText="I formulated the theory of special and general relativity."
        revealed={false}
      />
    </div>
  );
}
