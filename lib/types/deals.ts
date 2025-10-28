export interface Deal {
  id: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  original_price?: number;
  title: string;
  discounted_price: number;
  created_by: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  geom: null | {
    lat: number;
    lng: number;
  };
  address: string;
}

export interface CreateDealInput {
  title: string;
  description: string;
  discounted_price: number;
  original_price?: number;
  address: string;
  created_by?: number;
  geom: null | {
    lat: number;
    lng: number;
  };
}

export interface UpdateDealInput {
  title?: string;
  description?: string;
  disounted_price?: number;
  original_price?: number;
  address?: string;
  upvotes?: number;
  downvotes?: number;
  comment_count?: number;
  geom?: {
    lat: number;
    lng: number;
  };
}

export interface DealListParams {
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  search?: string;
  createdBy?: number;
}
