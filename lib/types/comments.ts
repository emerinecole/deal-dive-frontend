import { UUID } from "crypto";

// API response format (snake_case)
export interface Comment {
  id: string;
  deal_id: string;
  user_id: UUID;
  content: string;
  created_at: string;
}

export interface AddCommentInput {
  userId: UUID;
  content: string;
}

export interface DeleteCommentInput {
  userId: UUID;
}

export interface CommentsResponse {
  count: number;
  comments: Comment[];
}

