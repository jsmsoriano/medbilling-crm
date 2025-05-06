
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import SearchInput from '@/components/SearchInput';
import FeaturedRestaurant from '@/components/FeaturedRestaurant';
import { restaurants } from '@/data/restaurants';

const Index = () => {
  // Get featured restaurants for the homepage
  const featuredRestaurants = restaurants.filter(restaurant => restaurant.featured);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative hero-pattern">
        <div className="absolute inset-0 bg-filipino-red/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover the Best 
              <span className="text-filipino-red"> Filipino </span>
              Restaurants
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore authentic Filipino cuisine across the Philippines, from traditional recipes to modern fusion dishes.
            </p>
            
            <SearchInput />
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/restaurants?region=Metro Manila">
                <Button variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Metro Manila
                </Button>
              </Link>
              <Link to="/restaurants?region=Cebu">
                <Button variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Cebu
                </Button>
              </Link>
              <Link to="/restaurants?cuisine=Traditional Filipino">
                <Button variant="outline">Traditional</Button>
              </Link>
              <Link to="/restaurants?cuisine=Street Food">
                <Button variant="outline">Street Food</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <FeaturedRestaurant key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/restaurants">
              <Button>View All Restaurants</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-12 bg-filipino-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover Filipino Cuisine</h2>
              <p className="text-gray-600 mb-6">
                Filipino cuisine is a vibrant tapestry of flavors influenced by Malay, Spanish, Chinese, and American culinary traditions. 
                From savory adobo to sweet halo-halo, each dish tells a story of the Philippines' rich cultural heritage.
              </p>
              <p className="text-gray-600">
                Our mission is to help you discover the best Filipino restaurants across the islands, 
                whether you're craving traditional home cooking or innovative fusion creations.
              </p>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19" 
                  alt="Filipino cuisine" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1604573714289-312a6972f67c" 
                  alt="Filipino cuisine" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1565958011355-f9f858dbd307" 
                  alt="Filipino cuisine" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
              <Link to="/" className="text-gray-600 hover:text-filipino-red">Home</Link>
              <Link to="/restaurants" className="text-gray-600 hover:text-filipino-red">Restaurants</Link>
              <Link to="/map" className="text-gray-600 hover:text-filipino-red">Map</Link>
              <Link to="/favorites" className="text-gray-600 hover:text-filipino-red">Favorites</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
