
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, X, List, Grid } from 'lucide-react';

export interface PipelineFilter {
  stage?: string;
  source?: string;
  probabilityMin?: number;
  probabilityMax?: number;
  valueMin?: number;
  valueMax?: number;
  search?: string;
}

interface PipelineFiltersProps {
  onFilterChange: (filters: PipelineFilter) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  availableStages: string[];
  availableSources: string[];
}

const PipelineFilters = ({ 
  onFilterChange, 
  onViewChange, 
  currentView, 
  availableStages, 
  availableSources 
}: PipelineFiltersProps) => {
  const [filters, setFilters] = useState<PipelineFilter>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof PipelineFilter, value: string | number | undefined) => {
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
          <div className="flex border rounded-md">
            <Button
              variant={currentView === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search prospects..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={filters.stage || ''}
                onValueChange={(value) => handleFilterChange('stage', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All stages</SelectItem>
                  {availableStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={filters.source || ''}
                onValueChange={(value) => handleFilterChange('source', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sources</SelectItem>
                  {availableSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Probability Range (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.probabilityMin || ''}
                  onChange={(e) => handleFilterChange('probabilityMin', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.probabilityMax || ''}
                  onChange={(e) => handleFilterChange('probabilityMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Value Range ($)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.valueMin || ''}
                  onChange={(e) => handleFilterChange('valueMin', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.valueMax || ''}
                  onChange={(e) => handleFilterChange('valueMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PipelineFilters;
