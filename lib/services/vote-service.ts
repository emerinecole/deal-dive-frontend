import { apiClient } from "@/lib/api-client";
import { API } from "@/constants/api";
import { AddVoteInput, RemoveVoteInput, VotesResponse } from "@/lib/types/votes";

export async function addVote(dealId: string, voteData: AddVoteInput): Promise<void> {
  await apiClient.post(API.VOTES.ADD(dealId), voteData);
}

export async function removeVote(dealId: string, voteData: RemoveVoteInput): Promise<void> {
  await apiClient.delete(API.VOTES.REMOVE(dealId), voteData);
}

export async function getVotes(dealId: string): Promise<VotesResponse> {
  const response = await apiClient.get(API.VOTES.GET(dealId));
  return response as VotesResponse;
}

