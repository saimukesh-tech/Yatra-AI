import type { Destination } from '@/types/trip'

export const mockDestinations: Destination[] = [
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Pearls, palaces and biryani',
    categories: ['History', 'Food', 'Culture'],
    sceneType: 'heritage',
    description:
      'A city of Nizams and pearls, where centuries-old monuments sit beside a booming tech skyline and some of the country’s best food.',
    bestFor: ['history', 'food', 'photography', 'shopping'],
    avgDailyBudget: 1800,
    popular: true,
  },
  {
    id: 'araku-valley',
    name: 'Araku Valley',
    state: 'Andhra Pradesh',
    tagline: 'Nature, culture, coffee',
    categories: ['Nature', 'Culture', 'Coffee'],
    sceneType: 'hills',
    description:
      'Misty hills, tribal culture and coffee plantations along a scenic train route through the Eastern Ghats.',
    bestFor: ['nature', 'photography', 'food'],
    avgDailyBudget: 2200,
    popular: true,
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    tagline: 'History, heritage, adventure',
    categories: ['History', 'Heritage', 'Adventure'],
    sceneType: 'heritage',
    description:
      'The boulder-strewn ruins of the Vijayanagara empire, a UNESCO World Heritage site made for slow wandering and sunset views.',
    bestFor: ['history', 'photography', 'adventure'],
    avgDailyBudget: 1600,
    popular: true,
  },
  {
    id: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    tagline: 'Backwaters, beaches, serenity',
    categories: ['Backwaters', 'Beaches', 'Serenity'],
    sceneType: 'backwaters',
    description:
      'Palm-fringed backwaters, houseboats and spice-scented hill towns — God’s Own Country at its calmest.',
    bestFor: ['nature', 'food', 'photography'],
    avgDailyBudget: 2800,
    popular: true,
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    state: 'Ladakh',
    tagline: 'Mountains, adventure, peace',
    categories: ['Mountains', 'Adventure', 'Peace'],
    sceneType: 'mountain',
    description:
      'High-altitude desert, turquoise lakes and ancient monasteries beneath some of the world’s highest motorable passes.',
    bestFor: ['adventure', 'nature', 'photography', 'spiritual'],
    avgDailyBudget: 3500,
    popular: true,
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    tagline: 'Temples, culture, food',
    categories: ['Temples', 'Culture', 'Food'],
    sceneType: 'temple',
    description:
      'One of India’s oldest living cities, built around the towering gopurams of the Meenakshi Amman Temple.',
    bestFor: ['spiritual', 'history', 'food'],
    avgDailyBudget: 1500,
    popular: true,
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    tagline: 'Beaches, sunsets, laid-back charm',
    categories: ['Beaches', 'Nightlife', 'Food'],
    sceneType: 'beach',
    description:
      'Golden beaches, Portuguese-era churches and a laid-back coastal rhythm that swings from quiet to lively after dark.',
    bestFor: ['nature', 'food', 'entertainment', 'shopping'],
    avgDailyBudget: 2600,
    popular: true,
  },
  {
    id: 'ooty',
    name: 'Ooty',
    state: 'Tamil Nadu',
    tagline: 'Tea gardens and cool hills',
    categories: ['Mountains', 'Nature', 'Gardens'],
    sceneType: 'hills',
    description:
      'The "Queen of the Nilgiris" — rolling tea estates, a toy train and cool hill-station air.',
    bestFor: ['nature', 'photography', 'adventure'],
    avgDailyBudget: 2100,
    popular: true,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Gardens, cafes, nightlife',
    categories: ['Culture', 'Food', 'Entertainment'],
    sceneType: 'city',
    description:
      'India’s garden city — leafy boulevards, craft breweries and a buzzing food and startup scene.',
    bestFor: ['food', 'entertainment', 'shopping'],
    avgDailyBudget: 2400,
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    tagline: 'Monuments, markets, history',
    categories: ['History', 'Heritage', 'Food'],
    sceneType: 'heritage',
    description:
      'Seven historic cities layered into one — Mughal forts, colonial boulevards and endless street food.',
    bestFor: ['history', 'food', 'shopping', 'photography'],
    avgDailyBudget: 2000,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Coastline, cinema, energy',
    categories: ['City', 'Culture', 'Food'],
    sceneType: 'city',
    description:
      'The city that never sleeps — colonial architecture, a dramatic coastline and the heart of Indian cinema.',
    bestFor: ['entertainment', 'food', 'shopping', 'photography'],
    avgDailyBudget: 2600,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Temples, shore, classical arts',
    categories: ['Culture', 'Beach', 'Food'],
    sceneType: 'temple',
    description:
      'Temple towns, the world’s second-longest urban beach and a deep-rooted classical arts scene.',
    bestFor: ['spiritual', 'food', 'nature'],
    avgDailyBudget: 1700,
  },
]

export const getDestinationById = (id: string): Destination | undefined =>
  mockDestinations.find((d) => d.id === id)

export const getDestinationByName = (name: string): Destination | undefined =>
  mockDestinations.find((d) => d.name.toLowerCase() === name.toLowerCase())
