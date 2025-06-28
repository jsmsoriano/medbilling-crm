
export interface ReportType {
  value: string;
  label: string;
}

export interface ClientPerformanceData {
  name?: string;
  revenue?: number;
  claims?: number;
  denialRate?: number;
  satisfaction?: number;
  practiceGroup?: string;
  [key: string]: any;
}

export interface KPIData {
  totalRevenue: number;
  totalClaims: number;
  avgDenialRate: number;
  avgSatisfaction: number;
}
