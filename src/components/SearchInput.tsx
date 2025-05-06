
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  fullWidth?: boolean;
  placeholder?: string;
  onSearch?: (term: string) => void;
}

const SearchInput = ({ 
  fullWidth = false, 
  placeholder = "Search restaurants, cuisine, or location...",
  onSearch
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${fullWidth ? 'w-full' : 'max-w-md'}`}
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-12 shadow-sm focus-visible:ring-filipino-red"
      />
      <Button 
        type="submit" 
        size="icon" 
        variant="ghost" 
        className="absolute right-0 h-full text-muted-foreground hover:text-primary"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default SearchInput;
