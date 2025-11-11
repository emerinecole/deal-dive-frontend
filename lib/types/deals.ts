import { UUID } from "crypto";

export interface Deal {
  id: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  original_price?: number;
  title: string;
  discounted_price: number;
  created_by: UUID;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  latitude: number;
  longitude: number;
  address: string;
}

export interface CreateDealInput {
  title: string;
  description: string;
  discounted_price: number;
  original_price?: number;
  address: string;
  created_by?: UUID;
  latitude: number;
  longitude: number;
}

export interface UpdateDealInput {
  title?: string;
  description?: string;
  discounted_price?: number;
  original_price?: number;
  address?: string;
  upvotes?: number;
  downvotes?: number;
  comment_count?: number;
  latitude?: number;
  longitude?: number;
}

export interface DealListParams {
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  search?: string;
  createdBy?: UUID;
}
