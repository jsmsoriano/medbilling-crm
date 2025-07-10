
import { useState } from 'react';
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
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Conditional headers based on device type */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <LayoutHeader onMobileMenuToggle={() => setSidebarOpen(true)} />
      )}
      
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigationGroups={navigationGroups}
      />

      {!isMobile && <DesktopSidebar navigationGroups={navigationGroups} />}

      {/* Main content - full height with proper overflow handling */}
      <div className={`flex-1 flex flex-col ${!isMobile ? 'pt-16' : 'pt-16'} overflow-hidden`}>
        <main className={`flex-1 ${isMobile ? 'px-4 pb-4' : 'p-6'} overflow-y-auto`}>
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
