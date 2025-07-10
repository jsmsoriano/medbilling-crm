
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
    <div className="h-screen bg-background w-full max-w-full">
      <MobileHeader />
      
      {/* Main content with proper alignment */}
      <main className="pt-16 pb-4 h-full w-full max-w-full">
        <div className="w-full max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MobileLayout;
