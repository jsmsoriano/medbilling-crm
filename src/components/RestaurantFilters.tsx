
import { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { cuisineTypes, regions } from '@/data/restaurants';

interface RestaurantFiltersProps {
  appliedFilters: {
    cuisine: string[];
    priceRange: string[];
    region: string[];
  };
  onFilterChange: (type: 'cuisine' | 'priceRange' | 'region', value: string[]) => void;
  onClearFilters: () => void;
}

const RestaurantFilters = ({
  appliedFilters,
  onFilterChange,
  onClearFilters,
}: RestaurantFiltersProps) => {
  const priceRanges = ["₱", "₱₱", "₱₱₱"];
  
  const handleCuisineChange = (cuisine: string) => {
    const newCuisines = appliedFilters.cuisine.includes(cuisine)
      ? appliedFilters.cuisine.filter(c => c !== cuisine)
      : [...appliedFilters.cuisine, cuisine];
    
    onFilterChange('cuisine', newCuisines);
  };
  
  const handlePriceChange = (price: string) => {
    const newPrices = appliedFilters.priceRange.includes(price)
      ? appliedFilters.priceRange.filter(p => p !== price)
      : [...appliedFilters.priceRange, price];
    
    onFilterChange('priceRange', newPrices);
  };
  
  const handleRegionChange = (region: string) => {
    const newRegions = appliedFilters.region.includes(region)
      ? appliedFilters.region.filter(r => r !== region)
      : [...appliedFilters.region, region];
    
    onFilterChange('region', newRegions);
  };
  
  const hasActiveFilters = 
    appliedFilters.cuisine.length > 0 || 
    appliedFilters.priceRange.length > 0 || 
    appliedFilters.region.length > 0;
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Cuisine Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Cuisine <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {cuisineTypes.map((cuisine) => (
              <DropdownMenuCheckboxItem
                key={cuisine}
                checked={appliedFilters.cuisine.includes(cuisine)}
                onCheckedChange={() => handleCuisineChange(cuisine)}
              >
                {cuisine}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Price Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Price <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {priceRanges.map((price) => (
              <DropdownMenuCheckboxItem
                key={price}
                checked={appliedFilters.priceRange.includes(price)}
                onCheckedChange={() => handlePriceChange(price)}
              >
                {price}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Region Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Region <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {regions.map((region) => (
              <DropdownMenuCheckboxItem
                key={region}
                checked={appliedFilters.region.includes(region)}
                onCheckedChange={() => handleRegionChange(region)}
              >
                {region}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear Filters
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {appliedFilters.cuisine.map((cuisine) => (
            <Badge key={`cuisine-${cuisine}`} variant="secondary" className="flex items-center gap-1">
              {cuisine}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCuisineChange(cuisine)}
              />
            </Badge>
          ))}
          
          {appliedFilters.priceRange.map((price) => (
            <Badge key={`price-${price}`} variant="secondary" className="flex items-center gap-1">
              {price}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePriceChange(price)}
              />
            </Badge>
          ))}
          
          {appliedFilters.region.map((region) => (
            <Badge key={`region-${region}`} variant="secondary" className="flex items-center gap-1">
              {region}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRegionChange(region)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantFilters;
