import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Comment } from '@/lib/types/comments';
import { UUID } from 'crypto';

interface CommentSectionProps {
  comments: Comment[];
  comment: string;
  commentsBusy: boolean;
  userId: UUID | null;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  onDeleteComment: (commentId: string) => void;
}

export function CommentSection({
  comments,
  comment,
  commentsBusy,
  userId,
  onCommentChange,
  onAddComment,
  onDeleteComment,
}: CommentSectionProps) {
  return (
    <>
      {/* Comment input */}
      <div className="space-y-2 bg-white p-3 rounded-lg border border-blue-200"> {/* added bg-white, padding, border */}
        <div className="text-xs uppercase text-muted-foreground">Add a comment</div>
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onAddComment();
              }
            }}
            disabled={commentsBusy || !userId}
            className="bg-white"
          />
          <Button
            variant="default"
            onClick={onAddComment}
            disabled={commentsBusy || !userId || !comment.trim()}
            className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
          >
            {commentsBusy ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3 mt-4">
          <div className="text-xs uppercase text-muted-foreground">Comments ({comments.length})</div>
          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-3 space-y-2 bg-white"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm">{c.content}</p>
                  {userId === c.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteComment(c.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString()} at{' '}
                  {new Date(c.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
