import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ClueCardProps {
  clueNumber: number;
  clueText: string;
  revealed: boolean;
}

export default function ClueCard({ clueNumber, clueText, revealed }: ClueCardProps) {
  return (
    <Card className="p-8 md:p-12 min-h-[240px] flex flex-col items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-md">
          CLUE {clueNumber}
        </span>
      </div>
      
      {revealed ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg md:text-xl text-center leading-relaxed max-w-2xl"
          data-testid={`text-clue-${clueNumber}`}
        >
          {clueText}
        </motion.p>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground">?</span>
          </div>
          <p className="text-muted-foreground">Clue not yet revealed</p>
        </div>
      )}
    </Card>
  );
}
