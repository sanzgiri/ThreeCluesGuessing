import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { getAchievement } from '@/lib/achievements';
import { ACHIEVEMENT_ICONS } from '@/lib/achievementIcons';

interface AchievementToastProps {
  /** Queue of newly-unlocked achievement ids to celebrate in order. */
  ids: string[];
  onDone: () => void;
}

/**
 * Shows a small banner for each newly unlocked achievement, one at a time.
 */
export default function AchievementToast({ ids, onDone }: AchievementToastProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [ids]);

  useEffect(() => {
    if (ids.length === 0) return;
    if (index >= ids.length) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), 2600);
    return () => clearTimeout(timer);
  }, [index, ids, onDone]);

  if (ids.length === 0 || index >= ids.length) return null;

  const achievement = getAchievement(ids[index]);
  if (!achievement) return null;

  const Icon = ACHIEVEMENT_ICONS[achievement.icon];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.96 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <Card className="flex items-center gap-3 border-primary/40 bg-card px-4 py-3 shadow-lg">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Achievement unlocked
              </p>
              <p className="text-sm font-bold">{achievement.title}</p>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
