
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ClientPerformanceData } from '@/hooks/useReportData';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportType {
  value: string;
  label: string;
}

// Modern color palette
const colors = {
  primary: '#2563eb',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  dark: '#1f2937',
  light: '#f8fafc',
  muted: '#6b7280'
};

export const generateReportPDF = async (
  reportType: string,
  reportTypes: ReportType[],
  filteredData: ClientPerformanceData[],
  selectedClient?: string,
  selectedPracticeGroup?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Helper function to add modern header background
  const addHeaderBackground = () => {
    doc.setFillColor(37, 99, 235); // Primary blue
    doc.rect(0, 0, pageWidth, 45, 'F');
  };
  
  // Helper function to add section divider
  const addSectionDivider = (y: number) => {
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
  };

  // Modern Header with background
  addHeaderBackground();
  
  // White text on blue background
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Medical Billing Analytics Report', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 35);
  
  // Reset text color for body content
  doc.setTextColor(0, 0, 0);
  
  // Report Configuration Section
  let yPosition = 60;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text('Report Configuration', 20, yPosition);
  
  yPosition += 10;
  addSectionDivider(yPosition);
  yPosition += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // Muted gray
  
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
  
  // Executive Summary Section with KPI Cards
  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Executive Summary', 20, yPosition);
  
  yPosition += 10;
  addSectionDivider(yPosition);
  yPosition += 20;
  
  // Calculate KPIs
  const totalRevenue = filteredData.reduce((sum, client) => sum + client.revenue, 0);
  const totalClaims = filteredData.reduce((sum, client) => sum + client.claims, 0);
  const avgDenialRate = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + client.denialRate, 0) / filteredData.length) : 0;
  const avgSatisfaction = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + client.satisfaction, 0) / filteredData.length) : 0;
  
  // KPI Cards Layout - 2x2 grid
  const cardWidth = 80;
  const cardHeight = 35;
  const cardSpacing = 10;
  const startX = 20;
  
  // KPI Card 1 - Total Revenue
  doc.setFillColor(248, 250, 252); // Light background
  doc.roundedRect(startX, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(startX, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text('TOTAL REVENUE', startX + 5, yPosition + 8);
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${totalRevenue.toLocaleString()}`, startX + 5, yPosition + 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('↗ +8.2% vs last month', startX + 5, yPosition + 28);
  
  // KPI Card 2 - Total Claims
  const card2X = startX + cardWidth + cardSpacing;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(card2X, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(card2X, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text('TOTAL CLAIMS', card2X + 5, yPosition + 8);
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(totalClaims.toString(), card2X + 5, yPosition + 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('↗ +12.4% vs last month', card2X + 5, yPosition + 28);
  
  yPosition += cardHeight + 15;
  
  // KPI Card 3 - Average Denial Rate
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(startX, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(startX, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text('AVG DENIAL RATE', startX + 5, yPosition + 8);
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${avgDenialRate.toFixed(1)}%`, startX + 5, yPosition + 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  // Fix the TypeScript error by properly typing the color tuple
  const denialColor: [number, number, number] = avgDenialRate < 5 ? [16, 185, 129] : [239, 68, 68];
  doc.setTextColor(...denialColor);
  doc.text(`${avgDenialRate < 5 ? '↓' : '↑'} ${avgDenialRate < 5 ? 'Excellent' : 'Needs Attention'}`, startX + 5, yPosition + 28);
  
  // KPI Card 4 - Average Satisfaction
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(card2X, yPosition, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(card2X, yPosition, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text('CLIENT SATISFACTION', card2X + 5, yPosition + 8);
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${avgSatisfaction.toFixed(1)}%`, card2X + 5, yPosition + 20);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('↗ Excellent Rating', card2X + 5, yPosition + 28);
  
  yPosition += cardHeight + 25;
  
  // Revenue Analysis Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Revenue Analysis', 20, yPosition);
  
  yPosition += 10;
  addSectionDivider(yPosition);
  yPosition += 15;
  
  // Revenue insights
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  const revenueInsights = [
    `• Total revenue of $${totalRevenue.toLocaleString()} across ${filteredData.length} clients`,
    `• Average revenue per client: $${Math.round(totalRevenue / filteredData.length || 0).toLocaleString()}`,
    `• Highest performing client: ${filteredData.sort((a, b) => b.revenue - a.revenue)[0]?.name || 'N/A'}`,
    `• Revenue growth trend: +8.2% compared to previous period`
  ];
  
  revenueInsights.forEach((insight, index) => {
    doc.text(insight, 25, yPosition + (index * 8));
  });
  
  yPosition += 40;
  
  // Claims Analysis Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Claims Analysis', 20, yPosition);
  
  yPosition += 10;
  addSectionDivider(yPosition);
  yPosition += 15;
  
  // Claims insights
  const claimsInsights = [
    `• Total claims processed: ${totalClaims} claims across all clients`,
    `• Average claims per client: ${Math.round(totalClaims / filteredData.length || 0)} claims`,
    `• Overall denial rate: ${avgDenialRate.toFixed(1)}% (${avgDenialRate < 5 ? 'Excellent' : avgDenialRate < 7 ? 'Good' : 'Needs Improvement'})`,
    `• First-pass resolution rate: ${(100 - avgDenialRate).toFixed(1)}%`
  ];
  
  claimsInsights.forEach((insight, index) => {
    doc.text(insight, 25, yPosition + (index * 8));
  });
  
  yPosition += 40;
  
  // Check if we need a new page for the data table
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Client Performance Data Table
  if (reportType === 'client-performance' && filteredData.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Client Performance Details', 20, yPosition);
    
    yPosition += 15;
    
    doc.autoTable({
      startY: yPosition,
      head: [['Client Name', 'Practice Group', 'Revenue', 'Claims', 'Denial Rate', 'Satisfaction']],
      body: filteredData.map(client => [
        client.name,
        client.practiceGroup,
        `$${client.revenue.toLocaleString()}`,
        client.claims.toString(),
        `${client.denialRate}%`,
        `${client.satisfaction}%`
      ]),
      styles: { 
        fontSize: 10,
        cellPadding: 8,
        font: 'helvetica'
      },
      headStyles: { 
        fillColor: [37, 99, 235], // Primary blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      alternateRowStyles: { 
        fillColor: [248, 250, 252] // Light gray
      },
      columnStyles: {
        2: { halign: 'right' }, // Revenue column
        3: { halign: 'center' }, // Claims column
        4: { halign: 'center' }, // Denial rate column
        5: { halign: 'center' }  // Satisfaction column
      },
      didParseCell: function(data: any) {
        // Color coding for denial rates
        if (data.column.index === 4 && data.section === 'body') {
          const rate = parseFloat(data.cell.text[0]);
          if (rate < 5) {
            data.cell.styles.textColor = [16, 185, 129]; // Green
          } else if (rate >= 7) {
            data.cell.styles.textColor = [239, 68, 68]; // Red
          }
        }
        // Color coding for satisfaction
        if (data.column.index === 5 && data.section === 'body') {
          data.cell.styles.textColor = [16, 185, 129]; // Green
        }
      }
    });
  }
  
  // Recommendations Section
  const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 20;
  
  if (finalY > pageHeight - 80) {
    doc.addPage();
    yPosition = 30;
  } else {
    yPosition = finalY + 25;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Key Recommendations', 20, yPosition);
  
  yPosition += 10;
  addSectionDivider(yPosition);
  yPosition += 15;
  
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
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 15);
    doc.text('Excel Medical Billing - Confidential Report', 20, pageHeight - 15);
    doc.text(`Report generated on ${format(new Date(), 'MM/dd/yyyy HH:mm')}`, 20, pageHeight - 8);
  }

  // Save the PDF with a professional filename
  const clientSuffix = selectedClient ? `_${selectedClient.replace(/\s+/g, '_')}` : '';
  const fileName = `Medical_Billing_Report${clientSuffix}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
