import { apiClient } from "@/lib/api-client";
import { API } from "@/constants/api";
import { Deal } from "@/lib/types/deals";

export async function saveDeal(dealId: string): Promise<void> {
  await apiClient.post(API.SAVED_DEALS.SAVE(dealId));
}

export async function unsaveDeal(dealId: string): Promise<void> {
  await apiClient.delete(API.SAVED_DEALS.UNSAVE(dealId));
}

export async function getSavedDeals(): Promise<Deal[]> {
  
  
  const response = await apiClient.get(API.SAVED_DEALS.LIST);
  return response as Deal[];
}

