import ModeCard from '../ModeCard';
import { Calendar, Zap, Users } from 'lucide-react';

export default function ModeCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ModeCard
        icon={Calendar}
        title="Daily Challenge"
        description="One puzzle per day, compete globally"
        onClick={() => console.log('Daily Challenge clicked')}
        badge="New!"
      />
      <ModeCard
        icon={Zap}
        title="Arcade Mode"
        description="Endless puzzles, play at your pace"
        onClick={() => console.log('Arcade Mode clicked')}
      />
      <ModeCard
        icon={Users}
        title="Versus Mode"
        description="Challenge friends asynchronously"
        onClick={() => console.log('Versus Mode clicked')}
        disabled
      />
    </div>
  );
}
