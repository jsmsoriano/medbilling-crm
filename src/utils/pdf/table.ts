
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClientPerformanceData } from './types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const addClientPerformanceTable = (doc: jsPDF, filteredData: ClientPerformanceData[], yPosition: number) => {
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
};
