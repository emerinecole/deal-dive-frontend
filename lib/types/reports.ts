import { UUID } from "crypto";

export interface Report {
  id: number;
  dealId: number;
  userId: UUID;
  reason: string;
  createdAt: string;
}

export interface AddReportInput {
  userId: UUID;
  reason: string;
}

export interface DeleteReportInput {
  userId: UUID;
}

