interface MobileSidebarHeaderProps {
  onClose: () => void;
}

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileSidebarHeader = ({ onClose }: MobileSidebarHeaderProps) => {
  return (
    <>
      <div className="absolute right-0 top-0 -mr-12 pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center px-4 py-6 border-b">
        <img
          src="/lovable-uploads/98e62fe8-89f3-4c17-82c9-a872ff6e2d36.png"
          alt="Excel Medical Billing"
          className="h-10 w-auto"
        />
      </div>
    </>
  );
};

export default MobileSidebarHeader;