import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  User,
  Building,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  practiceType: string;
  status: string;
  contractStartDate: string;
  monthlyRevenue: number;
  notes: string;
}

interface ClientsTableProps {
  clients: Client[];
  getStatusColor: (status: string) => string;
}

interface Column {
  key: keyof Client | 'actions';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
  visible: boolean;
}

const defaultColumns: Column[] = [
  { key: 'name', label: 'Client Name', icon: User, required: true, visible: true },
  { key: 'practiceType', label: 'Practice Type', icon: Building, required: true, visible: true },
  { key: 'email', label: 'Email', icon: Mail, required: true, visible: true },
  { key: 'phone', label: 'Phone', icon: Phone, required: true, visible: true },
  { key: 'city', label: 'Location', icon: MapPin, required: false, visible: true },
  { key: 'monthlyRevenue', label: 'Revenue', icon: DollarSign, required: false, visible: true },
  { key: 'contractStartDate', label: 'Contract Date', icon: Calendar, required: false, visible: false },
  { key: 'status', label: 'Status', icon: Building, required: false, visible: true },
  { key: 'notes', label: 'Notes', icon: FileText, required: false, visible: false },
  { key: 'actions', label: 'Actions', icon: Settings, required: true, visible: true }
];

export const ClientsTable = ({ clients, getStatusColor }: ClientsTableProps) => {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [tableWidth, setTableWidth] = useState([100]);

  const visibleColumns = columns.filter(col => col.visible);
  const requiredColumnsCount = columns.filter(col => col.required).length;
  const totalVisibleColumns = visibleColumns.length;

  const toggleColumn = (columnKey: keyof Client | 'actions') => {
    setColumns(prev => prev.map(col => {
      if (col.key === columnKey) {
        // Prevent hiding required columns
        if (col.required) return col;
        
        // Prevent going below minimum of 4 columns
        const newVisibleCount = col.visible ? totalVisibleColumns - 1 : totalVisibleColumns + 1;
        if (newVisibleCount < 4 && !col.visible) return col;
        if (newVisibleCount < 4 && col.visible) return col;
        
        return { ...col, visible: !col.visible };
      }
      return col;
    }));
  };

  const formatValue = (client: Client, columnKey: keyof Client | 'actions') => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="min-w-0">
            <Link 
              to={`/clients/${client.id}`}
              className="font-medium text-foreground hover:text-primary transition-colors block truncate"
              title={client.name}
            >
              {client.name}
            </Link>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
            <span className="truncate text-muted-foreground" title={client.email}>
              {client.email}
            </span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground" title={client.phone}>
              {client.phone}
            </span>
          </div>
        );
      case 'city':
        return (
          <span className="text-muted-foreground truncate block" title={`${client.city}, ${client.state} ${client.zipCode}`}>
            {client.city}, {client.state}
          </span>
        );
      case 'monthlyRevenue':
        return (
          <span className="font-semibold text-foreground whitespace-nowrap">
            ${client.monthlyRevenue.toLocaleString()}/mo
          </span>
        );
      case 'contractStartDate':
        return (
          <span className="text-muted-foreground">
            {new Date(client.contractStartDate).toLocaleDateString()}
          </span>
        );
      case 'status':
        return (
          <Badge className={`${getStatusColor(client.status)} border font-medium text-xs px-2 py-1`}>
            {client.status}
          </Badge>
        );
      case 'practiceType':
        return (
          <span className="text-muted-foreground truncate block" title={client.practiceType}>
            {client.practiceType}
          </span>
        );
      case 'notes':
        return client.notes ? (
          <span className="text-muted-foreground truncate block text-sm" title={client.notes}>
            {client.notes}
          </span>
        ) : (
          <span className="text-muted-foreground/50 text-sm">—</span>
        );
      case 'actions':
        return (
          <Link to={`/clients/${client.id}`}>
            <Button size="sm" variant="outline" className="whitespace-nowrap text-xs px-2 py-1">
              View
            </Button>
          </Link>
        );
      default:
        return client[columnKey as keyof Client];
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Columns ({totalVisibleColumns})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Table Columns</h4>
                  <span className="text-sm text-muted-foreground">
                    {totalVisibleColumns} of {columns.length} visible
                  </span>
                </div>
                
                <div className="space-y-3">
                  {columns.map((column) => {
                    const Icon = column.icon;
                    const isDisabled = column.required || (totalVisibleColumns <= 4 && column.visible);
                    
                    return (
                      <div key={column.key} className="flex items-center space-x-3">
                        <Checkbox
                          id={column.key}
                          checked={column.visible}
                          onCheckedChange={() => toggleColumn(column.key)}
                          disabled={isDisabled}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <label 
                            htmlFor={column.key} 
                            className={`text-sm font-medium cursor-pointer ${isDisabled ? 'text-muted-foreground' : 'text-foreground'}`}
                          >
                            {column.label}
                            {column.required && (
                              <span className="text-xs text-primary ml-1">(Required)</span>
                            )}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Minimum 4 columns required. Required columns cannot be hidden.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Table Width:</span>
          <div className="w-24">
            <Slider
              value={tableWidth}
              onValueChange={setTableWidth}
              max={100}
              min={60}
              step={5}
              className="w-full"
            />
          </div>
          <span className="text-sm text-muted-foreground min-w-[3rem]">{tableWidth[0]}%</span>
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div 
            className="min-w-full"
            style={{ width: `${tableWidth[0]}%` }}
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary/20">
                <tr>
                  {visibleColumns.map((column) => {
                    const Icon = column.icon;
                    return (
                      <th 
                        key={column.key} 
                        className="text-left p-4 font-semibold text-foreground border-r border-border/30 last:border-r-0"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span>{column.label}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr 
                    key={client.id} 
                    className={`
                      border-b border-border/20 hover:bg-muted/30 transition-colors
                      ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}
                    `}
                  >
                    {visibleColumns.map((column) => (
                      <td 
                        key={column.key} 
                        className="p-4 text-left align-top border-r border-border/20 last:border-r-0"
                      >
                        {formatValue(client, column.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Table Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {clients.length} clients</span>
        <span>
          {totalVisibleColumns} columns visible • Table width: {tableWidth[0]}%
        </span>
      </div>
    </div>
  );
};