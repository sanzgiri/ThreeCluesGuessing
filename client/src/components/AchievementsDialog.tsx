import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { ACHIEVEMENT_ICONS } from '@/lib/achievementIcons';

interface AchievementsDialogProps {
  unlocked: string[];
}

export default function AchievementsDialog({ unlocked }: AchievementsDialogProps) {
  const unlockedSet = new Set(unlocked);
  const count = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id)).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-achievements">
          🏅 Achievements
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums">
            {count}/{ACHIEVEMENTS.length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Achievements</DialogTitle>
          <DialogDescription>
            Unlocked {count} of {ACHIEVEMENTS.length}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const isUnlocked = unlockedSet.has(a.id);
            const Icon = ACHIEVEMENT_ICONS[a.icon];
            return (
              <div
                key={a.id}
                className={`flex items-start gap-3 rounded-md border p-3 ${
                  isUnlocked ? 'bg-card' : 'bg-muted/40 opacity-70'
                }`}
                data-testid={`achievement-${a.id}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isUnlocked ? 'bg-primary/10' : 'bg-muted'
                  }`}
                >
                  {isUnlocked ? (
                    <Icon className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
