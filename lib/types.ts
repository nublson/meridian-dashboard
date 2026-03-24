/** Date range presets shared by API and UI */
export type DateRangePreset =
  | "7d"
  | "30d"
  | "3m"
  | "6m"
  | "ytd";

export type DealStage =
  | "Negotiation"
  | "Proposal Sent"
  | "Qualified"
  | "Discovery";

export interface DealOwner {
  name: string;
  initials: string;
}

export interface Deal {
  id: string;
  dealName: string;
  client: string;
  stage: DealStage;
  value: number;
  owner: DealOwner;
  expectedClose: string; // ISO date
  dealInitials: string;
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: number;
  /** Display suffix e.g. "%" for conversion */
  suffix?: string;
  /** Raw currency value when value is formatted differently */
  displayValue?: string;
  changePercent: number;
  changeAbsolute: number;
  /** Positive = up (good for revenue), negative = down */
  direction: "up" | "down";
}

export interface MetricsResponse {
  metrics: MetricCard[];
  updatedAt: string;
}

export interface LeadSourceSlice {
  source: string;
  count: number;
}

export interface LeadSourcesResponse {
  slices: LeadSourceSlice[];
  totalLeads: number;
}

export interface RevenueMonth {
  month: string;
  thisYear: number;
  prevYear: number;
}

export interface RevenueResponse {
  months: RevenueMonth[];
  totalRevenue: number;
  bestMonth: string;
  bestMonthAmount: number;
}

export type ExportFormat = "csv" | "json";
