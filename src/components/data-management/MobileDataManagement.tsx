
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImportFormFields from './ImportFormFields';
import ImportNotifications, { ImportNotification } from './ImportNotifications';

const MobileDataManagement = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [importSource, setImportSource] = useState('');
  const [dataType, setDataType] = useState('');
  const [notifications, setNotifications] = useState<ImportNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleFileImport = async (file: File) => {
    setUploading(true);
    
    // Simulate upload progress
    const progressNotification: ImportNotification = {
      id: 'upload-' + Date.now(),
      message: `Importing ${file.name}...`,
      type: 'progress',
      progress: 0
    };
    
    setNotifications([progressNotification]);
    setShowNotifications(true);

    // Simulate progress updates
    for (let i = 0; i <= 100; i += 20) {
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(n => 
            n.id === progressNotification.id 
              ? { ...n, progress: i }
              : n
          )
        );
      }, i * 20);
    }

    setTimeout(() => {
      setNotifications(prev => [
        ...prev.filter(n => n.id !== progressNotification.id),
        {
          id: 'success-' + Date.now(),
          message: `Successfully imported ${file.name}`,
          type: 'success'
        }
      ]);
      setUploading(false);
      
      toast({
        title: "Import Successful",
        description: `${file.name} has been imported successfully.`,
      });
    }, 2500);
  };

  const handleImport = () => {
    if (!importSource || !dataType) {
      toast({
        title: "Missing Information",
        description: "Please select both import source and data type",
        variant: "destructive",
      });
      return;
    }

    const fileInput = document.getElementById('mobile-file-input') as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileImport(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-600 text-sm">Import and manage your billing data</p>
      </div>

      <ImportNotifications
        notifications={notifications}
        showNotifications={showNotifications}
        onClose={() => setShowNotifications(false)}
        onRemoveNotification={(id) => 
          setNotifications(prev => prev.filter(n => n.id !== id))
        }
      />

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
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
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleImport}
                  disabled={uploading || !importSource || !dataType}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Importing...' : 'Import Data'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <input
                id="mobile-file-input"
                type="file"
                accept=".csv,.xlsx,.xls,.xml,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Import History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No import history found</p>
                <p className="text-sm">Start by importing your first data file</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileDataManagement;
