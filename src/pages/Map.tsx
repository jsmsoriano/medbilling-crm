
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { restaurants } from '@/data/restaurants';
import { MapPin } from 'lucide-react';

const Map = () => {
  // Here we'd integrate with a proper map API like Google Maps or Mapbox
  // For now, we'll just create a simple placeholder
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Restaurant Map</h1>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Explore Filipino restaurants across the Philippines. Our interactive map will be coming soon!
              </p>
            </div>
            
            <div className="aspect-[16/9] bg-gray-100 w-full flex items-center justify-center">
              <div className="text-center px-4">
                <MapPin className="h-12 w-12 text-filipino-red mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Map View Coming Soon</p>
                <p className="text-gray-500 max-w-md mx-auto">
                  We're working on an interactive map to help you find Filipino restaurants near you. 
                  Check back soon for this feature!
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="font-semibold text-xl mb-4">Restaurant Locations</h2>
              <div className="space-y-4">
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="border-b pb-3">
                    <p className="font-medium">{restaurant.name}</p>
                    <p className="text-sm text-gray-600">
                      {restaurant.address}, {restaurant.city}, {restaurant.region}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-auto">
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

export default Map;
