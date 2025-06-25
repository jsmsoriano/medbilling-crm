
import ClientOverview from '@/components/ClientOverview';
import RecentActivity from '@/components/RecentActivity';

const DashboardBottomSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ClientOverview />
      <RecentActivity />
    </div>
  );
};

export default DashboardBottomSection;
