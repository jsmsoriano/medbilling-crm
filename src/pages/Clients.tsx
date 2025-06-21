
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    {
      id: 1,
      name: 'Metro Medical Center',
      contact: 'Dr. Sarah Johnson',
      email: 'admin@metromedical.com',
      phone: '(555) 123-4567',
      address: '123 Medical Plaza, City, ST 12345',
      status: 'active',
      monthlyRevenue: 15420,
      totalClaims: 145,
      successRate: 94.2,
      trend: 'up',
      change: '+12%',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Sunrise Family Practice',
      contact: 'Dr. Michael Chen',
      email: 'billing@sunrisefp.com',
      phone: '(555) 234-5678',
      address: '456 Oak Street, City, ST 12345',
      status: 'active',
      monthlyRevenue: 12340,
      totalClaims: 128,
      successRate: 91.8,
      trend: 'up',
      change: '+8%',
      joinDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Downtown Cardiology',
      contact: 'Dr. Emily Rodriguez',
      email: 'office@downtowncardio.com',
      phone: '(555) 345-6789',
      address: '789 Heart Lane, City, ST 12345',
      status: 'active',
      monthlyRevenue: 9850,
      totalClaims: 89,
      successRate: 88.7,
      trend: 'down',
      change: '-3%',
      joinDate: '2022-11-10'
    },
    {
      id: 4,
      name: 'Pediatric Associates',
      contact: 'Dr. David Kim',
      email: 'info@pedassociates.com',
      phone: '(555) 456-7890',
      address: '321 Kids Avenue, City, ST 12345',
      status: 'active',
      monthlyRevenue: 8720,
      totalClaims: 156,
      successRate: 96.1,
      trend: 'up',
      change: '+15%',
      joinDate: '2023-03-05'
    },
    {
      id: 5,
      name: 'Women\'s Health Clinic',
      contact: 'Dr. Lisa Anderson',
      email: 'contact@womenshealthclinic.com',
      phone: '(555) 567-8901',
      address: '654 Wellness Way, City, ST 12345',
      status: 'pending',
      monthlyRevenue: 7680,
      totalClaims: 72,
      successRate: 92.4,
      trend: 'up',
      change: '+5%',
      joinDate: '2023-05-12'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Manage your medical billing clients and relationships</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Clients</Button>
            <Button variant="outline">Active</Button>
            <Button variant="outline">Pending</Button>
          </div>
        </div>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-600">{client.contact}</p>
                <Badge 
                  variant={client.status === 'active' ? 'default' : 'secondary'}
                  className="mt-2"
                >
                  {client.status === 'active' ? 'Active' : 'Pending'}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Client</DropdownMenuItem>
                  <DropdownMenuItem>View Claims</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Remove Client</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3 mb-4">
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
                {client.address}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${client.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Monthly Revenue</p>
                <div className="flex items-center mt-1">
                  {client.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${client.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {client.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{client.successRate}%</p>
                <p className="text-xs text-gray-600">Success Rate</p>
                <p className="text-xs text-gray-500 mt-1">{client.totalClaims} claims</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clients;
