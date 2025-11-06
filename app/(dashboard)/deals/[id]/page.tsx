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
  
  // Track counts from individual API calls
  const [commentCount, setCommentCount] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);

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

  // Fetch comments (always load, regardless of auth)
  useEffect(() => {
    if (!id) return;
    
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        
        // Ensure commentsData is an array
        if (Array.isArray(commentsData)) {
          commentsHook.setComments(commentsData);
          setCommentCount(commentsData.length);
        } else {
          throw new Error('Comments data is not an array:' + commentsData);
          commentsHook.setComments([]);
          setCommentCount(0);
        }
      } catch (err) {
        throw new Error('Failed to load comments:' + err);
        commentsHook.setComments([]);
        setCommentCount(0);
      }
    };
    
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch votes (load counts regardless of auth, but user vote requires auth)
  useEffect(() => {
    if (!id) return;
    
    const fetchVotes = async () => {
      try {
        const votesData = await getVotes(id);
        
        // Calculate vote counts from the votes array
        if (votesData?.votes && Array.isArray(votesData.votes)) {
          const upvotes = votesData.votes.filter(v => v.vote_type === 1).length;
          const downvotes = votesData.votes.filter(v => v.vote_type === -1).length;
          setUpvoteCount(upvotes);
          setDownvoteCount(downvotes);
          
          // Determine user's current vote (only if userId is available)
          if (userId) {
            const myVote = votesData.votes.find(v => v.user_id === userId);
            if (myVote) {
              voting.setUserVote(myVote.vote_type);
            }
          }
        }
      } catch (err) {
        throw new Error('Failed to load votes:' + err);
      }
    };
    
    fetchVotes();
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
          upvotes={upvoteCount}
          downvotes={downvoteCount}
          userVote={voting.userVote}
          voteBusy={voting.voteBusy}
          disabled={!userId}
          onVote={(voteType) => {
            voting.handleVote(voteType, upvoteCount, downvoteCount, (upvotes, downvotes) => {
              setUpvoteCount(upvotes);
              setDownvoteCount(downvotes);
            });
          }}
        />
        <div className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">Comments</div>
          <div className="text-sm">{commentCount}</div>
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
            setCommentCount(count);
          });
        }}
        onDeleteComment={(commentId: string) => {
          commentsHook.handleDeleteComment(commentId, (count) => {
            setCommentCount(count);
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
