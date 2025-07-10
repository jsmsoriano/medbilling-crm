import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSubscription } from '@/hooks/useSubscription';
import { getFilteredNavigation } from '@/config/navigation';
import LayoutHeader from './layout/LayoutHeader';
import MobileHeader from './layout/MobileHeader';
import MobileSidebar from './layout/MobileSidebar';
import DesktopSidebar from './layout/DesktopSidebar';

// Create context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean;
  toggleSidebar: () => void;
}>({
  isCollapsed: false,
  toggleSidebar: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { subscriptionTier, loading } = useSubscription();

  // Get filtered navigation based on user's subscription
  const navigationGroups = getFilteredNavigation(subscriptionTier);
  
  // Flatten for legacy components that expect simple array
  const flatNavigation = navigationGroups.flatMap(group => group.items);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const sidebarWidth = isCollapsed ? 'lg:ml-16' : 'lg:ml-56';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="min-h-screen bg-background flex w-full">
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

        {/* Main content - properly aligned with responsive sidebar */}
        <div className={`flex-1 flex flex-col min-h-0 w-full transition-all duration-300 ${!isMobile ? sidebarWidth : ''}`}>
          {/* Header spacer */}
          <div className="h-16 flex-shrink-0"></div>
          
          <main className="flex-1 w-full min-h-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;