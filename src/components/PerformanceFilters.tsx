
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';

export interface PerformanceFilter {
  client?: string;
  practiceGroup?: string;
  dateRange?: string;
  revenueMin?: number;
  revenueMax?: number;
}

interface PerformanceFiltersProps {
  onFilterChange: (filters: PerformanceFilter) => void;
  availableClients: string[];
  availablePracticeGroups: string[];
}

const PerformanceFilters = ({ onFilterChange, availableClients, availablePracticeGroups }: PerformanceFiltersProps) => {
  const [filters, setFilters] = useState<PerformanceFilter>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof PerformanceFilter, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={filters.client || ''}
                onValueChange={(value) => handleFilterChange('client', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All clients</SelectItem>
                  {availableClients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Practice Group</Label>
              <Select
                value={filters.practiceGroup || ''}
                onValueChange={(value) => handleFilterChange('practiceGroup', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All practice groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All practice groups</SelectItem>
                  {availablePracticeGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select
                value={filters.dateRange || ''}
                onValueChange={(value) => handleFilterChange('dateRange', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All time</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="last6months">Last 6 months</SelectItem>
                  <SelectItem value="lastyear">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Revenue Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.revenueMin || ''}
                  onChange={(e) => handleFilterChange('revenueMin', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.revenueMax || ''}
                  onChange={(e) => handleFilterChange('revenueMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PerformanceFilters;
