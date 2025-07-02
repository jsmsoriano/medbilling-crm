
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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

      {/* Main content - adjusted for mobile with proper overflow handling */}
      <div className={`pt-16 ${!isMobile ? 'lg:pl-64' : ''} min-h-screen`}>
        <main className={`${isMobile ? 'px-4 pb-4' : ''} max-w-full overflow-x-hidden`}>
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
