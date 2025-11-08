import { Button } from '@/components/ui/button';
import { VoteType } from '@/lib/types/votes';
import { cn } from '@/lib/utils';

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
          className={cn(
            'font-semibold',
            voteBusy || disabled ? 'opacity-50 cursor-not-allowed' : '',
            userVote === 1
              ? 'bg-blue-500 text-white hover:bg-blue-600' // Blue if voted up
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Light grey if not voted
          )}
          size="sm"
          disabled={voteBusy || disabled}
          onClick={() => onVote(1)}
        >
          👍 {upvotes}
        </Button>

        <Button
          className={cn(
            'font-semibold',
            voteBusy || disabled ? 'opacity-50 cursor-not-allowed' : '',
            userVote === -1
              ? 'bg-blue-500 text-white hover:bg-blue-600' // Blue if voted down
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Light grey if not voted
          )}
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
