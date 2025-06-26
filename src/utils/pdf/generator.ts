
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ReportType, ClientPerformanceData } from './types';
import { addModernHeader, addSectionHeader } from './header';
import { calculateKPIs, addKPICards } from './kpi';
import { 
  addReportConfiguration, 
  addAnalysisSection, 
  generateRevenueInsights, 
  generateClaimsInsights, 
  generateRecommendations 
} from './sections';
import { addClientPerformanceTable } from './table';
import { addFooterToAllPages } from './footer';

export const generateReportPDF = async (
  reportType: string,
  reportTypes: ReportType[],
  filteredData: ClientPerformanceData[],
  selectedClient?: string,
  selectedPracticeGroup?: string
) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  
  // Modern Header with background
  addModernHeader(doc);
  
  // Report Configuration Section
  let yPosition = addSectionHeader(doc, 'Report Configuration', 60);
  yPosition = addReportConfiguration(doc, reportType, reportTypes, selectedClient, selectedPracticeGroup);
  
  // Executive Summary Section with KPI Cards
  yPosition = addSectionHeader(doc, 'Executive Summary', yPosition);
  
  // Calculate and add KPIs
  const kpis = calculateKPIs(filteredData);
  yPosition = addKPICards(doc, kpis, yPosition);
  
  // Revenue Analysis Section
  yPosition = addSectionHeader(doc, 'Revenue Analysis', yPosition);
  const revenueInsights = generateRevenueInsights(filteredData, kpis.totalRevenue);
  yPosition = addAnalysisSection(doc, 'Revenue Analysis', revenueInsights, yPosition);
  
  // Claims Analysis Section
  yPosition = addSectionHeader(doc, 'Claims Analysis', yPosition);
  const claimsInsights = generateClaimsInsights(kpis.totalClaims, kpis.avgDenialRate, filteredData);
  yPosition = addAnalysisSection(doc, 'Claims Analysis', claimsInsights, yPosition);
  
  // Check if we need a new page for the data table
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Client Performance Data Table
  if (reportType === 'client-performance' && filteredData.length > 0) {
    yPosition = addSectionHeader(doc, 'Client Performance Details', yPosition);
    addClientPerformanceTable(doc, filteredData, yPosition);
  }
  
  // Recommendations Section
  const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 20;
  
  if (finalY > pageHeight - 80) {
    doc.addPage();
    yPosition = 30;
  } else {
    yPosition = finalY + 25;
  }
  
  yPosition = addSectionHeader(doc, 'Key Recommendations', yPosition);
  const recommendations = generateRecommendations(kpis.avgDenialRate, kpis.totalRevenue);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  recommendations.forEach((rec, index) => {
    if (yPosition + (index * 8) > pageHeight - 30) {
      doc.addPage();
      yPosition = 30;
    }
    doc.text(rec, 25, yPosition + (index * 8));
  });
  
  // Footer on each page
  addFooterToAllPages(doc);

  // Save the PDF with a professional filename
  const clientSuffix = selectedClient ? `_${selectedClient.replace(/\s+/g, '_')}` : '';
  const fileName = `Medical_Billing_Report${clientSuffix}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
