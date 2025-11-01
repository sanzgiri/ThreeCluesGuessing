import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultCardProps {
  correct: boolean;
  answer: string;
  points: number;
  streakBonus: number;
  totalPoints: number;
}

export default function ResultCard({ correct, answer, points, streakBonus, totalPoints }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-8 md:p-12 text-center">
        <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
          correct ? 'bg-primary/10' : 'bg-destructive/10'
        }`}>
          {correct ? (
            <Check className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          ) : (
            <X className="w-10 h-10 md:w-12 md:h-12 text-destructive" />
          )}
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {correct ? 'Correct!' : 'Not Quite'}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          The answer was: <span className="font-semibold text-foreground" data-testid="text-answer">{answer}</span>
        </p>
        
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Points for this guess:</span>
            <span className="font-display text-xl font-bold tabular-nums" data-testid="text-base-points">{points}</span>
          </div>
          
          {streakBonus > 0 && (
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Streak bonus:</span>
              <span className="font-display text-xl font-bold text-primary tabular-nums" data-testid="text-streak-bonus">+{streakBonus}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">Total Points:</span>
            <span className="font-display text-3xl font-bold text-primary tabular-nums" data-testid="text-total-points">{totalPoints}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
