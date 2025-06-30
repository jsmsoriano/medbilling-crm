
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
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      {/* Main content with mobile padding and proper overflow handling */}
      <main className="pt-16 pb-4 min-h-screen">
        <div className="px-4 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;
