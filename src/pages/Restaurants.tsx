
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchInput from '@/components/SearchInput';
import RestaurantCard from '@/components/RestaurantCard';
import RestaurantFilters from '@/components/RestaurantFilters';
import { getFilteredRestaurants, Restaurant } from '@/data/restaurants';

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState({
    cuisine: [] as string[],
    priceRange: [] as string[],
    region: [] as string[]
  });
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  
  // Initialize from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    const cuisineFromUrl = searchParams.get('cuisine') || '';
    const regionFromUrl = searchParams.get('region') || '';
    
    setSearchTerm(searchFromUrl);
    
    const newFilters = { ...filters };
    if (cuisineFromUrl) {
      newFilters.cuisine = [cuisineFromUrl];
    }
    if (regionFromUrl) {
      newFilters.region = [regionFromUrl];
    }
    
    setFilters(newFilters);
  }, [searchParams]);
  
  // Update filtered restaurants when search/filters change
  useEffect(() => {
    const results = getFilteredRestaurants(
      searchTerm, 
      filters.cuisine, 
      filters.priceRange,
      filters.region
    );
    
    setFilteredRestaurants(results);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (filters.cuisine.length === 1) newSearchParams.set('cuisine', filters.cuisine[0]);
    if (filters.region.length === 1) newSearchParams.set('region', filters.region[0]);
    
    setSearchParams(newSearchParams);
  }, [searchTerm, filters, setSearchParams]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (type: 'cuisine' | 'priceRange' | 'region', value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      cuisine: [],
      priceRange: [],
      region: []
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Restaurants</h1>
            
            <div className="md:flex md:justify-between md:items-start gap-4">
              <div className="mb-6 md:mb-0 w-full md:max-w-md">
                <SearchInput 
                  fullWidth
                  placeholder="Search restaurants..." 
                  onSearch={handleSearch}
                />
              </div>
              
              <RestaurantFilters 
                appliedFilters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
          
          {filteredRestaurants.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 mb-2">No restaurants found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-filipino-red font-bold text-xl">Pinoy</span>
                <span className="text-filipino-blue font-bold text-xl">Eats</span>
                <span className="text-filipino-yellow ml-2">🍽️</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">© 2025 PinoyEats. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-filipino-red">Home</a>
              <a href="/restaurants" className="text-gray-600 hover:text-filipino-red">Restaurants</a>
              <a href="/map" className="text-gray-600 hover:text-filipino-red">Map</a>
              <a href="/favorites" className="text-gray-600 hover:text-filipino-red">Favorites</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Restaurants;
