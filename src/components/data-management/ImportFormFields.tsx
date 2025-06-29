
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImportFormFieldsProps {
  importSource: string;
  dataType: string;
  onImportSourceChange: (value: string) => void;
  onDataTypeChange: (value: string) => void;
}

const ImportFormFields = ({ 
  importSource, 
  dataType, 
  onImportSourceChange, 
  onDataTypeChange 
}: ImportFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Import Source</label>
        <Select value={importSource} onValueChange={onImportSourceChange}>
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
          John Doe
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Data Type</label>
        <Select value={dataType} onValueChange={onDataTypeChange}>
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
  );
};

export default ImportFormFields;
