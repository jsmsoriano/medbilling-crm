
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  priceRange: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  openHours: string;
  description: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  featured: boolean;
}

export const cuisineTypes = [
  "Traditional Filipino",
  "Fusion",
  "BBQ",
  "Seafood",
  "Street Food",
  "Desserts",
  "Vegan",
  "Regional",
];

export const regions = [
  "Metro Manila",
  "Calabarzon",
  "Central Luzon",
  "Western Visayas",
  "Central Visayas",
  "Davao Region",
  "Northern Mindanao",
];

// Sample restaurant data
export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Manam",
    cuisine: ["Traditional Filipino", "Fusion"],
    rating: 4.8,
    priceRange: "₱₱",
    address: "G/F Net Park Building, 5th Avenue, Bonifacio Global City",
    city: "Taguig",
    region: "Metro Manila",
    phone: "(02) 8478-3379",
    openHours: "11:00 AM - 10:00 PM",
    description: "Modern Filipino food with classic flavors and twists on traditional favorites.",
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99",
      "https://images.unsplash.com/photo-1593234270323-0b3cce8723a6"
    ],
    coordinates: {
      lat: 14.5508,
      lng: 121.0501
    },
    featured: true
  },
  {
    id: "2",
    name: "Barrio Fiesta",
    cuisine: ["Traditional Filipino"],
    rating: 4.5,
    priceRange: "₱₱",
    address: "SM Mall of Asia Complex, Pasay",
    city: "Pasay",
    region: "Metro Manila",
    phone: "(02) 8556-0732",
    openHours: "10:00 AM - 9:00 PM",
    description: "Classic Filipino cuisine with home-style cooking in a family-friendly atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae"
    ],
    coordinates: {
      lat: 14.5353,
      lng: 120.9827
    },
    featured: true
  },
  {
    id: "3",
    name: "Cafe Adriatico",
    cuisine: ["Traditional Filipino", "Fusion"],
    rating: 4.3,
    priceRange: "₱₱",
    address: "Remedios Circle, Malate",
    city: "Manila",
    region: "Metro Manila",
    phone: "(02) 8524-1213",
    openHours: "7:00 AM - 12:00 AM",
    description: "Historic Filipino cafe offering cultural cuisine since 1979 in a charming setting.",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae"
    ],
    coordinates: {
      lat: 14.5747,
      lng: 120.9897
    },
    featured: false
  },
  {
    id: "4",
    name: "Bacolod Chicken Inasal",
    cuisine: ["BBQ", "Regional"],
    rating: 4.7,
    priceRange: "₱",
    address: "SM North EDSA, Quezon City",
    city: "Quezon City",
    region: "Metro Manila",
    phone: "(02) 8332-4456",
    openHours: "10:00 AM - 9:00 PM",
    description: "Famous for authentic Bacolod-style grilled chicken with garlic rice.",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1564671546498-08e01012cb03"
    ],
    coordinates: {
      lat: 14.6566,
      lng: 121.0294
    },
    featured: true
  },
  {
    id: "5",
    name: "Dampa Seafood Grill",
    cuisine: ["Seafood", "Traditional Filipino"],
    rating: 4.6,
    priceRange: "₱₱",
    address: "Seaside Macapagal, Pasay City",
    city: "Pasay",
    region: "Metro Manila",
    phone: "(02) 8833-7859",
    openHours: "10:00 AM - 10:00 PM",
    description: "Fresh seafood market where you can select your catch and have it cooked to your liking.",
    images: [
      "https://images.unsplash.com/photo-1572715376701-98568319fd0b",
      "https://images.unsplash.com/photo-1598511726623-d2e9996892f0"
    ],
    coordinates: {
      lat: 14.5336,
      lng: 120.9857
    },
    featured: false
  },
  {
    id: "6",
    name: "Aristocrat Restaurant",
    cuisine: ["Traditional Filipino"],
    rating: 4.5,
    priceRange: "₱₱",
    address: "Roxas Boulevard, Manila",
    city: "Manila",
    region: "Metro Manila",
    phone: "(02) 8524-7671",
    openHours: "24 hours",
    description: "One of the oldest Filipino restaurants famous for its chicken barbecue and java rice.",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      "https://images.unsplash.com/photo-1516684732162-798a0062be99"
    ],
    coordinates: {
      lat: 14.5665,
      lng: 120.9927
    },
    featured: false
  },
  {
    id: "7",
    name: "Kanin Club",
    cuisine: ["Traditional Filipino", "Regional"],
    rating: 4.7,
    priceRange: "₱₱",
    address: "Westgate Center, Alabang",
    city: "Muntinlupa",
    region: "Metro Manila",
    phone: "(02) 8834-7336",
    openHours: "11:00 AM - 10:00 PM",
    description: "Known for crispy dinuguan and unique Filipino rice dishes served family style.",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2"
    ],
    coordinates: {
      lat: 14.4196,
      lng: 121.0171
    },
    featured: false
  },
  {
    id: "8",
    name: "Halo-Halo de Iloko",
    cuisine: ["Desserts", "Regional"],
    rating: 4.6,
    priceRange: "₱",
    address: "San Fernando, La Union",
    city: "San Fernando",
    region: "Ilocos Region",
    phone: "(072) 242-9044",
    openHours: "9:00 AM - 8:00 PM",
    description: "Famous for authentic Ilocano cuisine and their special halo-halo dessert.",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae"
    ],
    coordinates: {
      lat: 16.6159,
      lng: 120.3217
    },
    featured: false
  }
];

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

export const getFilteredRestaurants = (
  searchTerm?: string,
  cuisineFilter?: string[],
  priceRangeFilter?: string[],
  regionFilter?: string[]
): Restaurant[] => {
  return restaurants.filter(restaurant => {
    // Search term filter
    if (searchTerm && !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !restaurant.city.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Cuisine filter
    if (cuisineFilter && cuisineFilter.length > 0) {
      const hasMatchingCuisine = restaurant.cuisine.some(c => 
        cuisineFilter.includes(c)
      );
      if (!hasMatchingCuisine) return false;
    }
    
    // Price range filter
    if (priceRangeFilter && priceRangeFilter.length > 0) {
      if (!priceRangeFilter.includes(restaurant.priceRange)) return false;
    }
    
    // Region filter
    if (regionFilter && regionFilter.length > 0) {
      if (!regionFilter.includes(restaurant.region)) return false;
    }
    
    return true;
  });
};
