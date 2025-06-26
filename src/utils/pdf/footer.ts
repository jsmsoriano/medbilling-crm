
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const addFooterToAllPages = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
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
};
