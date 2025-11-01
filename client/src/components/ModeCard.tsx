import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: string;
}

export default function ModeCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  disabled = false,
  badge 
}: ModeCardProps) {
  return (
    <Card 
      className={`p-6 hover-elevate active-elevate-2 cursor-pointer transition-all relative ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled ? undefined : onClick}
      data-testid={`card-mode-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {badge && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
            {badge}
          </span>
        </div>
      )}
      <Icon className="w-12 h-12 md:w-16 md:h-16 mb-4 text-primary" />
      <h2 className="text-xl md:text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm md:text-base text-muted-foreground">{description}</p>
    </Card>
  );
}
