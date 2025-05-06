
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RestaurantCard from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { Restaurant, getRestaurantById } from '@/data/restaurants';

const Favorites = () => {
  const { favorites } = useFavorites();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  
  useEffect(() => {
    const restaurants = favorites
      .map(id => getRestaurantById(id))
      .filter((restaurant): restaurant is Restaurant => restaurant !== undefined);
    
    setFavoriteRestaurants(restaurants);
  }, [favorites]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Favorite Restaurants</h1>
          
          {favoriteRestaurants.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-6">
                You have {favoriteRestaurants.length} favorite restaurant{favoriteRestaurants.length !== 1 ? 's' : ''}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 mb-2">No favorites yet</p>
              <p className="text-gray-400 mb-6">Start adding restaurants to your favorites!</p>
              <Link to="/restaurants">
                <Button>Browse Restaurants</Button>
              </Link>
            </div>
          )}
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

export default Favorites;
