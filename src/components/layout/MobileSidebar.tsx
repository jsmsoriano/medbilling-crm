
import { NavigationGroup } from '@/config/navigation';
import MobileSidebarHeader from './MobileSidebarHeader';
import MobileSidebarAccountInfo from './MobileSidebarAccountInfo';
import MobileSidebarNavigation from './MobileSidebarNavigation';
import MobileSidebarFooter from './MobileSidebarFooter';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationGroups: NavigationGroup[];
}

const MobileSidebar = ({ isOpen, onClose, navigationGroups }: MobileSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-xs flex-col bg-gradient-to-b from-white to-gray-50/50 h-full shadow-2xl">
        <div className="flex flex-col h-full backdrop-blur-sm">
          <MobileSidebarHeader onClose={onClose} />
          <MobileSidebarAccountInfo />
          <MobileSidebarNavigation 
            navigationGroups={navigationGroups} 
            onClose={onClose} 
          />
          <MobileSidebarFooter />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
