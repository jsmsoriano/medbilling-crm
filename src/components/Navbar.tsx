
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
              <span className="text-blue-600 font-bold text-6xl">Medical</span>
              <span className="text-gray-700 font-bold text-6xl ml-2">Billing</span>
              <span className="text-green-600 ml-3 text-4xl">⚕️</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/clients" className="text-gray-700 hover:text-blue-600 font-medium">Clients</Link>
            <Link to="/pipeline" className="text-gray-700 hover:text-blue-600 font-medium">Pipeline</Link>
            <Link to="/reports" className="text-gray-700 hover:text-blue-600 font-medium">Reports</Link>
            <Link to="/settings" className="text-gray-700 hover:text-blue-600 font-medium">Settings</Link>
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
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/clients" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Clients
            </Link>
            <Link 
              to="/pipeline" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Pipeline
            </Link>
            <Link 
              to="/reports" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Reports
            </Link>
            <Link 
              to="/settings" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
