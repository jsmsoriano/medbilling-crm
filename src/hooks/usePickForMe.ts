
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getRandomRestaurant } from '@/data/restaurants';

export const usePickForMe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handlePriceToggle = (price: string) => {
    setPriceRange(prev =>
      prev.includes(price)
        ? prev.filter(p => p !== price)
        : [...prev, price]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        const randomRestaurant = getRandomRestaurant(
          selectedCuisines.length > 0 ? selectedCuisines : undefined,
          priceRange.length > 0 ? priceRange : undefined,
          location || undefined
        );

        toast({
          title: "We've found a restaurant for you!",
          description: `How about trying ${randomRestaurant.name}?`,
        });

        // Navigate to the restaurant detail page
        navigate(`/restaurant/${randomRestaurant.id}`);
      } catch (error) {
        toast({
          title: "Oops!",
          description: "Couldn't find a restaurant matching your preferences. Try different criteria.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }, 1000); // Simulate loading for better UX
  };

  return {
    location,
    setLocation,
    selectedCuisines,
    priceRange,
    loading,
    handleCuisineToggle,
    handlePriceToggle,
    handleSubmit,
  };
};
