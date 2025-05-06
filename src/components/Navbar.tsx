
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-filipino-red font-bold text-xl">Pinoy</span>
              <span className="text-filipino-blue font-bold text-xl">Eats</span>
              <span className="text-filipino-yellow ml-2">🍽️</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-filipino-red font-medium">Home</Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-filipino-red font-medium">Restaurants</Link>
            <Link to="/map" className="text-gray-700 hover:text-filipino-red font-medium">Map</Link>
            <Link to="/favorites" className="text-gray-700 hover:text-filipino-red font-medium">Favorites</Link>
          </div>
          
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-filipino-beige"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-filipino-beige"
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link 
              to="/map" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-filipino-beige"
              onClick={() => setIsMenuOpen(false)}
            >
              Map
            </Link>
            <Link 
              to="/favorites" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-filipino-beige"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
