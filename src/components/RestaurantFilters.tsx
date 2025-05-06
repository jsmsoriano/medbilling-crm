
import { useState } from 'react';
import { Check, ChevronDown, MapPin, Star, Building, Award, Globe, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cuisineTypes, regions, designationTypes, countries } from '@/data/restaurants';

interface RestaurantFiltersProps {
  appliedFilters: {
    cuisine: string[];
    priceRange: string[];
    region: string[];
    franchise: boolean | null;
    designation: string[];
    country: string[];
    minRating: number | undefined;
    zipCode: string;
    city: string;
  };
  onFilterChange: <T>(type: string, value: T) => void;
  onClearFilters: () => void;
}

const RestaurantFilters = ({
  appliedFilters,
  onFilterChange,
  onClearFilters,
}: RestaurantFiltersProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  const handleDesignationChange = (designation: string) => {
    const newDesignations = appliedFilters.designation.includes(designation)
      ? appliedFilters.designation.filter(d => d !== designation)
      : [...appliedFilters.designation, designation];
    
    onFilterChange('designation', newDesignations);
  };

  const handleCountryChange = (country: string) => {
    const newCountries = appliedFilters.country.includes(country)
      ? appliedFilters.country.filter(c => c !== country)
      : [...appliedFilters.country, country];
    
    onFilterChange('country', newCountries);
  };

  const handleFranchiseChange = () => {
    // Toggle between true, false, and null (not filtered)
    let newValue: boolean | null;
    if (appliedFilters.franchise === null) newValue = true;
    else if (appliedFilters.franchise === true) newValue = false;
    else newValue = null;
    
    onFilterChange('franchise', newValue);
  };
  
  const handleRatingChange = (value: number[]) => {
    onFilterChange('minRating', value[0]);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('zipCode', e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('city', e.target.value);
  };
  
  const hasActiveFilters = 
    appliedFilters.cuisine.length > 0 || 
    appliedFilters.priceRange.length > 0 || 
    appliedFilters.region.length > 0 ||
    appliedFilters.franchise !== null ||
    appliedFilters.designation.length > 0 ||
    appliedFilters.country.length > 0 ||
    appliedFilters.minRating !== undefined ||
    appliedFilters.zipCode !== '' ||
    appliedFilters.city !== '';
  
  const getFranchiseLabel = () => {
    if (appliedFilters.franchise === null) return "Franchise Status";
    if (appliedFilters.franchise === true) return "Franchise Only";
    return "Non-Franchise Only";
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedFilters.cuisine.length > 0) count += 1;
    if (appliedFilters.priceRange.length > 0) count += 1;
    if (appliedFilters.region.length > 0) count += 1;
    if (appliedFilters.franchise !== null) count += 1;
    if (appliedFilters.designation.length > 0) count += 1;
    if (appliedFilters.country.length > 0) count += 1;
    if (appliedFilters.minRating !== undefined) count += 1;
    if (appliedFilters.zipCode !== '') count += 1;
    if (appliedFilters.city !== '') count += 1;
    return count;
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
        
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

      <Collapsible open={!isCollapsed} onOpenChange={open => setIsCollapsed(!open)}>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-md">
            {/* Cuisine Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 w-full">
                    Cuisine <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
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
            </div>
            
            {/* Price Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 w-full">
                    Price <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
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
            </div>

            {/* Designation Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 w-full">
                    <Award className="h-4 w-4" />
                    Designation <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {designationTypes.map((designation) => (
                    <DropdownMenuCheckboxItem
                      key={designation}
                      checked={appliedFilters.designation.includes(designation)}
                      onCheckedChange={() => handleDesignationChange(designation)}
                    >
                      {designation}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Country Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 w-full">
                    <Globe className="h-4 w-4" />
                    Country <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {countries.map((country) => (
                    <DropdownMenuCheckboxItem
                      key={country}
                      checked={appliedFilters.country.includes(country)}
                      onCheckedChange={() => handleCountryChange(country)}
                    >
                      {country}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Region Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 w-full">
                    <MapPin className="h-4 w-4" />
                    Region <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
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
            </div>

            {/* Franchise Filter */}
            <div>
              <Button 
                variant={appliedFilters.franchise !== null ? "default" : "outline"}
                className="flex items-center gap-1 w-full"
                onClick={handleFranchiseChange}
              >
                <Building className="h-4 w-4" />
                {getFranchiseLabel()}
              </Button>
            </div>

            {/* Rating Filter */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Minimum Rating:</span>
                <span className="text-sm font-bold">
                  {appliedFilters.minRating || 0}
                  <Star className="h-3 w-3 inline ml-1" />
                </span>
              </div>
              <Slider 
                defaultValue={[0]} 
                max={5} 
                step={0.5} 
                value={[appliedFilters.minRating || 0]}
                onValueChange={handleRatingChange}
              />
            </div>

            {/* City Filter */}
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">City:</span>
              <Input 
                placeholder="Enter city name" 
                value={appliedFilters.city} 
                onChange={handleCityChange}
              />
            </div>

            {/* Zip Code Filter */}
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">ZIP Code:</span>
              <Input 
                placeholder="Enter zip code" 
                value={appliedFilters.zipCode} 
                onChange={handleZipCodeChange}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Active Filter Badges */}
      {hasActiveFilters && !isCollapsed && (
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
              <MapPin className="h-3 w-3" />
              {region}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRegionChange(region)}
              />
            </Badge>
          ))}

          {appliedFilters.franchise !== null && (
            <Badge key="franchise" variant="secondary" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {appliedFilters.franchise ? 'Franchise Only' : 'Non-Franchise Only'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('franchise', null)}
              />
            </Badge>
          )}

          {appliedFilters.designation.map((designation) => (
            <Badge key={`designation-${designation}`} variant="secondary" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {designation}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDesignationChange(designation)}
              />
            </Badge>
          ))}

          {appliedFilters.country.map((country) => (
            <Badge key={`country-${country}`} variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {country}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCountryChange(country)}
              />
            </Badge>
          ))}

          {appliedFilters.minRating !== undefined && appliedFilters.minRating > 0 && (
            <Badge key="rating" variant="secondary" className="flex items-center gap-1">
              Min Rating: {appliedFilters.minRating}
              <Star className="h-3 w-3" />
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('minRating', undefined)}
              />
            </Badge>
          )}

          {appliedFilters.zipCode && (
            <Badge key="zipcode" variant="secondary" className="flex items-center gap-1">
              ZIP: {appliedFilters.zipCode}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('zipCode', '')}
              />
            </Badge>
          )}

          {appliedFilters.city && (
            <Badge key="city" variant="secondary" className="flex items-center gap-1">
              City: {appliedFilters.city}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('city', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantFilters;
