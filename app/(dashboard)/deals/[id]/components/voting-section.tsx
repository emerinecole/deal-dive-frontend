import { Button } from '@/components/ui/button';
import { VoteType } from '@/lib/types/votes';

interface VotingSectionProps {
  upvotes: number;
  downvotes: number;
  userVote: VoteType | null;
  voteBusy: boolean;
  disabled: boolean;
  onVote: (voteType: VoteType) => void;
}

export function VotingSection({ 
  upvotes, 
  downvotes, 
  userVote, 
  voteBusy, 
  disabled, 
  onVote 
}: VotingSectionProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase text-muted-foreground">Votes</div>
      <div className="flex items-center gap-3">
        <Button
          variant={userVote === 1 ? 'default' : 'secondary'}
          size="sm"
          disabled={voteBusy || disabled}
          onClick={() => onVote(1)}
        >
          👍 {upvotes}
        </Button>

        <Button
          variant={userVote === -1 ? 'default' : 'secondary'}
          size="sm"
          disabled={voteBusy || disabled}
          onClick={() => onVote(-1)}
        >
          👎 {downvotes}
        </Button>
      </div>
    </div>
  );
}


