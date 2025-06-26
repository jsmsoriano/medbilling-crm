
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { colors } from './styles';

export const addHeaderBackground = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, pageWidth, 45, 'F');
};

export const addModernHeader = (doc: jsPDF) => {
  addHeaderBackground(doc);
  
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
};

export const addSectionDivider = (doc: jsPDF, y: number) => {
  const pageWidth = doc.internal.pageSize.width;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);
};

export const addSectionHeader = (doc: jsPDF, title: string, y: number) => {
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(title, 20, y);
  
  addSectionDivider(doc, y + 10);
  return y + 25;
};
