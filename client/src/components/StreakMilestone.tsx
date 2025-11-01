import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StreakMilestoneProps {
  streak: number;
  onClose: () => void;
}

export default function StreakMilestone({ streak, onClose }: StreakMilestoneProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getMilestoneInfo = (streak: number) => {
    if (streak === 3) {
      return {
        icon: Flame,
        title: 'On Fire!',
        message: '3-day streak! Keep it going!',
        color: 'text-destructive',
      };
    } else if (streak === 7) {
      return {
        icon: Zap,
        title: 'Unstoppable!',
        message: '7-day streak! You\'re on a roll!',
        color: 'text-primary',
      };
    } else if (streak === 30) {
      return {
        icon: Trophy,
        title: 'Legend!',
        message: '30-day streak! You\'re a true master!',
        color: 'text-chart-4',
      };
    }
    return null;
  };

  const milestoneInfo = getMilestoneInfo(streak);
  if (!milestoneInfo) return null;

  const Icon = milestoneInfo.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-8 text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Icon className={`w-20 h-20 mx-auto mb-4 ${milestoneInfo.color}`} />
              </motion.div>
              
              <h2 className="text-3xl font-display font-bold mb-2">{milestoneInfo.title}</h2>
              <p className="text-lg text-muted-foreground mb-6">{milestoneInfo.message}</p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <Flame className="w-6 h-6 text-destructive" />
                <span className="text-4xl font-display font-bold tabular-nums">{streak}</span>
                <span className="text-muted-foreground">days</span>
              </div>
              
              <Button onClick={() => {
                setShow(false);
                setTimeout(onClose, 300);
              }}>
                Awesome!
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
