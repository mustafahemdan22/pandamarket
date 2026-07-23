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
    imagePublicId: '/images/dairy/juhayna-full-cream-milk-1l/1.webp',
    imagePublicIds: getLocalImages('dairy', 'juhayna-full-cream-milk-1l', 4),
    category: 'dairy',
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
    imagePublicId: '/images/dairy/almarai-natural-yogurt-4pcs/1.webp',
    imagePublicIds: getLocalImages('dairy', 'almarai-natural-yogurt-4pcs', 4),
    category: 'dairy',
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
    imagePublicId: '/images/dairy/puck-triangle-cheese-8pcs/1.webp',
    imagePublicIds: getLocalImages('dairy', 'puck-triangle-cheese-8pcs', 4),
    category: 'dairy',
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
    imagePublicId: '/images/beverages/coca-cola-1l/1.webp',
    imagePublicIds: getLocalImages('beverages', 'coca-cola-1l', 4),
    category: 'beverages',
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
    imagePublicId: '/images/beverages/pepsi-1-5l/1.webp',
    imagePublicIds: getLocalImages('beverages', 'pepsi-1-5l', 4),
    category: 'beverages',
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
    imagePublicId: '/images/beverages/hayat-mineral-water-600ml/1.webp',
    imagePublicIds: getLocalImages('beverages', 'hayat-mineral-water-600ml', 4),
    category: 'beverages',
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
    imagePublicId: '/images/snacks/chipsy-chips-150g/1.webp',
    imagePublicIds: getLocalImages('snacks', 'chipsy-chips-150g', 4),
    category: 'snacks',
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
    imagePublicId: '/images/snacks/oreo-biscuits-154g/1.webp',
    imagePublicIds: getLocalImages('snacks', 'oreo-biscuits-154g', 4),
    category: 'snacks',
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
    imagePublicId: '/images/sauces/hellmanns-mayonnaise-400ml/1.webp',
    imagePublicIds: getLocalImages('sauces', 'hellmanns-mayonnaise-400ml', 4),
    category: 'sauces',
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
    imagePublicId: '/images/sauces/heinz-tomato-ketchup-397g/1.webp',
    imagePublicIds: getLocalImages('sauces', 'heinz-tomato-ketchup-397g', 4),
    category: 'sauces',
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
    imagePublicId: '/images/cleaning/fairy-dish-liquid-900ml/1.webp',
    imagePublicIds: getLocalImages('cleaning', 'fairy-dish-liquid-900ml', 4),
    category: 'cleaning',
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
    imagePublicId: '/images/cleaning/tide-detergent-2-5kg/1.webp',
    imagePublicIds: getLocalImages('cleaning', 'tide-detergent-2-5kg', 4),
    category: 'cleaning',
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
    imagePublicId: '/images/legumes/al-afia-yellow-lentils-500g/1.webp',
    imagePublicIds: getLocalImages('legumes', 'al-afia-yellow-lentils-500g', 4),
    category: 'legumes',
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
    imagePublicId: '/images/legumes/kinooz-fava-beans-400g/1.webp',
    imagePublicIds: getLocalImages('legumes', 'kinooz-fava-beans-400g', 4),
    category: 'legumes',
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
    imagePublicId: '/images/oils/cristal-oil-1-5l/1.webp',
    imagePublicIds: getLocalImages('oils', 'cristal-oil-1-5l', 4),
    category: 'oils',
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
    imagePublicId: '/images/oils/halwani-ghee-1kg/1.webp',
    imagePublicIds: getLocalImages('oils', 'halwani-ghee-1kg', 4),
    category: 'oils',
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
    imagePublicId: '/images/rice/al-doha-rice-5kg/1.webp',
    imagePublicIds: getLocalImages('rice', 'al-doha-rice-5kg', 4),
    category: 'rice',
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
    imagePublicId: '/images/rice/regina-pasta-400g/1.webp',
    imagePublicIds: getLocalImages('rice', 'regina-pasta-400g', 4),
    category: 'rice',
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
    imagePublicIds: getLocalImages('bakery', 'fine-fino-bread', 4),
    category: 'bakery',
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
    imagePublicIds: getLocalImages('bakery', 'balady-bread', 4),
    category: 'bakery',
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
    imagePublicIds: getLocalImages('bakery', 'ulker-white-toast', 4),
    category: 'bakery',
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
    imagePublicId: 'pandamarket/categories/spices/products/cumin/1',
    imagePublicIds: getLocalImages('spices', 'cumin', 4),
    category: 'spices',
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
    imagePublicId: 'pandamarket/categories/spices/products/black-pepper/1',
    imagePublicIds: getLocalImages('spices', 'black-pepper', 4),
    category: 'spices',
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
    imagePublicId: 'pandamarket/categories/spices/products/turmeric/1',
    imagePublicIds: getLocalImages('spices', 'turmeric', 4),
    category: 'spices',
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
    imagePublicId: 'pandamarket/categories/vegetables/products/red-tomatoes/1',
    imagePublicIds: getLocalImages('vegetables', 'red-tomatoes', 4),
    category: 'vegetables',
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
    imagePublicId: 'pandamarket/categories/vegetables/products/local-cucumber/1',
    imagePublicIds: getLocalImages('vegetables', 'local-cucumber', 4),
    category: 'vegetables',
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
    imagePublicId: 'pandamarket/categories/fruits/products/imported-bananas/1',
    imagePublicIds: getLocalImages('fruits', 'imported-bananas', 4),
    category: 'fruits',
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
    imagePublicId: 'pandamarket/categories/fruits/products/red-apples/1',
    imagePublicIds: getLocalImages('fruits', 'red-apples', 4),
    category: 'fruits',
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
    imagePublicId: '/images/oils/rawabi-ghee-750g/1.webp',
    imagePublicIds: getLocalImages('oils', 'rawabi-ghee-750g', 4),
    category: 'oils',
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
    imagePublicId: '/images/snacks/cadbury-dairy-milk-90g/1.webp',
    imagePublicIds: getLocalImages('snacks', 'cadbury-dairy-milk-90g', 4),
    category: 'snacks',
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
    imagePublicId: '/images/beverages/juhayna-orange-juice-1l/1.webp',
    imagePublicIds: getLocalImages('beverages', 'juhayna-orange-juice-1l', 4),
    category: 'beverages',
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
    imagePublicId: '/images/dairy/domty-feta-cheese-500g/1.webp',
    imagePublicIds: getLocalImages('dairy', 'domty-feta-cheese-500g', 4),
    category: 'dairy',
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
    imagePublicId: '/images/cleaning/ariel-automatic-gel-2l/1.webp',
    imagePublicIds: getLocalImages('cleaning', 'ariel-automatic-gel-2l', 4),
    category: 'cleaning',
    description: 'منظف أرييل جل أوتوماتيك للغسالات 2 لتر',
    descriptionEn: 'Ariel liquid gel automatic laundry detergent 2L',
    brand: 'أرييل',
    stock: 90,
    unit: '2 لتر'
  },
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