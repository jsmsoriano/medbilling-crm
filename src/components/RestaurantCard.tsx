
import { Link } from 'react-router-dom';
import { Restaurant } from '@/data/restaurants';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
        <div className="relative h-40">
          <img
            src={restaurant.images[0]} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-white text-filipino-blue text-xs font-semibold px-2 py-1 rounded-full">
              {restaurant.rating} ★
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base mb-1 line-clamp-1">{restaurant.name}</h3>
            <span className="text-xs font-medium text-gray-600">{restaurant.priceRange}</span>
          </div>
          <p className="text-xs text-gray-600 mb-1 line-clamp-1">{restaurant.cuisine.join(", ")}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{restaurant.city}, {restaurant.region}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
