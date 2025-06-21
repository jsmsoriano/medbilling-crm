
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
  // Simulate importing data from a spreadsheet file
  static async importFromFile(file: File): Promise<SpreadsheetData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would parse CSV/Excel files
        resolve(mockSpreadsheetData);
      }, 1000);
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
