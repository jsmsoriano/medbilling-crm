
import Navbar from '@/components/Navbar';
import PickForMeHeader from '@/components/PickForMe/PickForMeHeader';
import CuisineSelection from '@/components/PickForMe/CuisineSelection';
import PriceRangeSelection from '@/components/PickForMe/PriceRangeSelection';
import LocationInput from '@/components/PickForMe/LocationInput';
import PickButton from '@/components/PickForMe/PickButton';
import PickForMeFooter from '@/components/PickForMe/PickForMeFooter';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <PickForMeHeader />
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <CuisineSelection 
                  selectedCuisines={selectedCuisines}
                  onCuisineToggle={handleCuisineToggle}
                />
                
                <PriceRangeSelection 
                  priceRange={priceRange}
                  onPriceToggle={handlePriceToggle}
                />
                
                <LocationInput 
                  location={location}
                  onLocationChange={setLocation}
                />
                
                <PickButton 
                  loading={loading}
                  onSubmit={handleSubmit}
                />
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <PickForMeFooter />
    </div>
  );
};

export default PickForMe;
