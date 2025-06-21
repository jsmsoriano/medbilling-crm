
interface PriceRangeSelectionProps {
  priceRange: string[];
  onPriceToggle: (price: string) => void;
}

const PriceRangeSelection = ({ priceRange, onPriceToggle }: PriceRangeSelectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Price Range</h3>
      <div className="flex gap-3">
        {["₱", "₱₱", "₱₱₱"].map((price) => (
          <div 
            key={price} 
            className={`
              border rounded-md px-8 py-2 flex items-center justify-center cursor-pointer
              ${priceRange.includes(price) ? 'bg-filipino-blue/10 border-filipino-blue' : 'border-gray-200'}
            `}
            onClick={() => onPriceToggle(price)}
          >
            <span className="text-sm font-medium">{price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeSelection;
