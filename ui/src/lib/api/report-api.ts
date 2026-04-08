import axios from "axios";
import { getProjectRARAPI } from "./generated/client";
import type {
  BaseConfigurationResponse,
  ComparisonReportRequest,
  MainReportRequest,
  ReportResponse,
  StagesResponse,
  ToolsResponse,
} from "./generated/model";

const api = getProjectRARAPI();

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim().length > 0) {
      return detail;
    }
    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "Something went wrong while calling the API.";
}

export async function fetchBaseConfig(): Promise<BaseConfigurationResponse> {
  return api.getBaseConfigurationApiV1BaseConfigGet();
}

export async function fetchStages(sector: string): Promise<StagesResponse> {
  return api.getStagesApiV1StagesGet({ sector });
}

export async function fetchTools(sector: string, stage: string): Promise<ToolsResponse> {
  return api.getToolsApiV1ToolsGet({ sector, stage });
}

export async function generateMainReport(payload: MainReportRequest): Promise<ReportResponse> {
  return api.createMainReportApiV1GenerateReportPost(payload);
}

export async function generateComparisonReport(
  payload: ComparisonReportRequest,
): Promise<ReportResponse> {
  return api.createComparisonReportApiV1CompareToolsPost(payload);
}
