
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Utensils } from 'lucide-react';

const WelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedPinoyEats');
    if (!hasVisited && window.location.pathname === '/') {
      setOpen(true);
      localStorage.setItem('hasVisitedPinoyEats', 'true');
    }
  }, []);

  const handlePickForMe = () => {
    setOpen(false);
    navigate('/pick-for-me');
  };

  const handleBrowse = () => {
    setOpen(false);
    navigate('/restaurants');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-center mb-2">
            <span className="text-filipino-red">What are you in the mood for?</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome to PinoyEats! Let us help you discover delicious Filipino cuisine.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <Button 
            onClick={handlePickForMe}
            className="flex flex-col items-center justify-center h-32 bg-filipino-red hover:bg-filipino-red/90"
          >
            <Utensils className="h-8 w-8 mb-2" />
            <span className="font-semibold">Pick For Me</span>
            <span className="text-xs mt-1">Get a recommendation</span>
          </Button>
          
          <Button 
            onClick={handleBrowse}
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 border-2"
          >
            <Search className="h-8 w-8 mb-2" />
            <span className="font-semibold">Browse Restaurants</span>
            <span className="text-xs mt-1">Explore all options</span>
          </Button>
        </div>
        
        <DialogFooter className="flex justify-center sm:justify-center">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
