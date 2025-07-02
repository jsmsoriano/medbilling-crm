
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SubscriptionBadge } from '@/components/ui/subscription-badge';
import MobileNavigation from './MobileNavigation';
import { useState } from 'react';

const MobileHeader = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleNavigationClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 safe-area-inset-top">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 flex-shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <MobileNavigation onItemClick={handleNavigationClick} />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              MedBilling CRM
            </h1>
            <SubscriptionBadge showIcon={false} className="text-xs self-start" />
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
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
