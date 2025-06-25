
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface DashboardHeaderProps {
  showCustomizer: boolean;
  onToggleCustomizer: () => void;
}

const DashboardHeader = ({ showCustomizer, onToggleCustomizer }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Billing Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive overview of your practice's billing performance and analytics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onToggleCustomizer}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
