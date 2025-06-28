
import { useMemo } from 'react';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';

export interface ClientPerformanceData {
  name?: string;
  revenue?: number;
  claims?: number;
  denialRate?: number;
  satisfaction?: number;
  practiceGroup?: string;
  [key: string]: any;
}

export const useReportData = () => {
  const { clients, claims, loading } = useSpreadsheetData();

  // Mock data for demo - replace with real data processing
  const mockClientPerformance: ClientPerformanceData[] = [
    { name: 'Metro Medical', revenue: 15420, claims: 45, denialRate: 3.2, satisfaction: 98, practiceGroup: 'Primary Care' },
    { name: 'Sunrise Family', revenue: 12340, claims: 38, denialRate: 4.1, satisfaction: 95, practiceGroup: 'Family Medicine' },
    { name: 'Downtown Cardio', revenue: 9850, claims: 29, denialRate: 6.8, satisfaction: 92, practiceGroup: 'Cardiology' },
    { name: 'Pediatric Assoc', revenue: 8720, claims: 31, denialRate: 2.9, satisfaction: 99, practiceGroup: 'Pediatrics' },
  ];

  const availableClients = useMemo(() => 
    Array.from(new Set([...clients.map(c => c.clientName), ...mockClientPerformance.map(c => c.name)])),
    [clients, mockClientPerformance]
  );

  const availablePracticeGroups = useMemo(() => 
    Array.from(new Set(mockClientPerformance.map(c => c.practiceGroup))),
    [mockClientPerformance]
  );

  const getFilteredData = (selectedClient: string, selectedPracticeGroup: string) => {
    let data = mockClientPerformance;
    
    if (selectedClient) {
      data = data.filter(item => item.name === selectedClient);
    }
    
    if (selectedPracticeGroup) {
      data = data.filter(item => item.practiceGroup === selectedPracticeGroup);
    }
    
    return data;
  };

  const getReportData = (reportType: string): ClientPerformanceData[] => {
    // Return mock data based on report type
    switch (reportType) {
      case 'ar-aging':
      case 'payment-collection-trend':
      case 'insurance-carrier-analysis':
      case 'payment-collections':
      case 'clearing-house-rejections':
      case 'payer-reimbursement-metrics':
      case 'denials-report':
      case 'cpt-analysis-revenue':
      case 'claims-submitted':
        return mockClientPerformance; // Using same mock data for all report types for demo
      default:
        return mockClientPerformance;
    }
  };

  return {
    clients,
    claims,
    loading,
    mockClientPerformance,
    availableClients,
    availablePracticeGroups,
    getFilteredData,
    getReportData
  };
};
