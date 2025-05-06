
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectGroup, 
  SelectLabel 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { getRandomRestaurant, cuisineTypes } from '@/data/restaurants';
import { Shuffle, MapPin, ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const PickForMe = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-filipino-red text-white p-6">
              <h1 className="text-2xl font-bold flex items-center">
                <Shuffle className="h-6 w-6 mr-2" /> 
                What are you in the mood for?
              </h1>
              <p className="mt-2 text-white/90">
                Let us pick the perfect Filipino restaurant for you!
              </p>
            </div>
            
            <div className="p-6">
              <Form>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Cuisine section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Cuisine Preference</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {cuisineTypes.map((cuisine) => (
                        <div 
                          key={cuisine} 
                          className={`
                            border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer
                            ${selectedCuisines.includes(cuisine) ? 'bg-filipino-blue/10 border-filipino-blue' : 'border-gray-200'}
                          `}
                          onClick={() => handleCuisineToggle(cuisine)}
                        >
                          <Checkbox 
                            id={cuisine} 
                            checked={selectedCuisines.includes(cuisine)}
                            onCheckedChange={() => {}}
                          />
                          <label htmlFor={cuisine} className="text-sm cursor-pointer flex-1">{cuisine}</label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Select multiple or none to include all cuisines</p>
                  </div>
                  
                  {/* Price Range section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Price Range</h3>
                    <div className="flex gap-3">
                      {["₱", "₱₱", "₱₱₱"].map((price) => (
                        <div 
                          key={price} 
                          className={`
                            border rounded-md px-8 py-2 flex items-center justify-center cursor-pointer
                            ${priceRange.includes(price) ? 'bg-filipino-blue/10 border-filipino-blue' : 'border-gray-200'}
                          `}
                          onClick={() => handlePriceToggle(price)}
                        >
                          <span className="text-sm font-medium">{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Location (Optional)</h3>
                    <div className="flex">
                      <div className="relative w-full">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, Region, or Country"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Leave empty to include all locations</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-filipino-red hover:bg-filipino-red/90"
                    disabled={loading}
                  >
                    {loading ? 'Finding the perfect spot...' : 'Pick For Me!'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
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

export default PickForMe;
