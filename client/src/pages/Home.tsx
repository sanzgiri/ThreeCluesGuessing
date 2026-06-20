import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Calendar, Zap, Users } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import ModeCard from '@/components/ModeCard';
import CategoryPreview from '@/components/CategoryPreview';
import ThemeToggle from '@/components/ThemeToggle';
import HowToPlay from '@/components/HowToPlay';
import AchievementsDialog from '@/components/AchievementsDialog';
import InstallButton from '@/components/InstallButton';
import { getUserStats, hasPlayedToday } from '@/lib/storage';
import type { UserStats } from '@shared/types';

export default function Home() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<UserStats>({
    totalScore: 0,
    streak: 0,
    lastPlayedDate: null,
    gamesPlayed: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  const isDailyPlayed = hasPlayedToday();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-end gap-1 mb-2">
          <HowToPlay />
          <ThemeToggle />
        </div>
        <header className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Three Clues
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Guess the person from three progressively specific clues
          </p>
        </header>

        <div className="mb-8">
          <StatsCard
            totalScore={stats.totalScore}
            streak={stats.streak}
            gamesPlayed={stats.gamesPlayed}
            bestStreak={stats.bestStreak}
          />
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <AchievementsDialog unlocked={stats.achievements ?? []} />
          <InstallButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ModeCard
            icon={Calendar}
            title="Daily Challenge"
            description="One puzzle per day, compete globally"
            onClick={() => setLocation('/play/daily')}
            disabled={isDailyPlayed}
            badge={isDailyPlayed ? 'Completed' : undefined}
          />
          <ModeCard
            icon={Zap}
            title="Arcade Mode"
            description="Endless puzzles, play at your pace"
            onClick={() => setLocation('/play/arcade')}
          />
          <ModeCard
            icon={Users}
            title="Versus Mode"
            description="Beat a puzzle, then challenge a friend"
            onClick={() => setLocation('/play/versus')}
          />
        </div>

        {isDailyPlayed && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              You've completed today's daily challenge! Come back tomorrow for a new one.
            </p>
          </div>
        )}

        <div className="mt-12">
          <CategoryPreview />
        </div>
      </div>
    </div>
  );
}
