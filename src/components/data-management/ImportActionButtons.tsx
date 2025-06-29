
import { Button } from '@/components/ui/button';
import { Upload, Download, RefreshCw } from 'lucide-react';

interface ImportActionButtonsProps {
  onImport: () => void;
  onExport: () => void;
  onRefresh: () => void;
  loading: boolean;
  uploading: boolean;
  canImport: boolean;
}

const ImportActionButtons = ({ 
  onImport, 
  onExport, 
  onRefresh, 
  loading, 
  uploading, 
  canImport 
}: ImportActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4 pt-2">
      <Button
        onClick={onImport}
        disabled={loading || uploading || !canImport}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? 'Importing...' : 'Import Data'}
      </Button>
      
      <Button 
        onClick={onExport} 
        disabled={loading} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export to CSV
      </Button>
      
      <Button 
        onClick={onRefresh} 
        disabled={loading} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh Data
      </Button>
    </div>
  );
};

export default ImportActionButtons;
