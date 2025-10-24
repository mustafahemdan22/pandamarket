import { Product } from '@/store/cartSlice';

export const sampleProducts: Product[] = [
  // Bakery Products
  {
    id: '1',
    name: 'Fresh White Bread',
    price: 2.50,
    image: '/api/placeholder/300/200',
    category: 'bakery',
    description: 'Freshly baked white bread, perfect for breakfast and sandwiches',
    stock: 50
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 3.00,
    image: '/api/placeholder/300/200',
    category: 'bakery',
    description: 'Healthy whole wheat bread with rich fiber content',
    stock: 30
  },
  {
    id: '3',
    name: 'Croissant',
    price: 1.50,
    image: '/api/placeholder/300/200',
    category: 'bakery',
    description: 'Buttery and flaky croissant, perfect with coffee',
    stock: 25
  },

  // Spices
  {
    id: '4',
    name: 'Black Pepper',
    price: 4.50,
    image: '/api/placeholder/300/200',
    category: 'spices',
    description: 'Premium black pepper for enhanced flavor',
    stock: 40
  },
  {
    id: '5',
    name: 'Cumin Seeds',
    price: 3.75,
    image: '/api/placeholder/300/200',
    category: 'spices',
    description: 'Aromatic cumin seeds for authentic taste',
    stock: 35
  },
  {
    id: '6',
    name: 'Turmeric Powder',
    price: 2.25,
    image: '/api/placeholder/300/200',
    category: 'spices',
    description: 'Pure turmeric powder with health benefits',
    stock: 45
  },

  // Dry Grocery
  {
    id: '7',
    name: 'Basmati Rice',
    price: 8.99,
    image: '/api/placeholder/300/200',
    category: 'dry-grocery',
    description: 'Premium basmati rice, 5kg bag',
    stock: 20
  },
  {
    id: '8',
    name: 'Pasta Spaghetti',
    price: 3.25,
    image: '/api/placeholder/300/200',
    category: 'dry-grocery',
    description: 'High-quality spaghetti pasta, 500g',
    stock: 60
  },
  {
    id: '9',
    name: 'Lentils',
    price: 2.80,
    image: '/api/placeholder/300/200',
    category: 'dry-grocery',
    description: 'Red lentils, rich in protein and fiber',
    stock: 40
  },

  // Cleaning Products
  {
    id: '10',
    name: 'Dish Soap',
    price: 4.50,
    image: '/api/placeholder/300/200',
    category: 'cleaning',
    description: 'Effective dish soap for all types of dishes',
    stock: 30
  },
  {
    id: '11',
    name: 'Laundry Detergent',
    price: 12.99,
    image: '/api/placeholder/300/200',
    category: 'cleaning',
    description: 'Powerful laundry detergent, 3L bottle',
    stock: 15
  },
  {
    id: '12',
    name: 'All-Purpose Cleaner',
    price: 6.75,
    image: '/api/placeholder/300/200',
    category: 'cleaning',
    description: 'Versatile cleaner for all surfaces',
    stock: 25
  },

  // Bazaar
  {
    id: '13',
    name: 'Olive Oil',
    price: 15.99,
    image: '/api/placeholder/300/200',
    category: 'bazaar',
    description: 'Extra virgin olive oil, 1L bottle',
    stock: 20
  },
  {
    id: '14',
    name: 'Honey',
    price: 9.50,
    image: '/api/placeholder/300/200',
    category: 'bazaar',
    description: 'Pure natural honey, 500g jar',
    stock: 18
  },
  {
    id: '15',
    name: 'Mixed Nuts',
    price: 12.25,
    image: '/api/placeholder/300/200',
    category: 'bazaar',
    description: 'Premium mixed nuts, 500g pack',
    stock: 22
  },

  // Vegetables
  {
    id: '16',
    name: 'Fresh Tomatoes',
    price: 2.99,
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    description: 'Fresh red tomatoes, per kg',
    stock: 50
  },
  {
    id: '17',
    name: 'Carrots',
    price: 1.75,
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    description: 'Fresh carrots, per kg',
    stock: 40
  },
  {
    id: '18',
    name: 'Bell Peppers',
    price: 3.50,
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    description: 'Colorful bell peppers, per kg',
    stock: 30
  },
  {
    id: '19',
    name: 'Spinach',
    price: 2.25,
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    description: 'Fresh spinach leaves, per bunch',
    stock: 35
  },
  {
    id: '20',
    name: 'Onions',
    price: 1.50,
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    description: 'Fresh onions, per kg',
    stock: 60
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return sampleProducts.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return sampleProducts.find(product => product.id === id);
};
