interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2" data-testid="progress-indicator">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            i < currentStep
              ? 'bg-primary text-primary-foreground'
              : i === currentStep
              ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
