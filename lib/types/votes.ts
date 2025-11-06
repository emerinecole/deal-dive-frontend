import { UUID } from "crypto";

// Backend expects: 1 for upvote, -1 for downvote (or 0)
export type VoteType = 1 | -1;

export interface Vote {
  id: number;
  dealId: number;
  userId: UUID;
  voteType: VoteType;
  createdAt: string;
}

export interface AddVoteInput {
  userId: UUID;
  vote_type: VoteType;
}

export interface RemoveVoteInput {
  userId: UUID;
}

export interface VotesResponse {
  upvotes: number;
  downvotes: number;
  votes: Vote[];
}

