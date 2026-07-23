import { Product } from '../store/cartSlice';

function getLocalImages(categorySlug: string, productSlug: string, count: number = 4): string[] {
  return Array.from({ length: count }, (_, i) => 
    `/images/${categorySlug}/${productSlug}/${i + 1}.webp`
  );
}

export const sampleProducts: Product[] = [
  // ============================================
  // 🥛 DAIRY - الألبان
  // ============================================
  {
    id: 'dairy-1',
    name: 'حليب جهينة كامل الدسم 1 لتر',
    nameEn: 'Juhayna Full Cream Milk 1L',
    price: 22.00,
    image: '/images/dairy/juhayna-full-cream-milk-1l/1.webp',
    imagePublicId: 'pandamarket/categories/dairy-eggs/products/juhayna-full-cream-milk-1l/1',
    imagePublicIds: [
      'pandamarket/categories/dairy-eggs/products/juhayna-full-cream-milk-1l/1',
      'pandamarket/categories/dairy-eggs/products/juhayna-full-cream-milk-1l/2',
      'pandamarket/categories/dairy-eggs/products/juhayna-full-cream-milk-1l/3',
      'pandamarket/categories/dairy-eggs/products/juhayna-full-cream-milk-1l/4'
    ],
    category: 'dairy-eggs',
    subcategory: 'dairy',
    description: 'حليب جهينة كامل الدسم 1 لتر',
    descriptionEn: 'Juhayna full cream milk 1L',
    brand: 'جهينة',
    stock: 200,
    unit: '1 لتر'
  },
  {
    id: 'dairy-2',
    name: 'زبادي المراعي طبيعي 4 قطع',
    nameEn: 'Almarai Natural Yogurt 4pcs',
    price: 18.00,
    image: '/images/dairy/almarai-natural-yogurt-4pcs/1.webp',
    imagePublicId: 'pandamarket/categories/dairy-eggs/products/almarai-natural-yogurt-4pcs/1',
    imagePublicIds: [
      'pandamarket/categories/dairy-eggs/products/almarai-natural-yogurt-4pcs/1',
      'pandamarket/categories/dairy-eggs/products/almarai-natural-yogurt-4pcs/2',
      'pandamarket/categories/dairy-eggs/products/almarai-natural-yogurt-4pcs/3',
      'pandamarket/categories/dairy-eggs/products/almarai-natural-yogurt-4pcs/4'
    ],
    category: 'dairy-eggs',
    subcategory: 'dairy',
    description: 'زبادي المراعي طبيعي 4 قطع',
    descriptionEn: 'Almarai natural yogurt 4 pieces',
    brand: 'المراعي',
    stock: 180,
    unit: '4 قطع'
  },
  {
    id: 'dairy-3',
    name: 'جبنة مثلثات بوك 8 قطع',
    nameEn: 'Puck Triangle Cheese 8pcs',
    price: 28.00,
    image: '/images/dairy/puck-triangle-cheese-8pcs/1.webp',
    imagePublicId: 'pandamarket/categories/dairy-eggs/products/puck-triangle-cheese-8pcs/1',
    imagePublicIds: [
      'pandamarket/categories/dairy-eggs/products/puck-triangle-cheese-8pcs/1',
      'pandamarket/categories/dairy-eggs/products/puck-triangle-cheese-8pcs/2',
      'pandamarket/categories/dairy-eggs/products/puck-triangle-cheese-8pcs/3',
      'pandamarket/categories/dairy-eggs/products/puck-triangle-cheese-8pcs/4'
    ],
    category: 'dairy-eggs',
    subcategory: 'dairy',
    description: 'جبنة مثلثات بوك 8 قطع',
    descriptionEn: 'Puck triangle cheese 8 pieces',
    brand: 'بوك',
    stock: 150,
    unit: '8 قطع'
  },

  // ============================================
  // 🥤 BEVERAGES - المشروبات
  // ============================================
  {
    id: 'bev-1',
    name: 'كوكاكولا 1 لتر',
    nameEn: 'Coca Cola 1L',
    price: 18.00,
    image: '/images/beverages/coca-cola-1l/1.webp',
    imagePublicId: 'pandamarket/categories/breakfast-beverages/products/coca-cola-1l/1',
    imagePublicIds: [
      'pandamarket/categories/breakfast-beverages/products/coca-cola-1l/1',
      'pandamarket/categories/breakfast-beverages/products/coca-cola-1l/2',
      'pandamarket/categories/breakfast-beverages/products/coca-cola-1l/3',
      'pandamarket/categories/breakfast-beverages/products/coca-cola-1l/4'
    ],
    category: 'breakfast-beverages',
    subcategory: 'beverages',
    description: 'مشروب كوكاكولا الأصلي 1 لتر',
    descriptionEn: 'Original Coca Cola 1L',
    brand: 'كوكاكولا',
    stock: 250,
    unit: '1 لتر'
  },
  {
    id: 'bev-2',
    name: 'بيبسي 1.5 لتر',
    nameEn: 'Pepsi 1.5L',
    price: 17.00,
    image: '/images/beverages/pepsi-1-5l/1.webp',
    imagePublicId: 'pandamarket/categories/breakfast-beverages/products/pepsi-1-5l/1',
    imagePublicIds: [
      'pandamarket/categories/breakfast-beverages/products/pepsi-1-5l/1',
      'pandamarket/categories/breakfast-beverages/products/pepsi-1-5l/2',
      'pandamarket/categories/breakfast-beverages/products/pepsi-1-5l/3',
      'pandamarket/categories/breakfast-beverages/products/pepsi-1-5l/4'
    ],
    category: 'breakfast-beverages',
    subcategory: 'beverages',
    description: 'مشروب بيبسي 1.5 لتر',
    descriptionEn: 'Pepsi 1.5L',
    brand: 'بيبسي',
    stock: 200,
    unit: '1.5 لتر'
  },
  {
    id: 'bev-3',
    name: 'ماء حياة معدني 600 مل',
    nameEn: 'Hayat Mineral Water 600ml',
    price: 3.00,
    image: '/images/beverages/hayat-mineral-water-600ml/1.webp',
    imagePublicId: 'pandamarket/categories/breakfast-beverages/products/hayat-mineral-water-600ml/1',
    imagePublicIds: [
      'pandamarket/categories/breakfast-beverages/products/hayat-mineral-water-600ml/1',
      'pandamarket/categories/breakfast-beverages/products/hayat-mineral-water-600ml/2',
      'pandamarket/categories/breakfast-beverages/products/hayat-mineral-water-600ml/3',
      'pandamarket/categories/breakfast-beverages/products/hayat-mineral-water-600ml/4'
    ],
    category: 'breakfast-beverages',
    subcategory: 'beverages',
    description: 'مياه حياة المعدنية الطبيعية 600 مل',
    descriptionEn: 'Hayat natural mineral water 600ml',
    brand: 'حياة',
    stock: 500,
    unit: '600 مل'
  },

  // ============================================
  // 🍿 SNACKS - السناكس
  // ============================================
  {
    id: 'snack-1',
    name: 'تشيبسي شيبس 150 جم',
    nameEn: 'Chipsy Chips 150g',
    price: 15.00,
    image: '/images/snacks/chipsy-chips-150g/1.webp',
    imagePublicId: 'pandamarket/categories/snacks/products/chipsy-chips-150g/1',
    imagePublicIds: [
      'pandamarket/categories/snacks/products/chipsy-chips-150g/1',
      'pandamarket/categories/snacks/products/chipsy-chips-150g/2',
      'pandamarket/categories/snacks/products/chipsy-chips-150g/3',
      'pandamarket/categories/snacks/products/chipsy-chips-150g/4'
    ],
    category: 'snacks',
    subcategory: 'snacks',
    description: 'بطاطس تشيبسي 150 جم',
    descriptionEn: 'Chipsy potato chips 150g',
    brand: 'تشيبسي',
    stock: 300,
    unit: '150 جم'
  },
  {
    id: 'snack-2',
    name: 'أوريو بسكويت 154 جم',
    nameEn: 'Oreo Biscuits 154g',
    price: 18.00,
    image: '/images/snacks/oreo-biscuits-154g/1.webp',
    imagePublicId: 'pandamarket/categories/snacks/products/oreo-biscuits-154g/1',
    imagePublicIds: [
      'pandamarket/categories/snacks/products/oreo-biscuits-154g/1',
      'pandamarket/categories/snacks/products/oreo-biscuits-154g/2',
      'pandamarket/categories/snacks/products/oreo-biscuits-154g/3',
      'pandamarket/categories/snacks/products/oreo-biscuits-154g/4'
    ],
    category: 'snacks',
    subcategory: 'snacks',
    description: 'بسكويت أوريو بالشوكولاتة 154 جم',
    descriptionEn: 'Oreo chocolate biscuits 154g',
    brand: 'أوريو',
    stock: 250,
    unit: '154 جم'
  },

  // ============================================
  // 🥫 SAUCES - الصلصات
  // ============================================
  {
    id: 'sauce-1',
    name: 'مايونيز هيلزمان 400 مل',
    nameEn: "Hellmann's Mayonnaise 400ml",
    price: 45.00,
    image: '/images/sauces/hellmanns-mayonnaise-400ml/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/hellmanns-mayonnaise-400ml/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/hellmanns-mayonnaise-400ml/1',
      'pandamarket/categories/pantry/products/hellmanns-mayonnaise-400ml/2',
      'pandamarket/categories/pantry/products/hellmanns-mayonnaise-400ml/3',
      'pandamarket/categories/pantry/products/hellmanns-mayonnaise-400ml/4'
    ],
    category: 'pantry',
    subcategory: 'sauces',
    description: 'مايونيز هيلزمان الأصلي 400 مل',
    descriptionEn: "Hellmann's real mayonnaise 400ml",
    brand: 'هيلزمان',
    stock: 120,
    unit: '400 مل'
  },
  {
    id: 'sauce-2',
    name: 'كاتشب هاينز 397 جم',
    nameEn: 'Heinz Tomato Ketchup 397g',
    price: 35.00,
    image: '/images/sauces/heinz-tomato-ketchup-397g/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/heinz-tomato-ketchup-397g/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/heinz-tomato-ketchup-397g/1',
      'pandamarket/categories/pantry/products/heinz-tomato-ketchup-397g/2',
      'pandamarket/categories/pantry/products/heinz-tomato-ketchup-397g/3',
      'pandamarket/categories/pantry/products/heinz-tomato-ketchup-397g/4'
    ],
    category: 'pantry',
    subcategory: 'sauces',
    description: 'صلصة طماطم هاينز 397 جم',
    descriptionEn: 'Heinz tomato ketchup 397g',
    brand: 'هاينز',
    stock: 150,
    unit: '397 جم'
  },

  // ============================================
  // 🧴 CLEANING - منتجات التنظيف
  // ============================================
  {
    id: 'clean-1',
    name: 'سائل جلي فيري 900 مل',
    nameEn: 'Fairy Dish Liquid 900ml',
    price: 42.00,
    image: '/images/cleaning/fairy-dish-liquid-900ml/1.webp',
    imagePublicId: 'pandamarket/categories/cleaning/products/fairy-dish-liquid-900ml/1',
    imagePublicIds: [
      'pandamarket/categories/cleaning/products/fairy-dish-liquid-900ml/1',
      'pandamarket/categories/cleaning/products/fairy-dish-liquid-900ml/2',
      'pandamarket/categories/cleaning/products/fairy-dish-liquid-900ml/3',
      'pandamarket/categories/cleaning/products/fairy-dish-liquid-900ml/4'
    ],
    category: 'cleaning',
    subcategory: 'household',
    description: 'سائل جلي الأواني فيري 900 مل',
    descriptionEn: 'Fairy dishwashing liquid 900ml',
    brand: 'فيري',
    stock: 100,
    unit: '900 مل'
  },
  {
    id: 'clean-2',
    name: 'منظف تايد 2.5 كجم',
    nameEn: 'Tide Detergent 2.5kg',
    price: 85.00,
    image: '/images/cleaning/tide-detergent-2-5kg/1.webp',
    imagePublicId: 'pandamarket/categories/cleaning/products/tide-detergent-2-5kg/1',
    imagePublicIds: [
      'pandamarket/categories/cleaning/products/tide-detergent-2-5kg/1',
      'pandamarket/categories/cleaning/products/tide-detergent-2-5kg/2',
      'pandamarket/categories/cleaning/products/tide-detergent-2-5kg/3',
      'pandamarket/categories/cleaning/products/tide-detergent-2-5kg/4'
    ],
    category: 'cleaning',
    subcategory: 'household',
    description: 'مسحوق غسيل تايد 2.5 كجم',
    descriptionEn: 'Tide laundry detergent 2.5kg',
    brand: 'تايد',
    stock: 80,
    unit: '2.5 كجم'
  },

  // ============================================
  // 🫘 LEGUMES - البقوليات
  // ============================================
  {
    id: 'leg-1',
    name: 'عدس أصفر الآفية 500 جم',
    nameEn: 'Al Afia Yellow Lentils 500g',
    price: 22.00,
    image: '/images/legumes/al-afia-yellow-lentils-500g/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/al-afia-yellow-lentils-500g/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/al-afia-yellow-lentils-500g/1',
      'pandamarket/categories/pantry/products/al-afia-yellow-lentils-500g/2',
      'pandamarket/categories/pantry/products/al-afia-yellow-lentils-500g/3',
      'pandamarket/categories/pantry/products/al-afia-yellow-lentils-500g/4'
    ],
    category: 'pantry',
    subcategory: 'grains-legumes',
    description: 'عدس أصفر الآفية 500 جم',
    descriptionEn: 'Al Afia yellow lentils 500g',
    brand: 'الآفية',
    stock: 200,
    unit: '500 جم'
  },
  {
    id: 'leg-2',
    name: 'فول مدمس كنوز 400 جم',
    nameEn: 'Kinooz Fava Beans 400g',
    price: 15.00,
    image: '/images/legumes/kinooz-fava-beans-400g/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/kinooz-fava-beans-400g/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/kinooz-fava-beans-400g/1',
      'pandamarket/categories/pantry/products/kinooz-fava-beans-400g/2',
      'pandamarket/categories/pantry/products/kinooz-fava-beans-400g/3',
      'pandamarket/categories/pantry/products/kinooz-fava-beans-400g/4'
    ],
    category: 'pantry',
    subcategory: 'grains-legumes',
    description: 'فول مدمس كنوز 400 جم',
    descriptionEn: 'Kinooz fava beans 400g',
    brand: 'كنوز',
    stock: 180,
    unit: '400 جم'
  },

  // ============================================
  // 🛢️ OILS - الزيوت
  // ============================================
  {
    id: 'oil-1',
    name: 'زيت كريستال 1.5 لتر',
    nameEn: 'Cristal Oil 1.5L',
    price: 65.00,
    image: '/images/oils/cristal-oil-1-5l/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/cristal-oil-1-5l/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/cristal-oil-1-5l/1',
      'pandamarket/categories/pantry/products/cristal-oil-1-5l/2',
      'pandamarket/categories/pantry/products/cristal-oil-1-5l/3',
      'pandamarket/categories/pantry/products/cristal-oil-1-5l/4'
    ],
    category: 'pantry',
    subcategory: 'oils',
    description: 'زيت كريستال عباد الشمس 1.5 لتر',
    descriptionEn: 'Cristal sunflower oil 1.5L',
    brand: 'كريستال',
    stock: 120,
    unit: '1.5 لتر'
  },
  {
    id: 'oil-2',
    name: 'سمن حلواني 1 كجم',
    nameEn: 'Halwani Ghee 1kg',
    price: 75.00,
    image: '/images/oils/halwani-ghee-1kg/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/halwani-ghee-1kg/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/halwani-ghee-1kg/1',
      'pandamarket/categories/pantry/products/halwani-ghee-1kg/2',
      'pandamarket/categories/pantry/products/halwani-ghee-1kg/3',
      'pandamarket/categories/pantry/products/halwani-ghee-1kg/4'
    ],
    category: 'pantry',
    subcategory: 'oils',
    description: 'سمن حلواني بلدي 1 كجم',
    descriptionEn: 'Halwani traditional ghee 1kg',
    brand: 'حلواني',
    stock: 100,
    unit: '1 كجم'
  },

  // ============================================
  // 🍚 RICE & PASTA - الأرز والمعكرونة
  // ============================================
  {
    id: 'rice-1',
    name: 'أرز الدوحة 5 كجم',
    nameEn: 'Al Doha Rice 5kg',
    price: 85.00,
    image: '/images/rice/al-doha-rice-5kg/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/al-doha-rice-5kg/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/al-doha-rice-5kg/1',
      'pandamarket/categories/pantry/products/al-doha-rice-5kg/2',
      'pandamarket/categories/pantry/products/al-doha-rice-5kg/3',
      'pandamarket/categories/pantry/products/al-doha-rice-5kg/4'
    ],
    category: 'pantry',
    subcategory: 'grains-legumes',
    description: 'أرز الدوحة مصري 5 كجم',
    descriptionEn: 'Al Doha Egyptian rice 5kg',
    brand: 'الدوحة',
    stock: 150,
    unit: '5 كجم'
  },
  {
    id: 'rice-2',
    name: 'مكرونة ريجينا 400 جم',
    nameEn: 'Regina Pasta 400g',
    price: 18.00,
    image: '/images/rice/regina-pasta-400g/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/regina-pasta-400g/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/regina-pasta-400g/1',
      'pandamarket/categories/pantry/products/regina-pasta-400g/2',
      'pandamarket/categories/pantry/products/regina-pasta-400g/3',
      'pandamarket/categories/pantry/products/regina-pasta-400g/4'
    ],
    category: 'pantry',
    subcategory: 'grains-legumes',
    description: 'مكرونة ريجينا 400 جم',
    descriptionEn: 'Regina pasta 400g',
    brand: 'ريجينا',
    stock: 200,
    unit: '400 جم'
  },

  // ============================================
  // 🍞 BAKERY - المخبوزات
  // ============================================
  {
    id: 'bakery-1',
    name: 'خبز فينو فاين',
    nameEn: 'Fine Fino Bread',
    price: 5.00,
    image: '/images/bakery/fine-fino-bread/1.webp',
    imagePublicId: 'pandamarket/categories/bakery/products/fine-fino-bread/1',
    imagePublicIds: [
      'pandamarket/categories/bakery/products/fine-fino-bread/1',
      'pandamarket/categories/bakery/products/fine-fino-bread/2',
      'pandamarket/categories/bakery/products/fine-fino-bread/3',
      'pandamarket/categories/bakery/products/fine-fino-bread/4'
    ],
    category: 'bakery',
    subcategory: 'bread',
    description: 'خبز فينو طازج مثالي للفطار',
    descriptionEn: 'Fresh Fino bread perfect for breakfast',
    brand: 'فاين',
    stock: 200,
    unit: 'رغيف'
  },
  {
    id: 'bakery-2',
    name: 'خبز بلدي',
    nameEn: 'Balady Bread',
    price: 3.00,
    image: '/images/bakery/balady-bread/1.webp',
    imagePublicId: 'pandamarket/categories/bakery/products/balady-bread/1',
    imagePublicIds: [
      'pandamarket/categories/bakery/products/balady-bread/1',
      'pandamarket/categories/bakery/products/balady-bread/2',
      'pandamarket/categories/bakery/products/balady-bread/3',
      'pandamarket/categories/bakery/products/balady-bread/4'
    ],
    category: 'bakery',
    subcategory: 'bread',
    description: 'خبز بلدي مصري تقليدي',
    descriptionEn: 'Traditional Egyptian balady bread',
    brand: 'محلي',
    stock: 300,
    unit: 'رغيف'
  },
  {
    id: 'bakery-3',
    name: 'توست أولكر أبيض',
    nameEn: 'Ulker White Toast',
    price: 12.00,
    image: '/images/bakery/ulker-white-toast/1.webp',
    imagePublicId: 'pandamarket/categories/bakery/products/ulker-white-toast/1',
    imagePublicIds: [
      'pandamarket/categories/bakery/products/ulker-white-toast/1',
      'pandamarket/categories/bakery/products/ulker-white-toast/2',
      'pandamarket/categories/bakery/products/ulker-white-toast/3',
      'pandamarket/categories/bakery/products/ulker-white-toast/4'
    ],
    category: 'bakery',
    subcategory: 'bread',
    description: 'توست أبيض 20 شريحة',
    descriptionEn: 'White toast 20 slices',
    brand: 'أولكر',
    stock: 150,
    unit: '550 جم'
  },

  // ============================================
  // SPICES - التوابل
  // ============================================
  {
    id: 'spice-1',
    name: 'كمون',
    nameEn: 'Cumin',
    price: 25.00,
    image: '/images/spices/cumin/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/cumin/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/cumin/1',
      'pandamarket/categories/pantry/products/cumin/2',
      'pandamarket/categories/pantry/products/cumin/3',
      'pandamarket/categories/pantry/products/cumin/4'
    ],
    category: 'pantry',
    subcategory: 'spices',
    description: 'كمون مطحون عالي الجودة',
    descriptionEn: 'High quality ground cumin',
    brand: 'أبو على',
    stock: 80,
    unit: '100 جم'
  },
  {
    id: 'spice-2',
    name: 'فلفل أسود',
    nameEn: 'Black Pepper',
    price: 30.00,
    image: '/images/spices/black-pepper/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/black-pepper/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/black-pepper/1',
      'pandamarket/categories/pantry/products/black-pepper/2',
      'pandamarket/categories/pantry/products/black-pepper/3',
      'pandamarket/categories/pantry/products/black-pepper/4'
    ],
    category: 'pantry',
    subcategory: 'spices',
    description: 'فلفل أسود مطحون',
    descriptionEn: 'Ground black pepper',
    brand: 'أبو على',
    stock: 90,
    unit: '100 جم'
  },
  {
    id: 'spice-3',
    name: 'كركم',
    nameEn: 'Turmeric',
    price: 20.00,
    image: '/images/spices/turmeric/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/turmeric/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/turmeric/1',
      'pandamarket/categories/pantry/products/turmeric/2',
      'pandamarket/categories/pantry/products/turmeric/3',
      'pandamarket/categories/pantry/products/turmeric/4'
    ],
    category: 'pantry',
    subcategory: 'spices',
    description: 'كركم بودرة نقي',
    descriptionEn: 'Pure turmeric powder',
    brand: 'أبو على',
    stock: 85,
    unit: '100 جم'
  },

  // ============================================
  // VEGETABLES - الخضروات
  // ============================================
  {
    id: 'veg-1',
    name: 'طماطم حمراء',
    nameEn: 'Red Tomatoes',
    price: 12.00,
    image: '/images/vegetables/red-tomatoes/1.webp',
    imagePublicId: 'pandamarket/categories/fresh-food/products/red-tomatoes/1',
    imagePublicIds: [
      'pandamarket/categories/fresh-food/products/red-tomatoes/1',
      'pandamarket/categories/fresh-food/products/red-tomatoes/2',
      'pandamarket/categories/fresh-food/products/red-tomatoes/3',
      'pandamarket/categories/fresh-food/products/red-tomatoes/4'
    ],
    category: 'fresh-food',
    subcategory: 'vegetables',
    description: 'طماطم حمراء طازجة كيلو',
    descriptionEn: 'Fresh red tomatoes per kg',
    brand: 'محلي',
    stock: 200,
    unit: 'كيلو'
  },
  {
    id: 'veg-2',
    name: 'خيار بلدي',
    nameEn: 'Local Cucumber',
    price: 10.00,
    image: '/images/vegetables/local-cucumber/1.webp',
    imagePublicId: 'pandamarket/categories/fresh-food/products/local-cucumber/1',
    imagePublicIds: [
      'pandamarket/categories/fresh-food/products/local-cucumber/1',
      'pandamarket/categories/fresh-food/products/local-cucumber/2',
      'pandamarket/categories/fresh-food/products/local-cucumber/3',
      'pandamarket/categories/fresh-food/products/local-cucumber/4'
    ],
    category: 'fresh-food',
    subcategory: 'vegetables',
    description: 'خيار بلدي طازج كيلو',
    descriptionEn: 'Fresh local cucumber per kg',
    brand: 'محلي',
    stock: 180,
    unit: 'كيلو'
  },

  // ============================================
  // FRUITS - الفواكه
  // ============================================
  {
    id: 'fruit-1',
    name: 'موز مستورد',
    nameEn: 'Imported Bananas',
    price: 15.00,
    image: '/images/fruits/imported-bananas/1.webp',
    imagePublicId: 'pandamarket/categories/fresh-food/products/imported-bananas/1',
    imagePublicIds: [
      'pandamarket/categories/fresh-food/products/imported-bananas/1',
      'pandamarket/categories/fresh-food/products/imported-bananas/2',
      'pandamarket/categories/fresh-food/products/imported-bananas/3',
      'pandamarket/categories/fresh-food/products/imported-bananas/4'
    ],
    category: 'fresh-food',
    subcategory: 'fruits',
    description: 'موز مستورد طازج كيلو',
    descriptionEn: 'Fresh imported bananas per kg',
    brand: 'مستورد',
    stock: 300,
    unit: 'كيلو'
  },
  {
    id: 'fruit-2',
    name: 'تفاح أحمر',
    nameEn: 'Red Apples',
    price: 35.00,
    image: '/images/fruits/red-apples/1.webp',
    imagePublicId: 'pandamarket/categories/fresh-food/products/red-apples/1',
    imagePublicIds: [
      'pandamarket/categories/fresh-food/products/red-apples/1',
      'pandamarket/categories/fresh-food/products/red-apples/2',
      'pandamarket/categories/fresh-food/products/red-apples/3',
      'pandamarket/categories/fresh-food/products/red-apples/4'
    ],
    category: 'fresh-food',
    subcategory: 'fruits',
    description: 'تفاح أحمر طازج كيلو',
    descriptionEn: 'Fresh red apples per kg',
    brand: 'مستورد',
    stock: 150,
    unit: 'كيلو'
  },
  {
    id: 'oil-3',
    name: 'سمنة روابي بلدي 750 جم',
    nameEn: 'Rawabi Traditional Ghee 750g',
    price: 95.00,
    image: '/images/oils/rawabi-ghee-750g/1.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/rawabi-ghee-750g/1',
    imagePublicIds: [
      'pandamarket/categories/pantry/products/rawabi-ghee-750g/1',
      'pandamarket/categories/pantry/products/rawabi-ghee-750g/2',
      'pandamarket/categories/pantry/products/rawabi-ghee-750g/3',
      'pandamarket/categories/pantry/products/rawabi-ghee-750g/4'
    ],
    category: 'pantry',
    subcategory: 'oils',
    description: 'سمنة روابي بالطعم البلدي الاصيل 750 جم',
    descriptionEn: 'Rawabi traditional Egyptian ghee 750g',
    brand: 'روابي',
    stock: 110,
    unit: '750 جم'
  },
  {
    id: 'snack-3',
    name: 'شوكولاتة كادبوري ديري ملك 90 جم',
    nameEn: 'Cadbury Dairy Milk Chocolate 90g',
    price: 40.00,
    image: '/images/snacks/cadbury-dairy-milk-90g/1.webp',
    imagePublicId: 'pandamarket/categories/snacks/products/cadbury-dairy-milk-90g/1',
    imagePublicIds: [
      'pandamarket/categories/snacks/products/cadbury-dairy-milk-90g/1',
      'pandamarket/categories/snacks/products/cadbury-dairy-milk-90g/2',
      'pandamarket/categories/snacks/products/cadbury-dairy-milk-90g/3',
      'pandamarket/categories/snacks/products/cadbury-dairy-milk-90g/4'
    ],
    category: 'snacks',
    subcategory: 'snacks',
    description: 'شوكولاتة كادبوري ديري ملك غنية بالحليب 90 جم',
    descriptionEn: 'Cadbury Dairy Milk smooth milk chocolate 90g',
    brand: 'كادبوري',
    stock: 220,
    unit: '90 جم'
  },
  {
    id: 'bev-4',
    name: 'عصير جهينة برتقال 1 لتر',
    nameEn: 'Juhayna Pure Orange Juice 1L',
    price: 32.00,
    image: '/images/beverages/juhayna-orange-juice-1l/1.webp',
    imagePublicId: 'pandamarket/categories/breakfast-beverages/products/juhayna-orange-juice-1l/1',
    imagePublicIds: [
      'pandamarket/categories/breakfast-beverages/products/juhayna-orange-juice-1l/1',
      'pandamarket/categories/breakfast-beverages/products/juhayna-orange-juice-1l/2',
      'pandamarket/categories/breakfast-beverages/products/juhayna-orange-juice-1l/3',
      'pandamarket/categories/breakfast-beverages/products/juhayna-orange-juice-1l/4'
    ],
    category: 'breakfast-beverages',
    subcategory: 'beverages',
    description: 'عصير برتقال طبيعي 100% جهينة 1 لتر',
    descriptionEn: 'Juhayna 100% natural pure orange juice 1L',
    brand: 'جهينة',
    stock: 180,
    unit: '1 لتر'
  },
  {
    id: 'dairy-4',
    name: 'جبنة فيتا دومتي 500 جم',
    nameEn: 'Domty White Feta Cheese 500g',
    price: 48.00,
    image: '/images/dairy/domty-feta-cheese-500g/1.webp',
    imagePublicId: 'pandamarket/categories/dairy-eggs/products/domty-feta-cheese-500g/1',
    imagePublicIds: [
      'pandamarket/categories/dairy-eggs/products/domty-feta-cheese-500g/1',
      'pandamarket/categories/dairy-eggs/products/domty-feta-cheese-500g/2',
      'pandamarket/categories/dairy-eggs/products/domty-feta-cheese-500g/3',
      'pandamarket/categories/dairy-eggs/products/domty-feta-cheese-500g/4'
    ],
    category: 'dairy-eggs',
    subcategory: 'dairy',
    description: 'جبنة بيضاء فيتا دومتي طازجة 500 جم',
    descriptionEn: 'Domty fresh white feta cheese 500g',
    brand: 'دومتي',
    stock: 160,
    unit: '500 جم'
  },
  {
    id: 'clean-3',
    name: 'أرييل جل أوتوماتيك 2 لتر',
    nameEn: 'Ariel Automatic Liquid Gel 2L',
    price: 165.00,
    image: '/images/cleaning/ariel-automatic-gel-2l/1.webp',
    imagePublicId: 'pandamarket/categories/cleaning/products/ariel-automatic-gel-2l/1',
    imagePublicIds: [
      'pandamarket/categories/cleaning/products/ariel-automatic-gel-2l/1',
      'pandamarket/categories/cleaning/products/ariel-automatic-gel-2l/2',
      'pandamarket/categories/cleaning/products/ariel-automatic-gel-2l/3',
      'pandamarket/categories/cleaning/products/ariel-automatic-gel-2l/4'
    ],
    category: 'cleaning',
    subcategory: 'household',
    description: 'منظف أرييل جل أوتوماتيك للغسالات 2 لتر',
    descriptionEn: 'Ariel liquid gel automatic laundry detergent 2L',
    brand: 'أرييل',
    stock: 90,
    unit: '2 لتر'
  },

  // ============================================
  // HIGH VELOCITY SKUs
  // ============================================
  {
    id: 'hv-1',
    name: 'بيض أبيض 30 حبة',
    nameEn: 'White Eggs 30 Pack',
    price: 150.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/dairy-eggs/products/white-eggs-30/1',
    imagePublicIds: ['pandamarket/categories/dairy-eggs/products/white-eggs-30/1'],
    category: 'dairy-eggs',
    subcategory: 'eggs',
    description: 'طبق بيض أبيض طازج 30 حبة',
    descriptionEn: 'Fresh white eggs 30 pack',
    brand: 'مزارع دينا',
    stock: 50,
    unit: '30 حبة'
  },
  {
    id: 'hv-2',
    name: 'زبدة لورباك 400 جم',
    nameEn: 'Lurpak Butter 400g',
    price: 120.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/dairy-eggs/products/lurpak-butter-400g/1',
    imagePublicIds: ['pandamarket/categories/dairy-eggs/products/lurpak-butter-400g/1'],
    category: 'dairy-eggs',
    subcategory: 'butter',
    description: 'زبدة لورباك غير مملحة 400 جم',
    descriptionEn: 'Lurpak unsalted butter 400g',
    brand: 'لورباك',
    stock: 40,
    unit: '400 جم'
  },
  {
    id: 'hv-3',
    name: 'شاي ليبتون 100 فتلة',
    nameEn: 'Lipton Yellow Label Tea 100 Bags',
    price: 65.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/breakfast-beverages/products/lipton-tea-100/1',
    imagePublicIds: ['pandamarket/categories/breakfast-beverages/products/lipton-tea-100/1'],
    category: 'breakfast-beverages',
    subcategory: 'tea-coffee',
    description: 'شاي ليبتون العلامة الصفراء 100 فتلة',
    descriptionEn: 'Lipton Yellow Label tea 100 tea bags',
    brand: 'ليبتون',
    stock: 100,
    unit: '100 عبوة'
  },
  {
    id: 'hv-4',
    name: 'نسكافيه كلاسيك 200 جم',
    nameEn: 'Nescafe Classic 200g',
    price: 145.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/breakfast-beverages/products/nescafe-classic-200g/1',
    imagePublicIds: ['pandamarket/categories/breakfast-beverages/products/nescafe-classic-200g/1'],
    category: 'breakfast-beverages',
    subcategory: 'tea-coffee',
    description: 'قهوة سريعة التحضير نسكافيه كلاسيك 200 جم',
    descriptionEn: 'Nescafe Classic instant coffee 200g',
    brand: 'نسكافيه',
    stock: 60,
    unit: '200 جم'
  },
  {
    id: 'hv-5',
    name: 'سكر الأسرة 1 كجم',
    nameEn: 'Al Osra Sugar 1kg',
    price: 27.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/alosra-sugar-1kg/1',
    imagePublicIds: ['pandamarket/categories/pantry/products/alosra-sugar-1kg/1'],
    category: 'pantry',
    subcategory: 'sugar-flour',
    description: 'سكر الأسرة نقي 1 كجم',
    descriptionEn: 'Al Osra pure fine sugar 1kg',
    brand: 'الأسرة',
    stock: 200,
    unit: '1 كجم'
  },
  {
    id: 'hv-6',
    name: 'ملح بونو 300 جم',
    nameEn: 'Bono Salt 300g',
    price: 5.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/pantry/products/bono-salt-300g/1',
    imagePublicIds: ['pandamarket/categories/pantry/products/bono-salt-300g/1'],
    category: 'pantry',
    subcategory: 'spices-salt',
    description: 'ملح طعام بونو باليود 300 جم',
    descriptionEn: 'Bono iodized table salt 300g',
    brand: 'بونو',
    stock: 150,
    unit: '300 جم'
  },
  {
    id: 'hv-7',
    name: 'بطاطس للطبخ كيلو',
    nameEn: 'Cooking Potatoes 1kg',
    price: 20.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/fresh-food/products/cooking-potatoes-1kg/1',
    imagePublicIds: ['pandamarket/categories/fresh-food/products/cooking-potatoes-1kg/1'],
    category: 'fresh-food',
    subcategory: 'vegetables',
    description: 'بطاطس محلية طازجة للطبخ',
    descriptionEn: 'Fresh local cooking potatoes',
    brand: 'محلي',
    stock: 100,
    unit: '1 كجم'
  },
  {
    id: 'hv-8',
    name: 'بصل أحمر كيلو',
    nameEn: 'Red Onions 1kg',
    price: 25.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/fresh-food/products/red-onions-1kg/1',
    imagePublicIds: ['pandamarket/categories/fresh-food/products/red-onions-1kg/1'],
    category: 'fresh-food',
    subcategory: 'vegetables',
    description: 'بصل أحمر طازج',
    descriptionEn: 'Fresh red onions',
    brand: 'محلي',
    stock: 80,
    unit: '1 كجم'
  },
  {
    id: 'hv-9',
    name: 'مناديل فاين تواليت 6 بكرات',
    nameEn: 'Fine Toilet Paper 6 Rolls',
    price: 65.00,
    image: '/images/placeholder.webp',
    imagePublicId: 'pandamarket/categories/cleaning/products/fine-toilet-paper-6/1',
    imagePublicIds: ['pandamarket/categories/cleaning/products/fine-toilet-paper-6/1'],
    category: 'cleaning',
    subcategory: 'paper-products',
    description: 'مناديل حمام فاين ناعمة ومضغوطة 6 بكرات',
    descriptionEn: 'Fine soft toilet paper 6 rolls',
    brand: 'فاين',
    stock: 75,
    unit: '6 بكرات'
  }

];

export function getProductById(id: string): Product | undefined {
  return sampleProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter(p => p.category === category);
}

export function getProductsByBrand(brand: string): Product[] {
  return sampleProducts.filter(p => p.brand === brand);
}

export function searchProducts(searchTerm: string): Product[] {
  const term = searchTerm.toLowerCase();
  return sampleProducts.filter(
    p =>
      p.name.toLowerCase().includes(term) ||
      p.nameEn.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.descriptionEn?.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term)
  );
}

export function getFeaturedProducts(limit: number = 8): Product[] {
  return sampleProducts
    .filter(p => p.rating && p.rating > 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

export function getNewArrivals(limit: number = 8): Product[] {
  return sampleProducts
    .sort((a, b) => (b.id || '').localeCompare(a.id || ''))
    .slice(0, limit);
}

export function getDiscountedProducts(limit: number = 10): Product[] {
  return sampleProducts
    .filter(p => p.discount && p.discount > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, limit);
}

export const categories = [
  { id: 'dairy', name: 'الألبان والبيض', nameEn: 'Dairy & Eggs', slug: 'dairy' },
  { id: 'beverages', name: 'المشروبات', nameEn: 'Beverages', slug: 'beverages' },
  { id: 'produce', name: 'الخضروات والفواكه الطازجة', nameEn: 'Fresh Produce', slug: 'produce' },
  { id: 'bakery', name: 'المخبوزات والخبز', nameEn: 'Bakery & Bread', slug: 'bakery' },
  { id: 'pantry', name: 'الأرز والمكرونة والبقوليات', nameEn: 'Pantry & Grains', slug: 'pantry' },
  { id: 'condiments', name: 'الزيوت والصلصات والتوابل', nameEn: 'Oils, Sauces & Spices', slug: 'condiments' },
  { id: 'snacks', name: 'الوجبات الخفيفة والحلويات', nameEn: 'Snacks & Sweets', slug: 'snacks' },
  { id: 'cleaning', name: 'العناية والمنظفات المنزلية', nameEn: 'Household & Cleaning', slug: 'cleaning' },
];