
import PickForMeHeader from '@/components/PickForMe/PickForMeHeader';
import LocationInput from '@/components/PickForMe/LocationInput';
import CuisineSelection from '@/components/PickForMe/CuisineSelection';
import PriceRangeSelection from '@/components/PickForMe/PriceRangeSelection';
import PickButton from '@/components/PickForMe/PickButton';
import { usePickForMe } from '@/hooks/usePickForMe';

const PickForMe = () => {
  const {
    location,
    setLocation,
    selectedCuisines,
    priceRange,
    loading,
    handleCuisineToggle,
    handlePriceToggle,
    handleSubmit,
  } = usePickForMe();

  return (
    <div className="min-h-screen bg-gray-50">
      <PickForMeHeader />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <LocationInput 
            location={location} 
            onLocationChange={setLocation} 
          />
          
          <CuisineSelection 
            selectedCuisines={selectedCuisines}
            onCuisineToggle={handleCuisineToggle}
          />
          
          <PriceRangeSelection 
            priceRange={priceRange}
            onPriceToggle={handlePriceToggle}
          />
          
          <PickButton 
            loading={loading} 
            onSubmit={() => handleSubmit(new Event('submit') as any)}
          />
        </form>
      </div>
    </div>
  );
};

export default PickForMe;
