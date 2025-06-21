
import { Checkbox } from '@/components/ui/checkbox';
import { cuisineTypes } from '@/data/restaurants';

interface CuisineSelectionProps {
  selectedCuisines: string[];
  onCuisineToggle: (cuisine: string) => void;
}

const CuisineSelection = ({ selectedCuisines, onCuisineToggle }: CuisineSelectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Cuisine Preference</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cuisineTypes.map((cuisine) => (
          <div 
            key={cuisine} 
            className={`
              border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer
              ${selectedCuisines.includes(cuisine) ? 'bg-filipino-blue/10 border-filipino-blue' : 'border-gray-200'}
            `}
            onClick={() => onCuisineToggle(cuisine)}
          >
            <Checkbox 
              id={cuisine} 
              checked={selectedCuisines.includes(cuisine)}
              onCheckedChange={() => {}}
            />
            <label htmlFor={cuisine} className="text-sm cursor-pointer flex-1">{cuisine}</label>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">Select multiple or none to include all cuisines</p>
    </div>
  );
};

export default CuisineSelection;
