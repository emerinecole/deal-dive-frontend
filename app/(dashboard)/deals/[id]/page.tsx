'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getDeal } from '@/lib/services/deal-service';
import { getVotes } from '@/lib/services/vote-service';
import { getComments } from '@/lib/services/comment-service';
import { Deal } from '@/lib/types/deals';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { UUID } from 'crypto';

import { useVoting } from './hooks/use-voting';
import { useComments } from './hooks/use-comments';
import { useReporting } from './hooks/use-reporting';
import { DealHeader } from './components/deal-header';
import { VotingSection } from './components/voting-section';
import { CommentSection } from './components/comment-section';
import { ReportDialog } from './components/report-dialog';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const from = searchParams.get('from') || 'list';

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<UUID | null>(null);

  // Custom hooks for feature logic
  const voting = useVoting(deal, userId);
  const commentsHook = useComments(id, userId);
  const reporting = useReporting(id, userId);

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id as UUID);
      }
    });
  }, []);

  // Fetch deal data
  useEffect(() => {
    if (!id) return;
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const data = await getDeal(id);
        setDeal(data);
      } catch (err) {
        setError('Failed to load deal: ' + err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  // Fetch comments and votes
  useEffect(() => {
    if (!id || !userId) return;
    
    const fetchCommentsAndVotes = async () => {
      try {
        const [commentsData, votesData] = await Promise.all([
          getComments(id),
          getVotes(id)
        ]);
        
        // Ensure commentsData is an array
        if (Array.isArray(commentsData)) {
          commentsHook.setComments(commentsData);
        } else {
          console.warn('Comments data is not an array:', commentsData);
          commentsHook.setComments([]);
        }
        
        // Determine user's current vote
        if (votesData?.votes && Array.isArray(votesData.votes)) {
          const myVote = votesData.votes.find(v => v.userId === userId);
          if (myVote) {
            voting.setUserVote(myVote.voteType);
          }
        }
      } catch (err) {
        console.error('Failed to load comments/votes:', err);
        commentsHook.setComments([]);
      }
    };
    
    fetchCommentsAndVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  const handleBack = () => {
    if (from === 'map') router.push('/?tab=map');
    else router.push('/?tab=list');
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading deal...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-500">{error ?? 'Deal not found'}</p>
        <Button variant="secondary" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DealHeader
        deal={deal}
        saved={saved}
        onSaveToggle={() => setSaved((s) => !s)}
      />

      <p className="text-sm text-muted-foreground">{deal.description}</p>

      {/* Votes and comments count */}
      <div className="grid grid-cols-2 gap-4">
        <VotingSection
          upvotes={deal.upvotes}
          downvotes={deal.downvotes}
          userVote={voting.userVote}
          voteBusy={voting.voteBusy}
          disabled={!userId}
          onVote={(voteType) => {
            voting.handleVote(voteType, (upvotes, downvotes) => {
              setDeal({ ...deal, upvotes, downvotes });
            });
          }}
        />
        <div className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">Comments</div>
          <div className="text-sm">{deal.comment_count}</div>
        </div>
      </div>

      <CommentSection
        comments={commentsHook.comments}
        comment={commentsHook.comment}
        commentsBusy={commentsHook.commentsBusy}
        userId={userId}
        onCommentChange={commentsHook.setComment}
        onAddComment={() => {
          commentsHook.handleAddComment((count) => {
            setDeal({ ...deal, comment_count: count });
          });
        }}
        onDeleteComment={(commentId) => {
          commentsHook.handleDeleteComment(commentId, (count) => {
            setDeal({ ...deal, comment_count: count });
          });
        }}
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button 
          variant="outline" 
          onClick={() => reporting.setShowReportDialog(true)}
          disabled={!userId}
        >
          Report Deal
        </Button>
      </div>

      <ReportDialog
        isOpen={reporting.showReportDialog}
        reportReason={reporting.reportReason}
        reportBusy={reporting.reportBusy}
        onReasonChange={reporting.setReportReason}
        onSubmit={reporting.handleReport}
        onClose={() => {
          reporting.setShowReportDialog(false);
          reporting.setReportReason('');
        }}
      />
    </div>
  );
}
