import { apiClient } from "@/lib/api-client";
import { API } from "@/constants/api";
import { AddCommentInput, Comment, DeleteCommentInput } from "@/lib/types/comments";

export async function addComment(dealId: string, commentData: AddCommentInput): Promise<Comment> {
  const response = await apiClient.post(API.COMMENTS.ADD(dealId), commentData);
  return response as Comment;
}

export async function getComments(dealId: string): Promise<Comment[]> {
  const response = await apiClient.get(API.COMMENTS.LIST(dealId));
  return response as Comment[];
}

export async function deleteComment(commentId: string, deleteData: DeleteCommentInput): Promise<void> {
  await apiClient.delete(API.COMMENTS.DELETE(commentId), deleteData);
}

