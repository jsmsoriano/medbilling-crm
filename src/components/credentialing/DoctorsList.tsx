
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Eye, Edit, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface Doctor {
  id: string;
  npi_number: string;
  first_name: string;
  last_name: string;
  specialty: string;
  license_number: string;
  license_state: string;
  license_expiry: string;
  email: string;
  phone: string;
  created_at: string;
}

interface DoctorsListProps {
  doctors: Doctor[];
  loading: boolean;
  onRefresh: () => void;
}

const DoctorsList = ({ doctors, loading, onRefresh }: DoctorsListProps) => {
  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(now.getMonth() + 6);
    
    return expiry <= sixMonthsFromNow;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading doctors...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctors Database</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>NPI Number</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>License</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <div className="font-medium">
                    {doctor.first_name} {doctor.last_name}
                  </div>
                </TableCell>
                <TableCell className="font-mono">{doctor.npi_number}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {doctor.license_number} ({doctor.license_state})
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{format(new Date(doctor.license_expiry), 'MMM dd, yyyy')}</span>
                    {isLicenseExpiringSoon(doctor.license_expiry) && (
                      <Badge variant="destructive">Expiring Soon</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{doctor.email}</div>
                    <div className="text-muted-foreground">{doctor.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {doctors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No doctors found. Add your first doctor to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorsList;
