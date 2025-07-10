
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from './MobileHeader';
import Layout from '../Layout';

const MobileLayout = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <Layout />;
  }

  return (
    <div className="h-screen bg-background overflow-hidden w-full">
      <MobileHeader />
      
      {/* Main content with mobile padding and proper overflow handling */}
      <main className="pt-16 pb-4 h-full overflow-y-auto overflow-x-hidden w-full">
        <div className="px-3 w-full max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;
