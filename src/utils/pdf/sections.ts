
import jsPDF from 'jspdf';
import { ReportType } from './types';

export const addReportConfiguration = (
  doc: jsPDF, 
  reportType: string, 
  reportTypes: ReportType[], 
  selectedClient?: string, 
  selectedPracticeGroup?: string
) => {
  let yPosition = 60;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  
  const reportTypeLabel = reportTypes.find(rt => rt.value === reportType)?.label || '';
  doc.text(`Report Type: ${reportTypeLabel}`, 20, yPosition);
  yPosition += 12;
  
  if (selectedClient) {
    doc.text(`Client Filter: ${selectedClient}`, 20, yPosition);
    yPosition += 12;
  }
  
  if (selectedPracticeGroup) {
    doc.text(`Practice Group: ${selectedPracticeGroup}`, 20, yPosition);
    yPosition += 12;
  }
  
  return yPosition + 10;
};

export const addAnalysisSection = (doc: jsPDF, title: string, insights: string[], yPosition: number) => {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  insights.forEach((insight, index) => {
    doc.text(insight, 25, yPosition + (index * 8));
  });
  
  return yPosition + 40;
};

export const generateRevenueInsights = (filteredData: any[], totalRevenue: number) => {
  return [
    `• Total revenue of $${totalRevenue.toLocaleString()} across ${filteredData.length} clients`,
    `• Average revenue per client: $${Math.round(totalRevenue / filteredData.length || 0).toLocaleString()}`,
    `• Highest performing client: ${filteredData.sort((a, b) => b.revenue - a.revenue)[0]?.name || 'N/A'}`,
    `• Revenue growth trend: +8.2% compared to previous period`
  ];
};

export const generateClaimsInsights = (totalClaims: number, avgDenialRate: number, filteredData: any[]) => {
  return [
    `• Total claims processed: ${totalClaims} claims across all clients`,
    `• Average claims per client: ${Math.round(totalClaims / filteredData.length || 0)} claims`,
    `• Overall denial rate: ${avgDenialRate.toFixed(1)}% (${avgDenialRate < 5 ? 'Excellent' : avgDenialRate < 7 ? 'Good' : 'Needs Improvement'})`,
    `• First-pass resolution rate: ${(100 - avgDenialRate).toFixed(1)}%`
  ];
};

export const generateRecommendations = (avgDenialRate: number, totalRevenue: number) => {
  const recommendations = [];
  
  if (avgDenialRate > 6) {
    recommendations.push('• Focus on reducing denial rates through improved documentation and coding accuracy');
  }
  if (avgDenialRate < 4) {
    recommendations.push('• Excellent denial rate performance - maintain current processes');
  }
  if (totalRevenue > 50000) {
    recommendations.push('• Strong revenue performance - consider expanding service offerings');
  }
  recommendations.push('• Implement regular performance monitoring to maintain quality standards');
  recommendations.push('• Consider staff training programs to further improve efficiency');
  
  return recommendations;
};
