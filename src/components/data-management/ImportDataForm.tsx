
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';

interface ImportDataFormProps {
  onFileImport: (file: File) => Promise<void>;
  uploading: boolean;
}

const ImportDataForm = ({ onFileImport, uploading }: ImportDataFormProps) => {
  const { exportToCSV, loadData, loading } = useSpreadsheetData();
  const { toast } = useToast();
  const [importSource, setImportSource] = useState('');
  const [dataType, setDataType] = useState('');

  // Mock user credentials - in real app, get from auth context
  const currentUser = 'John Doe';

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileImport(file);
    }
  };

  return (
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
  );
};

export default ImportDataForm;
