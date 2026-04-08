import type { ReportResponseTokenUsage } from "./api/generated/model";

export type WeightMap = Record<string, number>;

export interface ReportSession {
  id: string;
  sector: string;
  stage: string;
  tool: string;
  persona: string;
  featureCategory: string;
  weightMode: "static";
  weights: WeightMap;
  reportMarkdown: string;
  tokenUsage?: ReportResponseTokenUsage;
  comparisonTool?: string;
  comparisonMarkdown?: string;
  comparisonTokenUsage?: ReportResponseTokenUsage;
  createdAt: string;
}

const reportCache = new Map<string, ReportSession>();

export function saveReportSession(report: ReportSession): void {
  reportCache.set(report.id, report);
}

export function getReportSession(id: string): ReportSession | undefined {
  return reportCache.get(id);
}

export function updateReportSession(
  id: string,
  partial: Partial<ReportSession>,
): ReportSession | undefined {
  const existing = reportCache.get(id);
  if (!existing) {
    return undefined;
  }
  const updated = { ...existing, ...partial };
  reportCache.set(id, updated);
  return updated;
}
