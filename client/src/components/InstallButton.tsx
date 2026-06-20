import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/use-install-prompt';

export default function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={promptInstall}
      data-testid="button-install"
      aria-label="Install Three Clues app"
    >
      <Download className="h-4 w-4" />
      Install app
    </Button>
  );
}
