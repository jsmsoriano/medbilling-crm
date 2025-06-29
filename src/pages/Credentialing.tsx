
import CredentialingDashboard from '@/components/credentialing/CredentialingDashboard';

const Credentialing = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold text-gray-900">Provider Credentialing</h1>
        <p className="text-gray-600 mt-2">Manage provider credentials and insurance applications</p>
      </div>
      
      <CredentialingDashboard />
    </div>
  );
};

export default Credentialing;
