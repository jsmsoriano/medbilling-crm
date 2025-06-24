
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import { SpreadsheetData } from '@/services/spreadsheetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Mail, Phone, Calendar, Plus, Edit, Trash2, Grid2X2, List, ArrowUpDown } from 'lucide-react';
import FileImport from '@/components/FileImport';
import ClientForm from '@/components/ClientForm';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'cards' | 'list';
type SortField = 'clientName' | 'value' | 'lastContact' | 'status';
type SortOrder = 'asc' | 'desc';

const Clients = () => {
  const navigate = useNavigate();
  const { clients, loading, importFromFile, exportToCSV, loadData } = useSpreadsheetData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortField, setSortField] = useState<SortField>('clientName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<SpreadsheetData | null>(null);
  const [clientsData, setClientsData] = useState<SpreadsheetData[]>(clients);

  // Update local state when clients data changes
  React.useEffect(() => {
    setClientsData(clients);
  }, [clients]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedAndFilteredClients = clientsData
    .filter(client =>
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      
      if (sortField === 'value') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: SpreadsheetData) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleSaveClient = (client: SpreadsheetData) => {
    if (editingClient) {
      // Update existing client
      setClientsData(prev => prev.map(c => c.id === client.id ? client : c));
      toast({
        title: "Client updated",
        description: "Client information has been updated successfully",
      });
    } else {
      // Add new client
      setClientsData(prev => [...prev, client]);
      toast({
        title: "Client added",
        description: "New client has been added successfully",
      });
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClientsData(prev => prev.filter(c => c.id !== clientId));
    toast({
      title: "Client deleted",
      description: "Client has been removed successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ClientCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedAndFilteredClients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 
                className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                {client.clientName}
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClient(client)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Client</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {client.clientName}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
            
            <div className="space-y-2 text-sm text-gray-600 mt-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last contact: {client.lastContact}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Value</span>
                <span className="font-semibold text-green-600">
                  ${client.value.toLocaleString()}
                </span>
              </div>
            </div>
            
            {client.notes && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                {client.notes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ClientTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('clientName')} className="h-auto p-0 font-semibold">
              Client Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('status')} className="h-auto p-0 font-semibold">
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('lastContact')} className="h-auto p-0 font-semibold">
              Last Contact
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('value')} className="h-auto p-0 font-semibold">
              Value
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAndFilteredClients.map((client) => (
          <TableRow key={client.id}>
            <TableCell 
              className="font-medium cursor-pointer hover:text-blue-600"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              {client.clientName}
            </TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </TableCell>
            <TableCell>{client.lastContact}</TableCell>
            <TableCell className="font-semibold text-green-600">
              ${client.value.toLocaleString()}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClient(client)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Client</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {client.clientName}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <div className="text-sm text-gray-500">
          {clientsData.length} clients from spreadsheet
        </div>
      </div>

      <FileImport
        onFileImport={importFromFile}
        onExport={exportToCSV}
        onRefresh={loadData}
        loading={loading}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Directory</CardTitle>
            <div className="flex items-center gap-4">
              <Button onClick={handleAddClient}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={`${sortField}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-') as [SortField, SortOrder];
              setSortField(field);
              setSortOrder(order);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clientName-asc">Name (A-Z)</SelectItem>
                <SelectItem value="clientName-desc">Name (Z-A)</SelectItem>
                <SelectItem value="value-desc">Value (High-Low)</SelectItem>
                <SelectItem value="value-asc">Value (Low-High)</SelectItem>
                <SelectItem value="lastContact-desc">Last Contact (Recent)</SelectItem>
                <SelectItem value="lastContact-asc">Last Contact (Oldest)</SelectItem>
                <SelectItem value="status-asc">Status (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading client data...</div>
          ) : sortedAndFilteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No clients found matching your search.' : 'No client data available. Import a spreadsheet to get started.'}
            </div>
          ) : viewMode === 'cards' ? (
            <ClientCards />
          ) : (
            <ClientTable />
          )}
        </CardContent>
      </Card>

      <ClientForm
        open={showClientForm}
        onOpenChange={setShowClientForm}
        client={editingClient}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default Clients;
