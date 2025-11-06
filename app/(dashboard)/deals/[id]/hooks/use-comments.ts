import { useState } from 'react';
import { addComment, deleteComment } from '@/lib/services/comment-service';
import { Comment } from '@/lib/types/comments';
import { UUID } from 'crypto';

export function useComments(dealId: string | undefined, userId: UUID | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [commentsBusy, setCommentsBusy] = useState(false);

  const handleAddComment = async (onUpdate: (count: number) => void) => {
    if (!dealId || !userId || !comment.trim()) return;
    
    setCommentsBusy(true);
    try {
      const newComment = await addComment(dealId, {
        userId,
        content: comment.trim()
      });
      console.log('Comment added successfully:', newComment);
      
      // Ensure comments is an array before spreading
      const currentComments = Array.isArray(comments) ? comments : [];
      setComments([...currentComments, newComment]);
      setComment('');
      onUpdate(currentComments.length + 1);
    } catch (err) {
      console.error('Failed to add comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to add comment: ${errorMessage}`);
    } finally {
      setCommentsBusy(false);
    }
  };

  const handleDeleteComment = async (commentId: number, onUpdate: (count: number) => void) => {
    if (!userId) return;
    
    try {
      await deleteComment(String(commentId), { userId });
      
      // Ensure comments is an array before filtering
      const currentComments = Array.isArray(comments) ? comments : [];
      const newComments = currentComments.filter(c => c.id !== commentId);
      setComments(newComments);
      onUpdate(Math.max(0, newComments.length));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  return {
    comments,
    setComments,
    comment,
    setComment,
    commentsBusy,
    handleAddComment,
    handleDeleteComment,
  };
}

