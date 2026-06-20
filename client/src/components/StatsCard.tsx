import { Card } from '@/components/ui/card';
import { Flame, Trophy, Target, Award } from 'lucide-react';

interface StatsCardProps {
  totalScore: number;
  streak: number;
  gamesPlayed: number;
  bestStreak?: number;
}

export default function StatsCard({ totalScore, streak, gamesPlayed, bestStreak }: StatsCardProps) {
  const showBest = typeof bestStreak === 'number';
  return (
    <div className={`grid gap-3 md:gap-4 ${showBest ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
      <Card className="p-4 md:p-6 text-center">
        <Trophy className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary" />
        <div
          className="font-display text-2xl md:text-3xl font-bold tabular-nums"
          data-testid="text-total-score"
        >
          {totalScore}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Total Score</div>
      </Card>

      <Card className="p-4 md:p-6 text-center">
        <Flame className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-destructive" />
        <div
          className="font-display text-2xl md:text-3xl font-bold tabular-nums"
          data-testid="text-streak"
        >
          {streak}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Day Streak</div>
      </Card>

      {showBest && (
        <Card className="p-4 md:p-6 text-center">
          <Award className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-chart-4" />
          <div
            className="font-display text-2xl md:text-3xl font-bold tabular-nums"
            data-testid="text-best-streak"
          >
            {bestStreak}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">Best Streak</div>
        </Card>
      )}

      <Card className="p-4 md:p-6 text-center">
        <Target className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary" />
        <div
          className="font-display text-2xl md:text-3xl font-bold tabular-nums"
          data-testid="text-games-played"
        >
          {gamesPlayed}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Games Played</div>
      </Card>
    </div>
  );
}
