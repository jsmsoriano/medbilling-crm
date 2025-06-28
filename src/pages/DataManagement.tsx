
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

  const { data: importHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['spreadsheet-imports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spreadsheet_imports')
        .select('*')
        .order('import_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching import history:', error);
        throw error;
      }
      
      return data as ImportRecord[];
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
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
