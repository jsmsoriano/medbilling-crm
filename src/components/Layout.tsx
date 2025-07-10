import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSubscription } from '@/hooks/useSubscription';
import { getFilteredNavigation } from '@/config/navigation';
import LayoutHeader from './layout/LayoutHeader';
import MobileHeader from './layout/MobileHeader';
import MobileSidebar from './layout/MobileSidebar';
import DesktopSidebar from './layout/DesktopSidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { subscriptionTier, loading } = useSubscription();

  // Get filtered navigation based on user's subscription
  const navigationGroups = getFilteredNavigation(subscriptionTier);
  
  // Flatten for legacy components that expect simple array
  const flatNavigation = navigationGroups.flatMap(group => group.items);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Fixed header only for mobile */}
      {isMobile && <MobileHeader />}
      
      {/* Mobile sidebar overlay */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigationGroups={navigationGroups}
      />

      {/* Main layout container - flexbox for sidebar and content */}
      <div className="flex w-full">
        {/* Desktop sidebar - fixed width, not positioned */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <DesktopSidebar navigationGroups={navigationGroups} />
          </div>
        )}

        {/* Main content area - takes remaining space */}
        <div className="flex-1 min-w-0">
          {/* Header spacer only for mobile */}
          {isMobile && <div className="h-16 flex-shrink-0"></div>}
          
          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;