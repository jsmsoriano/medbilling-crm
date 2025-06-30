
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
      
      {/* Main content with mobile padding */}
      <main className="pt-16 pb-4">
        <div className="px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;
