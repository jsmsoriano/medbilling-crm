import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Database, 
  Plus, 
  Edit2, 
  Trash2, 
  TestTube,
  Server,
  FileSpreadsheet,
  Globe,
  HardDrive,
  Upload
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  source_type: string;
  configuration: any;
  is_active: boolean;
  created_at: string;
}

const sourceTypeIcons = {
  ftp: Server,
  google_sheets: FileSpreadsheet,
  api: Globe,
  database: Database,
  csv_upload: Upload
};

const sourceTypeLabels = {
  ftp: 'FTP Server',
  google_sheets: 'Google Sheets',
  api: 'REST API',
  database: 'Database',
  csv_upload: 'CSV Upload'
};

const DataSourceConfiguration = () => {
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    source_type: '',
    configuration: {} as any,
    is_active: true
  });

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDataSources(data || []);
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast({
        title: "Error",
        description: "Failed to load data sources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      name: '',
      source_type: '',
      configuration: {},
      is_active: true
    });
    setEditingSource(null);
    setIsCreating(true);
  };

  const handleEdit = (source: DataSource) => {
    setFormData({
      name: source.name,
      source_type: source.source_type,
      configuration: source.configuration,
      is_active: source.is_active
    });
    setEditingSource(source);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('data_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDataSources(prev => prev.filter(source => source.id !== id));
      toast({
        title: "Success",
        description: "Data source deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting data source:', error);
      toast({
        title: "Error",
        description: "Failed to delete data source",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.source_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSource) {
        const { error } = await supabase
          .from('data_sources')
          .update({
            name: formData.name,
            source_type: formData.source_type,
            configuration: formData.configuration,
            is_active: formData.is_active
          })
          .eq('id', editingSource.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('data_sources')
          .insert({
            name: formData.name,
            source_type: formData.source_type,
            configuration: formData.configuration,
            is_active: formData.is_active,
            created_by: 'admin'
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Data source ${editingSource ? 'updated' : 'created'} successfully`,
      });

      setIsCreating(false);
      setEditingSource(null);
      fetchDataSources();
    } catch (error) {
      console.error('Error saving data source:', error);
      toast({
        title: "Error",
        description: "Failed to save data source",
        variant: "destructive",
      });
    }
  };

  const handleConfigurationChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value
      }
    }));
  };

  const renderConfigurationFields = () => {
    const { source_type } = formData;

    switch (source_type) {
      case 'ftp':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Host *</Label>
                <Input
                  value={formData.configuration.host || ''}
                  onChange={(e) => handleConfigurationChange('host', e.target.value)}
                  placeholder="ftp.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  type="number"
                  value={formData.configuration.port || 21}
                  onChange={(e) => handleConfigurationChange('port', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  value={formData.configuration.username || ''}
                  onChange={(e) => handleConfigurationChange('username', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={formData.configuration.password || ''}
                  onChange={(e) => handleConfigurationChange('password', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.configuration.secure || false}
                onCheckedChange={(checked) => handleConfigurationChange('secure', checked)}
              />
              <Label>Use SFTP (Secure)</Label>
            </div>
          </div>
        );

      case 'google_sheets':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sheet ID *</Label>
              <Input
                value={formData.configuration.sheet_id || ''}
                onChange={(e) => handleConfigurationChange('sheet_id', e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
            </div>
            <div className="space-y-2">
              <Label>Range</Label>
              <Input
                value={formData.configuration.range || ''}
                onChange={(e) => handleConfigurationChange('range', e.target.value)}
                placeholder="A1:Z1000"
              />
            </div>
            <div className="space-y-2">
              <Label>Service Account Credentials (JSON)</Label>
              <Textarea
                value={formData.configuration.credentials || ''}
                onChange={(e) => handleConfigurationChange('credentials', e.target.value)}
                placeholder='{"type": "service_account", ...}'
                rows={4}
              />
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Endpoint URL *</Label>
              <Input
                value={formData.configuration.endpoint || ''}
                onChange={(e) => handleConfigurationChange('endpoint', e.target.value)}
                placeholder="https://api.example.com/data"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Method</Label>
                <Select
                  value={formData.configuration.method || 'GET'}
                  onValueChange={(value) => handleConfigurationChange('method', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Authentication</Label>
                <Select
                  value={formData.configuration.auth_type || 'none'}
                  onValueChange={(value) => handleConfigurationChange('auth_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.configuration.auth_type === 'bearer' && (
              <div className="space-y-2">
                <Label>Bearer Token</Label>
                <Input
                  type="password"
                  value={formData.configuration.token || ''}
                  onChange={(e) => handleConfigurationChange('token', e.target.value)}
                />
              </div>
            )}
            {formData.configuration.auth_type === 'api_key' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key Name</Label>
                  <Input
                    value={formData.configuration.api_key_name || ''}
                    onChange={(e) => handleConfigurationChange('api_key_name', e.target.value)}
                    placeholder="X-API-Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key Value</Label>
                  <Input
                    type="password"
                    value={formData.configuration.api_key_value || ''}
                    onChange={(e) => handleConfigurationChange('api_key_value', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Host *</Label>
                <Input
                  value={formData.configuration.host || ''}
                  onChange={(e) => handleConfigurationChange('host', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  type="number"
                  value={formData.configuration.port || 5432}
                  onChange={(e) => handleConfigurationChange('port', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Database *</Label>
                <Input
                  value={formData.configuration.database || ''}
                  onChange={(e) => handleConfigurationChange('database', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  value={formData.configuration.username || ''}
                  onChange={(e) => handleConfigurationChange('username', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                value={formData.configuration.password || ''}
                onChange={(e) => handleConfigurationChange('password', e.target.value)}
              />
            </div>
          </div>
        );

      case 'csv_upload':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Directory</Label>
              <Input
                value={formData.configuration.upload_path || '/uploads'}
                onChange={(e) => handleConfigurationChange('upload_path', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.configuration.auto_process || false}
                onCheckedChange={(checked) => handleConfigurationChange('auto_process', checked)}
              />
              <Label>Auto-process uploaded files</Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading data sources...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCreating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {editingSource ? 'Edit Data Source' : 'Create New Data Source'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter data source name"
              />
            </div>
            <div className="space-y-2">
              <Label>Source Type *</Label>
              <Select
                value={formData.source_type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  source_type: value,
                  configuration: {} 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ftp">FTP Server</SelectItem>
                  <SelectItem value="google_sheets">Google Sheets</SelectItem>
                  <SelectItem value="api">REST API</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="csv_upload">CSV Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.source_type && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Configuration</Label>
              {renderConfigurationFields()}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label>Active</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              {editingSource ? 'Update' : 'Create'} Data Source
            </Button>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Sources
          </CardTitle>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Data Source
          </Button>
        </CardHeader>
        <CardContent>
          {dataSources.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No data sources configured yet.</p>
              <p className="text-sm text-muted-foreground">Create your first data source to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dataSources.map((source) => {
                const Icon = sourceTypeIcons[source.source_type as keyof typeof sourceTypeIcons];
                return (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sourceTypeLabels[source.source_type as keyof typeof sourceTypeLabels]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={source.is_active ? "default" : "secondary"}>
                        {source.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(source)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(source.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourceConfiguration;