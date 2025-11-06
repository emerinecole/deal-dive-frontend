import { UUID } from "crypto";

// Backend expects: 1 for upvote, -1 for downvote (or 0)
export type VoteType = 1 | -1;

// API response format (snake_case)
export interface Vote {
  id: string;
  deal_id: string;
  user_id: UUID;
  vote_type: VoteType;
  created_at: string;
}

export interface AddVoteInput {
  userId: UUID;
  vote_type: VoteType;
}

export interface RemoveVoteInput {
  userId: UUID;
}

export interface VotesResponse {
  count: number;
  votes: Vote[];
}

