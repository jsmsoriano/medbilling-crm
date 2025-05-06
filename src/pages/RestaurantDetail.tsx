
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Heart, 
  ChevronLeft,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { getRestaurantById } from '@/data/restaurants';
import { useFavorites } from '@/context/FavoritesContext';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [restaurant, setRestaurant] = useState(id ? getRestaurantById(id) : undefined);
  const [selectedImage, setSelectedImage] = useState(restaurant?.images[0] || '');
  
  useEffect(() => {
    if (id) {
      const foundRestaurant = getRestaurantById(id);
      setRestaurant(foundRestaurant);
      if (foundRestaurant) {
        setSelectedImage(foundRestaurant.images[0]);
      }
    }
  }, [id]);
  
  if (!restaurant) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <p className="mb-8">The restaurant you're looking for doesn't exist or has been removed.</p>
          <Link to="/restaurants">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </>
    );
  }
  
  const isFav = isFavorite(restaurant.id);
  
  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(restaurant.id);
    } else {
      addFavorite(restaurant.id);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button and favorite */}
          <div className="flex justify-between items-center mb-6">
            <Link to="/restaurants" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to restaurants
            </Link>
            
            <Button
              variant={isFav ? "default" : "outline"}
              size="sm"
              onClick={toggleFavorite}
              className={`${isFav ? 'bg-filipino-red hover:bg-filipino-red/90' : ''} flex items-center gap-1`}
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-white' : ''}`} />
              {isFav ? 'Saved to Favorites' : 'Add to Favorites'}
            </Button>
          </div>
          
          {/* Restaurant header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-filipino-yellow fill-filipino-yellow" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span>{restaurant.cuisine.join(", ")}</span>
                <span className="text-gray-500">•</span>
                <span>{restaurant.priceRange}</span>
              </div>
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {restaurant.address}, {restaurant.city}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {restaurant.openHours}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {restaurant.phone}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Gallery */}
            <div className="lg:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="aspect-video overflow-hidden rounded-md mb-4">
                  <img 
                    src={selectedImage} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {restaurant.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-square rounded-md overflow-hidden cursor-pointer ${
                        image === selectedImage ? 'ring-2 ring-filipino-red' : ''
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${restaurant.name} image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-gray-600">{restaurant.description}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <div className="aspect-video bg-gray-200 rounded-md mb-4">
                  {/* Map placeholder - would be replaced with an actual map */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <MapPin className="h-6 w-6 mr-2" />
                    <span>Map view will be available soon</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Address:</span> {restaurant.address}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">City:</span> {restaurant.city}, {restaurant.region}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-8">
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

export default RestaurantDetail;
