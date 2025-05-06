
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
  isFranchise: boolean;
  reviews: Review[] | null;
  designations: string[];
  isGlobal: boolean;
  country: string;
  zipCode: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
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

export const designationTypes = [
  "Michelin Star",
  "Bib Gourmand",
  "Local Favorite",
  "Award-Winning",
  "Historical",
];

export const countries = [
  "Philippines",
  "United States",
  "Canada",
  "Australia",
  "United Kingdom",
  "Singapore",
  "UAE",
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
    featured: true,
    isFranchise: true,
    reviews: [
      {
        id: "r1-1",
        userName: "Maria L.",
        rating: 5,
        comment: "Best sisig in Manila! Love their house crispy sisig. Very flavorful!",
        date: "2025-04-15"
      },
      {
        id: "r1-2",
        userName: "John D.",
        rating: 4.5,
        comment: "Great twist on Filipino classics. The watermelon sinigang is amazing!",
        date: "2025-03-22"
      }
    ],
    designations: ["Local Favorite"],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1634"
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
    featured: true,
    isFranchise: true,
    reviews: [
      {
        id: "r2-1",
        userName: "Paolo M.",
        rating: 4,
        comment: "Authentic Filipino flavors. Their crispy pata is to die for!",
        date: "2025-04-02"
      }
    ],
    designations: [],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1300"
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
    featured: false,
    isFranchise: false,
    reviews: [
      {
        id: "r3-1",
        userName: "Sofia R.",
        rating: 4.3,
        comment: "Beautiful ambiance with old Manila charm. Love their Filipino breakfast!",
        date: "2025-03-30"
      }
    ],
    designations: ["Historical"],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1004"
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
    featured: true,
    isFranchise: true,
    reviews: [
      {
        id: "r4-1",
        userName: "Mike T.",
        rating: 5,
        comment: "Best chicken inasal outside of Bacolod! So flavorful and juicy.",
        date: "2025-04-10"
      }
    ],
    designations: ["Local Favorite"],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1100"
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
    featured: false,
    isFranchise: false,
    reviews: [
      {
        id: "r5-1",
        userName: "Anton P.",
        rating: 4.5,
        comment: "Fresh seafood with excellent Filipino-style cooking. Great value!",
        date: "2025-03-25"
      }
    ],
    designations: [],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1308"
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
    featured: false,
    isFranchise: true,
    reviews: [
      {
        id: "r6-1",
        userName: "Elena C.",
        rating: 4.5,
        comment: "Historic restaurant with consistently good food. Their java rice is legendary!",
        date: "2025-03-14"
      }
    ],
    designations: ["Historical"],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1000"
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
    featured: false,
    isFranchise: true,
    reviews: [
      {
        id: "r7-1",
        userName: "Camila R.",
        rating: 5,
        comment: "Best crispy dinuguan ever! Their rice dishes are amazing too.",
        date: "2025-04-05"
      }
    ],
    designations: ["Local Favorite"],
    isGlobal: false,
    country: "Philippines",
    zipCode: "1780"
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
    featured: false,
    isFranchise: false,
    reviews: [
      {
        id: "r8-1",
        userName: "Lito S.",
        rating: 4.7,
        comment: "Best halo-halo in La Union! Authentic Ilocano flavors.",
        date: "2025-03-18"
      }
    ],
    designations: ["Local Favorite"],
    isGlobal: false,
    country: "Philippines",
    zipCode: "2500"
  },
  {
    id: "9",
    name: "Jollibee Times Square",
    cuisine: ["Fast Food", "Filipino Fusion"],
    rating: 4.2,
    priceRange: "₱",
    address: "1500 Broadway, New York",
    city: "New York",
    region: "NY",
    phone: "+1 (212) 398-2367",
    openHours: "8:00 AM - 11:00 PM",
    description: "Popular Filipino fast-food chain with international presence, known for Chickenjoy and Jolly Spaghetti.",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1593234270323-0b3cce8723a6"
    ],
    coordinates: {
      lat: 40.7580,
      lng: -73.9855
    },
    featured: true,
    isFranchise: true,
    reviews: [
      {
        id: "r9-1",
        userName: "Sarah L.",
        rating: 4.0,
        comment: "Taste of home in the heart of NYC! Love the Chickenjoy.",
        date: "2025-04-01"
      }
    ],
    designations: [],
    isGlobal: true,
    country: "United States",
    zipCode: "10036"
  },
  {
    id: "10",
    name: "Purple Yam",
    cuisine: ["Filipino Fusion", "Traditional Filipino"],
    rating: 4.7,
    priceRange: "₱₱₱",
    address: "1314 Cortelyou Rd, Brooklyn",
    city: "New York",
    region: "NY",
    phone: "+1 (718) 940-8188",
    openHours: "5:00 PM - 10:00 PM",
    description: "Upscale Filipino restaurant offering innovative takes on classic dishes using seasonal ingredients.",
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2"
    ],
    coordinates: {
      lat: 40.6408,
      lng: -73.9664
    },
    featured: false,
    isFranchise: false,
    reviews: [
      {
        id: "r10-1",
        userName: "David W.",
        rating: 5,
        comment: "Incredible Filipino cuisine with a modern twist. The ukoy and kare-kare are outstanding!",
        date: "2025-03-28"
      }
    ],
    designations: ["Bib Gourmand"],
    isGlobal: true,
    country: "United States",
    zipCode: "11226"
  },
  {
    id: "11",
    name: "Kasama",
    cuisine: ["Filipino Fusion", "Bakery"],
    rating: 4.9,
    priceRange: "₱₱₱",
    address: "1001 N Winchester Ave, Chicago",
    city: "Chicago",
    region: "IL",
    phone: "+1 (773) 697-3790",
    openHours: "9:00 AM - 10:00 PM",
    description: "Modern Filipino restaurant and bakery that transforms into a tasting menu at night. Known for innovative dishes.",
    images: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2",
      "https://images.unsplash.com/photo-1593234270323-0b3cce8723a6"
    ],
    coordinates: {
      lat: 41.8996,
      lng: -87.6768
    },
    featured: false,
    isFranchise: false,
    reviews: [
      {
        id: "r11-1",
        userName: "Lisa K.",
        rating: 5,
        comment: "Michelin-starred Filipino food that's absolutely incredible. The longanisa breakfast sandwich is perfect.",
        date: "2025-04-11"
      }
    ],
    designations: ["Michelin Star"],
    isGlobal: true,
    country: "United States",
    zipCode: "60622"
  }
];

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

export const getFilteredRestaurants = (
  searchTerm?: string,
  cuisineFilter?: string[],
  priceRangeFilter?: string[],
  regionFilter?: string[],
  franchiseFilter?: boolean | null,
  designationFilter?: string[],
  countryFilter?: string[],
  minRatingFilter?: number,
  zipCodeFilter?: string,
  cityFilter?: string
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
    
    // Franchise filter
    if (franchiseFilter !== null) {
      if (restaurant.isFranchise !== franchiseFilter) return false;
    }
    
    // Designation filter
    if (designationFilter && designationFilter.length > 0) {
      const hasMatchingDesignation = restaurant.designations.some(d => 
        designationFilter.includes(d)
      );
      if (!hasMatchingDesignation) return false;
    }
    
    // Country filter
    if (countryFilter && countryFilter.length > 0) {
      if (!countryFilter.includes(restaurant.country)) return false;
    }
    
    // Minimum rating filter
    if (minRatingFilter !== undefined) {
      if (restaurant.rating < minRatingFilter) return false;
    }
    
    // Zip code filter
    if (zipCodeFilter) {
      if (!restaurant.zipCode.includes(zipCodeFilter)) return false;
    }
    
    // City filter
    if (cityFilter) {
      if (!restaurant.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    }
    
    return true;
  });
};

// Return a random restaurant based on user preferences
export const getRandomRestaurant = (
  cuisinePreference?: string[],
  priceRangePreference?: string[],
  locationPreference?: string
): Restaurant => {
  // Filter restaurants based on preferences
  let filteredRestaurants = restaurants;
  
  if (cuisinePreference && cuisinePreference.length > 0) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.cuisine.some(cuisine => cuisinePreference.includes(cuisine))
    );
  }
  
  if (priceRangePreference && priceRangePreference.length > 0) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      priceRangePreference.includes(restaurant.priceRange)
    );
  }
  
  if (locationPreference) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.city.toLowerCase().includes(locationPreference.toLowerCase()) ||
      restaurant.region.toLowerCase().includes(locationPreference.toLowerCase()) ||
      restaurant.country.toLowerCase().includes(locationPreference.toLowerCase())
    );
  }
  
  // If no restaurants match the criteria, return all restaurants
  if (filteredRestaurants.length === 0) {
    filteredRestaurants = restaurants;
  }
  
  // Pick a random restaurant from the filtered list
  const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
  return filteredRestaurants[randomIndex];
};
