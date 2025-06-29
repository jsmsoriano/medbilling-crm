
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import ImportFormFields from './ImportFormFields';
import ImportActionButtons from './ImportActionButtons';

interface ImportDataFormProps {
  onFileImport: (file: File) => Promise<void>;
  uploading: boolean;
}

const ImportDataForm = ({ onFileImport, uploading }: ImportDataFormProps) => {
  const { exportToCSV, loadData, loading } = useSpreadsheetData();
  const { toast } = useToast();
  const [importSource, setImportSource] = useState('');
  const [dataType, setDataType] = useState('');

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

  const canImport = !!(importSource && dataType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImportFormFields
          importSource={importSource}
          dataType={dataType}
          onImportSourceChange={setImportSource}
          onDataTypeChange={setDataType}
        />
        
        <ImportActionButtons
          onImport={handleImport}
          onExport={exportToCSV}
          onRefresh={loadData}
          loading={loading}
          uploading={uploading}
          canImport={canImport}
        />
        
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
