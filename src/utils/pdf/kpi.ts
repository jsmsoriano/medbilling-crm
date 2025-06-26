
import jsPDF from 'jspdf';
import { KPIData } from './types';
import { cardStyles } from './styles';

export const calculateKPIs = (filteredData: any[]): KPIData => {
  const totalRevenue = filteredData.reduce((sum, client) => sum + client.revenue, 0);
  const totalClaims = filteredData.reduce((sum, client) => sum + client.claims, 0);
  const avgDenialRate = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + client.denialRate, 0) / filteredData.length) : 0;
  const avgSatisfaction = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + client.satisfaction, 0) / filteredData.length) : 0;
  
  return { totalRevenue, totalClaims, avgDenialRate, avgSatisfaction };
};

const drawKPICard = (doc: jsPDF, x: number, y: number, title: string, value: string, trend: string) => {
  const { width, height, borderRadius } = cardStyles;
  
  // Card background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'S');
  
  // Title
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.text(title, x + 5, y + 8);
  
  // Value
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(value, x + 5, y + 20);
  
  // Trend
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text(trend, x + 5, y + 28);
};

export const addKPICards = (doc: jsPDF, kpis: KPIData, yPosition: number) => {
  const { width, spacing, startX } = cardStyles;
  const card2X = startX + width + spacing;
  
  // KPI Card 1 - Total Revenue
  drawKPICard(
    doc, 
    startX, 
    yPosition, 
    'TOTAL REVENUE', 
    `$${kpis.totalRevenue.toLocaleString()}`, 
    '↗ +8.2% vs last month'
  );
  
  // KPI Card 2 - Total Claims
  drawKPICard(
    doc, 
    card2X, 
    yPosition, 
    'TOTAL CLAIMS', 
    kpis.totalClaims.toString(), 
    '↗ +12.4% vs last month'
  );
  
  const nextRowY = yPosition + cardStyles.height + 15;
  
  // KPI Card 3 - Average Denial Rate
  drawKPICard(
    doc, 
    startX, 
    nextRowY, 
    'AVG DENIAL RATE', 
    `${kpis.avgDenialRate.toFixed(1)}%`, 
    `${kpis.avgDenialRate < 5 ? '↓ Excellent' : '↑ Needs Attention'}`
  );
  
  // KPI Card 4 - Average Satisfaction
  drawKPICard(
    doc, 
    card2X, 
    nextRowY, 
    'CLIENT SATISFACTION', 
    `${kpis.avgSatisfaction.toFixed(1)}%`, 
    '↗ Excellent Rating'
  );
  
  return nextRowY + cardStyles.height + 25;
};
