
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const LocationInput = ({ location, onLocationChange }: LocationInputProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Location (Optional)</h3>
      <div className="flex">
        <div className="relative w-full">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="City, Region, or Country"
            className="pl-10"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">Leave empty to include all locations</p>
    </div>
  );
};

export default LocationInput;
