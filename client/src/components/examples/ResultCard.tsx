import ResultCard from '../ResultCard';

export default function ResultCardExample() {
  return (
    <div className="space-y-6">
      <ResultCard
        correct={true}
        answer="Albert Einstein"
        points={3}
        streakBonus={2}
        totalPoints={5}
      />
      <ResultCard
        correct={false}
        answer="William Shakespeare"
        points={0}
        streakBonus={0}
        totalPoints={0}
      />
    </div>
  );
}
