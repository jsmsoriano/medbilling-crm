
import { Shuffle } from 'lucide-react';

const PickForMeHeader = () => {
  return (
    <div className="bg-filipino-red text-white p-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Shuffle className="h-6 w-6 mr-2" /> 
        What are you in the mood for?
      </h1>
      <p className="mt-2 text-white/90">
        Let us pick the perfect Filipino restaurant for you!
      </p>
    </div>
  );
};

export default PickForMeHeader;
