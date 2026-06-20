import {
  Trophy,
  Flame,
  Zap,
  Target,
  Award,
  Crown,
  Timer,
  Swords,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react';
import type { Achievement } from '@shared/types';

/** Map an achievement icon name to its Lucide component. */
export const ACHIEVEMENT_ICONS: Record<Achievement['icon'], LucideIcon> = {
  Trophy,
  Flame,
  Zap,
  Target,
  Award,
  Crown,
  Timer,
  Swords,
  Sparkles,
  Star,
};
