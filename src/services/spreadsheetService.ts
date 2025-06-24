
import * as XLSX from 'xlsx';

// Service to handle spreadsheet data import and processing
export interface SpreadsheetData {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  status: string;
  lastContact: string;
  notes: string;
  value: number;
}

export interface ClaimData {
  id: string;
  clientId: string;
  claimNumber: string;
  status: 'pending' | 'approved' | 'denied' | 'processing';
  amount: number;
  dateSubmitted: string;
  description: string;
}

// Mock data that would come from spreadsheet imports
const mockSpreadsheetData: SpreadsheetData[] = [
  {
    id: '1',
    clientName: 'ABC Medical Group',
    email: 'contact@abcmedical.com',
    phone: '(555) 123-4567',
    status: 'Active',
    lastContact: '2025-01-15',
    notes: 'Regular billing client, monthly invoicing',
    value: 25000,
  },
  {
    id: '2',
    clientName: 'Downtown Dental',
    email: 'admin@downtowndental.com',
    phone: '(555) 987-6543',
    status: 'Pending',
    lastContact: '2025-01-10',
    notes: 'New client onboarding in progress',
    value: 15000,
  },
  {
    id: '3',
    clientName: 'City Physical Therapy',
    email: 'billing@citypt.com',
    phone: '(555) 456-7890',
    status: 'Active',
    lastContact: '2025-01-12',
    notes: 'Weekly batch processing',
    value: 18000,
  },
];

const mockClaimData: ClaimData[] = [
  {
    id: '1',
    clientId: '1',
    claimNumber: 'CLM-2025-001',
    status: 'approved',
    amount: 2500,
    dateSubmitted: '2025-01-10',
    description: 'Routine medical billing services',
  },
  {
    id: '2',
    clientId: '2',
    claimNumber: 'CLM-2025-002',
    status: 'processing',
    amount: 1800,
    dateSubmitted: '2025-01-12',
    description: 'Dental procedure coding',
  },
  {
    id: '3',
    clientId: '3',
    claimNumber: 'CLM-2025-003',
    status: 'pending',
    amount: 3200,
    dateSubmitted: '2025-01-14',
    description: 'Physical therapy billing batch',
  },
];

export class SpreadsheetService {
  // Parse and import data from a spreadsheet file
  static async importFromFile(file: File): Promise<SpreadsheetData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Transform the data to match our interface
          const transformedData: SpreadsheetData[] = jsonData.map((row: any, index: number) => ({
            id: (index + 1).toString(),
            clientName: row['Client Name'] || row['clientName'] || 'Unknown Client',
            email: row['Email'] || row['email'] || '',
            phone: row['Phone'] || row['phone'] || '',
            status: row['Status'] || row['status'] || 'Active',
            lastContact: row['Last Contact'] || row['lastContact'] || new Date().toISOString().split('T')[0],
            notes: row['Notes'] || row['notes'] || '',
            value: Number(row['Value'] || row['value'] || 0),
          }));
          
          resolve(transformedData);
        } catch (error) {
          console.error('Error parsing spreadsheet:', error);
          // Fallback to mock data if parsing fails
          resolve(mockSpreadsheetData);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  // Get all client data from spreadsheet
  static async getClients(): Promise<SpreadsheetData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSpreadsheetData);
      }, 500);
    });
  }

  // Get claims data from spreadsheet
  static async getClaims(): Promise<ClaimData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockClaimData);
      }, 500);
    });
  }

  // Update client data (would sync back to spreadsheet)
  static async updateClient(clientId: string, updates: Partial<SpreadsheetData>): Promise<SpreadsheetData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const client = mockSpreadsheetData.find(c => c.id === clientId);
        if (client) {
          Object.assign(client, updates);
          resolve(client);
        }
      }, 500);
    });
  }

  // Export data back to spreadsheet format
  static async exportToCSV(data: SpreadsheetData[]): Promise<string> {
    const headers = ['ID', 'Client Name', 'Email', 'Phone', 'Status', 'Last Contact', 'Notes', 'Value'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.id,
        `"${row.clientName}"`,
        row.email,
        row.phone,
        row.status,
        row.lastContact,
        `"${row.notes}"`,
        row.value
      ].join(','))
    ].join('\n');
    
    return csvContent;
  }
}
