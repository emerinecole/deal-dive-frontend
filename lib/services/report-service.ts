import { apiClient } from "@/lib/api-client";
import { API } from "@/constants/api";
import { AddReportInput, Report, DeleteReportInput } from "@/lib/types/reports";

export async function addReport(dealId: string, reportData: AddReportInput): Promise<Report> {
  const response = await apiClient.post(API.REPORTS.ADD(dealId), reportData);
  return response as Report;
}

export async function getReports(dealId: string): Promise<Report[]> {
  const response = await apiClient.get(API.REPORTS.LIST(dealId));
  return response as Report[];
}

export async function deleteReport(reportId: string, deleteData: DeleteReportInput): Promise<void> {
  await apiClient.delete(API.REPORTS.DELETE(reportId), deleteData);
}

