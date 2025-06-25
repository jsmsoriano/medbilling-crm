
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, RefreshCw, FileText, Calendar, User, Hash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';

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

const SpreadsheetManagement = () => {
  const { importFromFile, exportToCSV, loadData, loading } = useSpreadsheetData();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

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
    try {
      // Import the file using existing hook
      await importFromFile(file);
      
      // Record the import in the database
      const { error } = await supabase
        .from('spreadsheet_imports')
        .insert({
          filename: file.name,
          status: 'completed',
          records_imported: 0, // This would be updated based on actual import results
          imported_by_username: 'Current User', // This would come from auth context
          file_size: file.size,
          notes: `Imported ${file.name} successfully`
        });
      
      if (error) {
        console.error('Error recording import:', error);
        toast({
          title: "Import recorded with warning",
          description: "File imported but history recording failed",
          variant: "destructive",
        });
      } else {
        // Refetch import history
        refetchHistory();
        toast({
          title: "Import successful",
          description: "File imported and recorded in history",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Could not import the selected file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileImport(file);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spreadsheet Management</h1>
          <p className="text-gray-600 mt-2">Import, export, and manage your spreadsheet data</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={loading || uploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Importing...' : 'Import Spreadsheet'}
            </Button>
            
            <Button 
              onClick={exportToCSV} 
              disabled={loading} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
            
            <Button 
              onClick={loadData} 
              disabled={loading} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <p className="text-sm text-gray-600">
            Import client data from CSV or Excel files. Supported formats: .csv, .xlsx, .xls
          </p>
        </CardContent>
      </Card>

      {/* Import History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {importHistory && importHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Filename
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Import Date
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Records
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Imported By
                    </div>
                  </TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.filename}</TableCell>
                    <TableCell>{formatDate(record.import_date)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : record.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell>{record.records_imported}</TableCell>
                    <TableCell>{record.imported_by_username}</TableCell>
                    <TableCell>{formatFileSize(record.file_size)}</TableCell>
                    <TableCell>{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No import history found</p>
              <p className="text-sm">Start by importing your first spreadsheet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpreadsheetManagement;
