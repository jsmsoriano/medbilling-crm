
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
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const practiceTypes = [...new Set(clients.map(client => client.practiceType))];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2">Manage your client relationships and billing accounts</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="space-y-6 w-full">
          {/* Filters Section */}
          <Card>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search Input */}
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                    <Input
                      placeholder="Search clients by name, email, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="w-full sm:w-auto sm:min-w-32">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border shadow-lg z-50">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-auto sm:min-w-40">
                    <Select value={practiceTypeFilter} onValueChange={setPracticeTypeFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Practice Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border shadow-lg z-50">
                        <SelectItem value="all">All Types</SelectItem>
                        {practiceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-md self-start flex-shrink-0">
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
            </div>
          </Card>
          {/* Clients Display */}
          <div className="w-full">
            {viewMode === 'cards' ? (
              // Cards View - Responsive grid that scales beautifully across all screen widths
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="p-6 hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-2">
                        <Link 
                          to={`/clients/${client.id}`}
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {client.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 truncate font-medium">{client.practiceType}</p>
                      </div>
                      <Badge className={`${getStatusColor(client.status)} flex-shrink-0 border font-medium`}>
                        {client.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground min-w-0">
                        <Mail className="w-4 h-4 mr-3 flex-shrink-0 text-primary/60" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-3 flex-shrink-0 text-primary/60" />
                        <span>{client.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground min-w-0">
                        <MapPin className="w-4 h-4 mr-3 flex-shrink-0 text-primary/60" />
                        <span className="truncate">{client.city}, {client.state} {client.zipCode}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-3 flex-shrink-0 text-primary/60" />
                        <span>Contract: {new Date(client.contractStartDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-foreground font-semibold">
                        <DollarSign className="w-4 h-4 mr-3 flex-shrink-0 text-success" />
                        <span>${client.monthlyRevenue.toLocaleString()}/month</span>
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border/30">
                        <p className="text-sm text-muted-foreground line-clamp-3">{client.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-border/50">
                      <Link to={`/clients/${client.id}`} className="block">
                        <Button className="w-full font-medium" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // List View - Full width table with proper scrolling
              <div className="w-full">
                <Card className="w-full border-border/50">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/30">
                        <tr>
                          <th className="text-left p-3 font-semibold text-foreground">Client</th>
                          <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Practice Type</th>
                          <th className="text-left p-3 font-semibold text-foreground">Contact</th>
                          <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Location</th>
                          <th className="text-left p-3 font-semibold text-foreground hidden lg:table-cell">Revenue</th>
                          <th className="text-left p-3 font-semibold text-foreground">Status</th>
                          <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <div className="min-w-0">
                                <Link 
                                  to={`/clients/${client.id}`}
                                  className="font-medium text-foreground hover:text-primary transition-colors block truncate"
                                  title={client.name}
                                >
                                  {client.name}
                                </Link>
                                {client.notes && (
                                  <p className="text-sm text-muted-foreground mt-1 truncate" title={client.notes}>
                                    {client.notes}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                              <span className="truncate block" title={client.practiceType}>
                                {client.practiceType}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Mail className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                                  <span className="truncate" title={client.email}>{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                                  <span className="truncate" title={client.phone}>{client.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                              <span className="truncate block" title={`${client.city}, ${client.state} ${client.zipCode}`}>
                                {client.city}, {client.state} {client.zipCode}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-foreground font-semibold hidden lg:table-cell">
                              <span className="whitespace-nowrap">
                                ${client.monthlyRevenue.toLocaleString()}/mo
                              </span>
                            </td>
                            <td className="p-3">
                              <Badge className={`${getStatusColor(client.status)} border font-medium text-xs px-2 py-1`}>
                                {client.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Link to={`/clients/${client.id}`}>
                                <Button size="sm" variant="outline" className="whitespace-nowrap text-xs px-2 py-1">
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* No Results State */}
          {filteredClients.length === 0 && (
            <Card className="p-8 sm:p-12">
              <div className="text-center">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No clients found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find the clients you're looking for.
                </p>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default Clients;
