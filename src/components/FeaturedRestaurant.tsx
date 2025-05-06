
import { Link } from 'react-router-dom';
import { Restaurant } from '@/data/restaurants';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturedRestaurantProps {
  restaurant: Restaurant;
}

const FeaturedRestaurant = ({ restaurant }: FeaturedRestaurantProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
        <div className="relative h-48">
          <img
            src={restaurant.images[0]} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <span className="bg-filipino-yellow text-filipino-brown text-xs font-semibold px-2 py-1 rounded-full">
              {restaurant.priceRange}
            </span>
            <span className="ml-2 bg-white text-filipino-blue text-xs font-semibold px-2 py-1 rounded-full">
              {restaurant.rating} ★
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{restaurant.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{restaurant.cuisine.join(", ")}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{restaurant.city}, {restaurant.region}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedRestaurant;
