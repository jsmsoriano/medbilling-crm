
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, RefreshCw, FileText, Calendar, User, Hash, AlertCircle, CheckCircle, X } from 'lucide-react';
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

interface ImportNotification {
  id: string;
  message: string;
  type: 'progress' | 'success' | 'error';
  progress?: number;
}

const DataManagement = () => {
  const { importFromFile, exportToCSV, loadData, loading } = useSpreadsheetData();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [importSource, setImportSource] = useState('');
  const [dataType, setDataType] = useState('');
  const [notifications, setNotifications] = useState<ImportNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const addNotification = (message: string, type: 'progress' | 'success' | 'error', progress?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, message, type, progress };
    setNotifications(prev => [notification, ...prev]);
    setShowNotifications(true);
    
    // Auto-remove success/error notifications after 5 seconds
    if (type !== 'progress') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }
    
    return id;
  };

  const updateNotification = (id: string, message: string, type: 'progress' | 'success' | 'error', progress?: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, message, type, progress } : n));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleImport = async () => {
    if (!importSource || !dataType) {
      toast({
        title: "Missing Information",
        description: "Please select both import source and data type",
        variant: "destructive",
      });
      return;
    }

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  };

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
          notes: `Imported from ${importSource} as ${dataType}`
        });
      
      if (error) {
        console.error('Error recording import:', error);
      } else {
        refetchHistory();
      }
      
      // Reset form
      setImportSource('');
      setDataType('');
      
    } catch (error) {
      console.error('Import error:', error);
      updateNotification(notificationId, 'Import failed. Please try again.', 'error');
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

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
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

      {/* Import Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Import Source</label>
              <Select value={importSource} onValueChange={setImportSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="epic">Epic EMR</SelectItem>
                  <SelectItem value="cerner">Cerner</SelectItem>
                  <SelectItem value="athenahealth">athenahealth</SelectItem>
                  <SelectItem value="allscripts">Allscripts</SelectItem>
                  <SelectItem value="nextgen">NextGen</SelectItem>
                  <SelectItem value="practice-fusion">Practice Fusion</SelectItem>
                  <SelectItem value="manual">Manual Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Imported By</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm text-gray-600">
                {currentUser}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Data Type</label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="xls">Excel (.xls)</SelectItem>
                  <SelectItem value="xml">XML (.xml)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={handleImport}
              disabled={loading || uploading || !importSource || !dataType}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Importing...' : 'Import Data'}
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
            accept=".csv,.xlsx,.xls,.xml,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Notifications Window */}
      {showNotifications && notifications.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Import Notifications
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {notification.type === 'progress' && <AlertCircle className="h-4 w-4 text-blue-600" />}
                    {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    <span className="text-sm">{notification.message}</span>
                  </div>
                  {notification.type !== 'progress' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {notification.type === 'progress' && typeof notification.progress === 'number' && (
                  <Progress value={notification.progress} className="h-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
                      <Calendar className="h-4 w-4" />
                      Import Date
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Imported By
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Report Name
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Records
                    </div>
                  </TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.import_date)}</TableCell>
                    <TableCell>{record.imported_by_username}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(record.filename)}
                        <span className="font-medium">{record.filename}</span>
                      </div>
                    </TableCell>
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
                    <TableCell>{formatFileSize(record.file_size)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        {getFileIcon(record.filename)}
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No import history found</p>
              <p className="text-sm">Start by importing your first data file</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement;
