import { useState } from 'react';
import { addVote, removeVote } from '@/lib/services/vote-service';
import { VoteType } from '@/lib/types/votes';
import { Deal } from '@/lib/types/deals';
import { UUID } from 'crypto';

export function useVoting(deal: Deal | null, userId: UUID | null) {
  const [voteBusy, setVoteBusy] = useState(false);
  const [userVote, setUserVote] = useState<VoteType | null>(null);

  const handleVote = async (voteType: VoteType, onUpdate: (upvotes: number, downvotes: number) => void) => {
    if (!deal || !userId) return;
    
    setVoteBusy(true);
    try {
      // If clicking the same vote, remove it
      if (userVote === voteType) {
        await removeVote(String(deal.id), { userId });
        setUserVote(null);
        
        // Update local counts
        if (voteType === 1) {
          onUpdate(Math.max(0, deal.upvotes - 1), deal.downvotes);
        } else {
          onUpdate(deal.upvotes, Math.max(0, deal.downvotes - 1));
        }
      } else {
        // If switching votes or adding new vote
        if (userVote) {
          // Remove old vote first
          await removeVote(String(deal.id), { userId });
        }
        
        // Add new vote
        await addVote(String(deal.id), { userId, vote_type: voteType });
        setUserVote(voteType);
        
        // Update local counts
        let newUpvotes = deal.upvotes;
        let newDownvotes = deal.downvotes;
        
        if (userVote === 1) {
          newUpvotes = Math.max(0, newUpvotes - 1);
        } else if (userVote === -1) {
          newDownvotes = Math.max(0, newDownvotes - 1);
        }
        
        if (voteType === 1) {
          newUpvotes += 1;
        } else {
          newDownvotes += 1;
        }
        
        onUpdate(newUpvotes, newDownvotes);
      }
    } catch (err) {
      console.error('Failed to vote:', err);
      alert('Failed to vote. Please try again.');
    } finally {
      setVoteBusy(false);
    }
  };

  return {
    voteBusy,
    userVote,
    setUserVote,
    handleVote,
  };
}

