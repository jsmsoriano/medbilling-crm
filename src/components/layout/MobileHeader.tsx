
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MobileNavigation from './MobileNavigation';

const MobileHeader = () => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 safe-area-inset-top">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 flex-shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <MobileNavigation />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-gray-900 truncate min-w-0">
            MedBilling CRM
          </h1>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
