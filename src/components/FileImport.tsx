
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, RefreshCw } from 'lucide-react';

interface FileImportProps {
  onFileImport: (file: File) => void;
  onExport: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const FileImport = ({ onFileImport, onExport, onRefresh, loading }: FileImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          Spreadsheet Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Spreadsheet
          </Button>
          
          <Button onClick={onExport} disabled={loading} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
          
          <Button onClick={onRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
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
  );
};

export default FileImport;
