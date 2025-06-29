
import { useState } from 'react';
import CredentialingDashboard from '@/components/credentialing/CredentialingDashboard';

// Mock applications data for demonstration
const mockApplications = [
  {
    id: '1',
    status: 'pending_documents',
    priority: 'urgent',
    insurance_company: 'Blue Cross Blue Shield',
    application_date: '2024-01-15',
    credentialing_doctors: {
      first_name: 'John',
      last_name: 'Smith',
      specialty: 'Cardiology'
    }
  },
  {
    id: '2',
    status: 'approved',
    priority: 'normal',
    insurance_company: 'Aetna',
    application_date: '2024-01-10',
    credentialing_doctors: {
      first_name: 'Sarah',
      last_name: 'Johnson',
      specialty: 'Family Medicine'
    }
  },
  {
    id: '3',
    status: 'under_review',
    priority: 'urgent',
    insurance_company: 'United Healthcare',
    application_date: '2024-01-08',
    credentialing_doctors: {
      first_name: 'Michael',
      last_name: 'Brown',
      specialty: 'Pediatrics'
    }
  }
];

const Credentialing = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold text-gray-900">Provider Credentialing</h1>
        <p className="text-gray-600 mt-2">Manage provider credentials and insurance applications</p>
      </div>
      
      <CredentialingDashboard applications={mockApplications} />
    </div>
  );
};

export default Credentialing;
