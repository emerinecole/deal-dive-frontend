import { apiClient } from "@/lib/api-client";
import { API } from "@/constants/api";
import { CreateDealInput, Deal, DealListParams, UpdateDealInput } from "@/lib/types/deals";


export async function getDeals(params?: DealListParams): Promise<Deal[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.lat !== undefined) searchParams.append("lat", params.lat.toString());
  if (params?.lng !== undefined) searchParams.append("lng", params.lng.toString());
  if (params?.radius !== undefined) searchParams.append("radius", params.radius.toString());
  if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString());
  if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.createdBy) searchParams.append("createdBy", params.createdBy);
  
  const response = await apiClient.get(API.DEALS.LIST, searchParams);
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


