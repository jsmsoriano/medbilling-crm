
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FavoritesContextType = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load favorites from localStorage on init
    const savedFavorites = localStorage.getItem('restaurantFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('restaurantFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
