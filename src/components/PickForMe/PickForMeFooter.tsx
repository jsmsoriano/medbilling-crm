
const PickForMeFooter = () => {
  return (
    <footer className="bg-white border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="text-filipino-red font-bold text-xl">Pinoy</span>
              <span className="text-filipino-blue font-bold text-xl">Eats</span>
              <span className="text-filipino-yellow ml-2">🍽️</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">© 2025 PinoyEats. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-filipino-red">Home</a>
            <a href="/restaurants" className="text-gray-600 hover:text-filipino-red">Restaurants</a>
            <a href="/map" className="text-gray-600 hover:text-filipino-red">Map</a>
            <a href="/favorites" className="text-gray-600 hover:text-filipino-red">Favorites</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PickForMeFooter;
