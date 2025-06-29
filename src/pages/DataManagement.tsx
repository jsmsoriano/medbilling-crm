
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import { useQuery } from '@tanstack/react-query';
import { useImportNotifications } from '@/hooks/useImportNotifications';
import ImportDataForm from '@/components/data-management/ImportDataForm';
import ImportNotifications from '@/components/data-management/ImportNotifications';
import ImportHistoryTable from '@/components/data-management/ImportHistoryTable';

interface ImportRecord {
  id: string;
  filename: string;
  import_date: string;
  status: string;
  records_imported: number;
  imported_by_username: string;
  file_size?: number;
  notes?: string;
}

// Sample import history data
const sampleImportHistory: ImportRecord[] = [
  {
    id: '1',
    filename: 'patient_data_q1_2024.csv',
    import_date: '2024-01-15T10:30:00Z',
    status: 'completed',
    records_imported: 1247,
    imported_by_username: 'John Doe',
    file_size: 245760,
    notes: 'Q1 patient demographics and insurance data'
  },
  {
    id: '2',
    filename: 'claims_export_december.xlsx',
    import_date: '2024-01-10T14:22:00Z',
    status: 'completed',
    records_imported: 892,
    imported_by_username: 'Sarah Johnson',
    file_size: 512000,
    notes: 'December claims processing batch'
  },
  {
    id: '3',
    filename: 'provider_credentials.xml',
    import_date: '2024-01-08T09:15:00Z',
    status: 'failed',
    records_imported: 0,
    imported_by_username: 'Mike Wilson',
    file_size: 89600,
    notes: 'Import failed due to invalid XML format'
  },
  {
    id: '4',
    filename: 'billing_codes_update.json',
    import_date: '2024-01-05T16:45:00Z',
    status: 'completed',
    records_imported: 156,
    imported_by_username: 'Emily Davis',
    file_size: 34560,
    notes: 'Updated CPT codes for 2024'
  },
  {
    id: '5',
    filename: 'insurance_verification.csv',
    import_date: '2024-01-03T11:20:00Z',
    status: 'completed',
    records_imported: 2341,
    imported_by_username: 'Robert Chen',
    file_size: 487680,
    notes: 'Monthly insurance eligibility verification'
  },
  {
    id: '6',
    filename: 'lab_results_batch_1.xlsx',
    import_date: '2023-12-28T13:30:00Z',
    status: 'processing',
    records_imported: 0,
    imported_by_username: 'Lisa Thompson',
    file_size: 1024000,
    notes: 'Large batch processing in progress'
  }
];

const DataManagement = () => {
  const { importFromFile } = useSpreadsheetData();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const {
    notifications,
    showNotifications,
    addNotification,
    updateNotification,
    removeNotification,
    closeNotifications,
  } = useImportNotifications();

  // Mock user credentials - in real app, get from auth context
  const currentUser = 'John Doe';

  // Use sample data instead of fetching from database for now
  const { data: importHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['spreadsheet-imports'],
    queryFn: async () => {
      // Return sample data directly
      return sampleImportHistory;
    },
  });

  const handleFileImport = async (file: File) => {
    setUploading(true);
    
    // Add progress notification
    const notificationId = addNotification('Import in progress...', 'progress', 0);
    
    try {
      // Simulate progress updates
      for (let i = 10; i <= 90; i += 20) {
        setTimeout(() => {
          updateNotification(notificationId, `Importing data... ${i}%`, 'progress', i);
        }, (i / 90) * 2000);
      }
      
      // Import the file using existing hook
      await importFromFile(file);
      
      // Complete progress
      updateNotification(notificationId, 'Import completed successfully!', 'success', 100);
      
      // Record the import in the database
      const { error } = await supabase
        .from('spreadsheet_imports')
        .insert({
          filename: file.name,
          status: 'completed',
          records_imported: Math.floor(Math.random() * 100) + 10, // Mock count
          imported_by_username: currentUser,
          file_size: file.size,
          notes: `Imported from external system`
        });
      
      if (error) {
        console.error('Error recording import:', error);
      } else {
        refetchHistory();
      }
      
    } catch (error) {
      console.error('Import error:', error);
      updateNotification(notificationId, 'Import failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600 mt-2">Import, export, and manage your data from external systems</p>
        </div>
      </div>

      <ImportDataForm 
        onFileImport={handleFileImport}
        uploading={uploading}
      />

      <ImportNotifications
        notifications={notifications}
        showNotifications={showNotifications}
        onClose={closeNotifications}
        onRemoveNotification={removeNotification}
      />

      <ImportHistoryTable importHistory={importHistory} />
    </div>
  );
};

export default DataManagement;
