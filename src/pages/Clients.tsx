
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MapPin, Phone, Mail, Calendar, DollarSign, Grid2X2, List } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock client data
const mockClients = [
  {
    id: 1,
    name: 'Valley Medical Group',
    email: 'contact@valleymedical.com',
    phone: '(555) 123-4567',
    address: '123 Medical Plaza, Suite 200',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    practiceType: 'Family Practice',
    status: 'active',
    contractStartDate: '2023-01-15',
    monthlyRevenue: 12500,
    notes: 'Primary family practice with 3 providers'
  },
  {
    id: 2,
    name: 'Coastal Orthopedics',
    email: 'billing@coastalortho.com',
    phone: '(555) 987-6543',
    address: '456 Ocean Drive',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    practiceType: 'Orthopedics',
    status: 'active',
    contractStartDate: '2022-08-20',
    monthlyRevenue: 18750,
    notes: 'Specializes in sports medicine and joint replacement'
  },
  {
    id: 3,
    name: 'Downtown Dental',
    email: 'admin@downtowndental.com',
    phone: '(555) 456-7890',
    address: '789 Main Street, Floor 3',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92101',
    practiceType: 'Dental',
    status: 'inactive',
    contractStartDate: '2023-03-10',
    monthlyRevenue: 8200,
    notes: 'General dentistry practice with cosmetic services'
  },
  {
    id: 4,
    name: 'Pediatric Care Center',
    email: 'info@pediatriccare.com',
    phone: '(555) 321-0987',
    address: '321 Children\'s Way',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
    practiceType: 'Pediatrics',
    status: 'active',
    contractStartDate: '2023-06-01',
    monthlyRevenue: 15300,
    notes: 'Full-service pediatric clinic serving ages 0-18'
  }
];

const Clients = () => {
  const [clients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [practiceTypeFilter, setPracticeTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPracticeType = practiceTypeFilter === 'all' || client.practiceType === practiceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesPracticeType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const practiceTypes = [...new Set(clients.map(client => client.practiceType))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Manage your client relationships and billing accounts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={practiceTypeFilter} onValueChange={setPracticeTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Practice Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {practiceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-r-none"
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Clients Display */}
      {viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link 
                    to={`/clients/${client.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {client.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{client.practiceType}</p>
                </div>
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {client.email}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {client.phone}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {client.city}, {client.state} {client.zipCode}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Contract: {new Date(client.contractStartDate).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${client.monthlyRevenue.toLocaleString()}/month
                </div>
              </div>

              {client.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">{client.notes}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to={`/clients/${client.id}`}>
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Client</th>
                  <th className="text-left p-4 font-medium">Practice Type</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Revenue</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <Link 
                          to={`/clients/${client.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {client.name}
                        </Link>
                        {client.notes && (
                          <p className="text-sm text-gray-500 mt-1">{client.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{client.practiceType}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {client.city}, {client.state} {client.zipCode}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      ${client.monthlyRevenue.toLocaleString()}/month
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Link to={`/clients/${client.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredClients.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find the clients you're looking for.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Clients;
