import { UUID } from "crypto";

export interface Comment {
  id: number;
  dealId: number;
  userId: UUID;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCommentInput {
  userId: UUID;
  content: string;
}

export interface DeleteCommentInput {
  userId: UUID;
}

