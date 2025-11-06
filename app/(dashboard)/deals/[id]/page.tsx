'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getDeal } from '@/lib/services/deal-service';
import { addVote, removeVote, getVotes } from '@/lib/services/vote-service';
import { addComment, getComments, deleteComment } from '@/lib/services/comment-service';
import { addReport } from '@/lib/services/report-service';
import { Deal } from '@/lib/types/deals';
import { Comment } from '@/lib/types/comments';
import { VoteType } from '@/lib/types/votes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { UUID } from 'crypto';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteBusy, setVoteBusy] = useState(false);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsBusy, setCommentsBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<UUID | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportBusy, setReportBusy] = useState(false);

  // Read "from" query param (map or list)
  const from = searchParams.get('from') || 'list';

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
          setComments(commentsData);
        } else {
          console.warn('Comments data is not an array:', commentsData);
          setComments([]);
        }
        
        // Determine user's current vote
        if (votesData?.votes && Array.isArray(votesData.votes)) {
          const myVote = votesData.votes.find(v => v.userId === userId);
          if (myVote) {
            setUserVote(myVote.voteType);
          }
        }
      } catch (err) {
        console.error('Failed to load comments/votes:', err);
        // Ensure comments is still an array on error
        setComments([]);
      }
    };
    
    fetchCommentsAndVotes();
  }, [id, userId]);

  const handleBack = () => {
    // Navigate back to home page with the correct tab
    if (from === 'map') router.push('/?tab=map');
    else router.push('/?tab=list');
  };

  const handleVote = async (voteType: VoteType) => {
    if (!deal || !userId) return;
    
    setVoteBusy(true);
    try {
      // If clicking the same vote, remove it
      if (userVote === voteType) {
        await removeVote(String(deal.id), { userId });
        setUserVote(null);
        
        // Update local counts
        if (voteType === 1) {
          setDeal({ ...deal, upvotes: Math.max(0, deal.upvotes - 1) });
        } else {
          setDeal({ ...deal, downvotes: Math.max(0, deal.downvotes - 1) });
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
        
        setDeal({ ...deal, upvotes: newUpvotes, downvotes: newDownvotes });
      }
    } catch (err) {
      console.error('Failed to vote:', err);
      alert('Failed to vote. Please try again.');
    } finally {
      setVoteBusy(false);
    }
  };

  const handleAddComment = async () => {
    if (!deal || !userId || !comment.trim()) return;
    
    setCommentsBusy(true);
    try {
      const newComment = await addComment(String(deal.id), {
        userId,
        content: comment.trim()
      });
      console.log('Comment added successfully:', newComment);
      
      // Ensure comments is an array before spreading
      const currentComments = Array.isArray(comments) ? comments : [];
      setComments([...currentComments, newComment]);
      setComment('');
      setDeal({ ...deal, comment_count: deal.comment_count + 1 });
    } catch (err) {
      console.error('Failed to add comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to add comment: ${errorMessage}`);
    } finally {
      setCommentsBusy(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!deal || !userId) return;
    
    try {
      await deleteComment(String(commentId), { userId });
      
      // Ensure comments is an array before filtering
      const currentComments = Array.isArray(comments) ? comments : [];
      setComments(currentComments.filter(c => c.id !== commentId));
      setDeal({ ...deal, comment_count: Math.max(0, deal.comment_count - 1) });
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleReport = async () => {
    if (!deal || !userId || !reportReason.trim()) return;
    
    setReportBusy(true);
    try {
      await addReport(String(deal.id), {
        userId,
        reason: reportReason.trim()
      });
      setShowReportDialog(false);
      setReportReason('');
      alert('Report submitted successfully.');
    } catch (err) {
      console.error('Failed to report deal:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setReportBusy(false);
    }
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{deal.title}</h1>
          <p className="text-muted-foreground">{deal.address}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">${deal.discounted_price}</div>
          {deal.original_price && (
            <div className="text-sm text-muted-foreground line-through">${deal.original_price}</div>
          )}
          <div className="mt-2">
            <Button
              variant={saved ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSaved((s) => !s)}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{deal.description}</p>

      {/* Votes and comments */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase text-muted-foreground">Votes</div>
          <div className="flex items-center gap-3">
            <Button
              variant={userVote === 1 ? 'default' : 'secondary'}
              size="sm"
              disabled={voteBusy || !userId}
              onClick={() => handleVote(1)}
            >
              👍 {deal.upvotes}
            </Button>

            <Button
              variant={userVote === -1 ? 'default' : 'secondary'}
              size="sm"
              disabled={voteBusy || !userId}
              onClick={() => handleVote(-1)}
            >
              👎 {deal.downvotes}
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">Comments</div>
          <div className="text-sm">{deal.comment_count}</div>
        </div>
      </div>

      {/* Comment input */}
      <div className="space-y-2">
        <div className="text-xs uppercase text-muted-foreground">Add a comment</div>
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            disabled={commentsBusy || !userId}
          />
          <Button
            variant="secondary"
            onClick={handleAddComment}
            disabled={commentsBusy || !userId || !comment.trim()}
          >
            {commentsBusy ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs uppercase text-muted-foreground">Comments ({comments.length})</div>
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="text-sm">{c.content}</p>
                  {userId === c.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowReportDialog(true)}
          disabled={!userId}
        >
          Report Deal
        </Button>
      </div>

      {/* Report dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h2 className="text-xl font-bold">Report Deal</h2>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Reason for reporting:</label>
              <Input
                placeholder="Enter reason..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                disabled={reportBusy}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReportDialog(false);
                  setReportReason('');
                }}
                disabled={reportBusy}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleReport}
                disabled={reportBusy || !reportReason.trim()}
              >
                {reportBusy ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
