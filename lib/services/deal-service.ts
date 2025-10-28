import { apiClient } from "@/lib/api-client";
import { API } from "@/constants/api";
import { CreateDealInput, Deal, UpdateDealInput } from "@/lib/types/deals";


export async function getDeals(): Promise<Deal[]> {
  const response = await apiClient.get(API.DEALS.LIST);
  return response as Deal[];
}


export async function getDeal(id: string): Promise<Deal> {
  const response = await apiClient.get(API.DEALS.GET(id));
  return response as Deal;
}


export async function createDeal(dealData: CreateDealInput): Promise<Deal> {
  const response = await apiClient.post(API.DEALS.CREATE, dealData);
  return response as Deal;
}


export async function updateDeal(id: string, dealData: UpdateDealInput): Promise<Deal> {
  const response = await apiClient.put(API.DEALS.UPDATE(id), dealData);
  return response as Deal;
}


export async function deleteDeal(id: string): Promise<void> {
  await apiClient.delete(API.DEALS.DELETE(id));
}


