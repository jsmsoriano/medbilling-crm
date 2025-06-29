
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  FolderOpen,
  FileText,
  Image,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

interface FileRecord {
  id: string;
  client_id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number | null;
  folder_path: string | null;
  description: string | null;
  uploaded_by: string;
  is_confidential: boolean | null;
  created_at: string;
  updated_at: string;
  clients?: { name: string };
}

const FileVault = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [uploadData, setUploadData] = useState({
    client_id: '',
    description: '',
    folder_path: '',
    is_confidential: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch files
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['file_vault'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_vault')
        .select(`
          *,
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FileRecord[];
    }
  });

  // Fetch clients for file assignment
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (fileData: any) => {
      if (!selectedFile) throw new Error('No file selected');
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split('.').pop();
      const uniqueFilename = `${timestamp}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
      
      const { data, error } = await supabase
        .from('file_vault')
        .insert([{
          ...fileData,
          filename: uniqueFilename,
          original_filename: selectedFile.name,
          file_type: selectedFile.type || 'application/octet-stream',
          file_size: selectedFile.size,
          uploaded_by: 'Current User' // Replace with actual user info
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file_vault'] });
      setIsUploadDialogOpen(false);
      setUploadData({
        client_id: '',
        description: '',
        folder_path: '',
        is_confidential: false
      });
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('file_vault')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file_vault'] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    }
  });

  const handleFileUpload = () => {
    if (!selectedFile || !uploadData.client_id) {
      toast({
        title: "Error",
        description: "Please select a file and client",
        variant: "destructive",
      });
      return;
    }
    uploadFileMutation.mutate(uploadData);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-5 h-5" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get unique folders for filtering
  const folders = Array.from(new Set(files.map(f => f.folder_path).filter(Boolean)));

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesClient = selectedClient === 'all' || file.client_id === selectedClient;
    const matchesSearch = file.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.clients?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = folderFilter === 'all' || file.folder_path === folderFilter;
    
    return matchesClient && matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Vault</h1>
          <p className="text-gray-600 mt-2">Secure document storage for client files (non-clinical only)</p>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Do not upload any files containing Protected Health Information (PHI) or clinical data. 
                      This vault is for billing documents, contracts, and administrative files only.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={uploadData.client_id} onValueChange={(value) => setUploadData({ ...uploadData, client_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="folder">Folder (Optional)</Label>
                <Input
                  id="folder"
                  value={uploadData.folder_path}
                  onChange={(e) => setUploadData({ ...uploadData, folder_path: e.target.value })}
                  placeholder="e.g., Contracts, Billing Documents, Reports"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Brief description of the file"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={uploadData.is_confidential}
                  onChange={(e) => setUploadData({ ...uploadData, is_confidential: e.target.checked })}
                />
                <Label htmlFor="confidential">Mark as confidential</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFileUpload} disabled={uploadFileMutation.isPending}>
                  {uploadFileMutation.isPending ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={folderFilter} onValueChange={setFolderFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Folders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder} value={folder || ''}>
                      {folder || 'No Folder'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedClient !== 'all' || folderFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms.' 
                  : 'Upload your first file to get started.'}
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Files ({filteredFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.file_type)}
                      <div>
                        <h4 className="font-medium text-gray-900">{file.original_filename}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{file.clients?.name}</span>
                          {file.folder_path && (
                            <>
                              <span>•</span>
                              <span>{file.folder_path}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>•</span>
                          <span>{new Date(file.created_at).toLocaleDateString()}</span>
                        </div>
                        {file.description && (
                          <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.is_confidential && (
                        <Badge className="bg-red-100 text-red-800">Confidential</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteFileMutation.mutate(file.id)}
                        disabled={deleteFileMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FileVault;
