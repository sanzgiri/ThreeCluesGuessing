import { useState } from 'react';
import { Swords, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { buildChallengeUrl } from '@/lib/versus';
import { copyToClipboard } from '@/lib/share';
import type { VersusChallenge } from '@shared/types';

interface ChallengeFriendProps {
  challenge: VersusChallenge;
}

/** Button that creates a shareable versus link for the round just played. */
export default function ChallengeFriend({ challenge }: ChallengeFriendProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = buildChallengeUrl(challenge);
    const shareData = {
      title: 'Three Clues — I challenge you!',
      text: `Can you beat me? I scored ${challenge.points} on this puzzle.`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // cancelled / unsupported — fall through to clipboard
      }
    }

    const ok = await copyToClipboard(url);
    setCopied(ok);
    toast({
      title: ok ? 'Challenge link copied' : 'Copy failed',
      description: ok ? 'Send it to a friend to start a duel!' : 'Your browser blocked clipboard access.',
      duration: 2500,
    });
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      className="gap-2"
      onClick={handleClick}
      data-testid="button-challenge-friend"
      aria-label="Challenge a friend with this puzzle"
    >
      {copied ? <Check className="h-4 w-4" /> : <Swords className="h-4 w-4" />}
      {copied ? 'Link copied!' : 'Challenge a friend'}
    </Button>
  );
}
