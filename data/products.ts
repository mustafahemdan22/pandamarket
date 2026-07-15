import { Product } from '../store/cartSlice';

function getPublicIds(categorySlug: string, productSlug: string, count: number = 4): string[] {
  return Array.from({ length: count }, (_, i) => 
    `pandamarket/categories/${categorySlug}/products/${productSlug}/${i + 1}`
  );
}

export const sampleProducts: Product[] = [
  // ============================================
  // 🍞 BAKERY - المخبوزات
  // ============================================
  {
    id: 'bk1',
    name: 'خبز فينو فاين',
    nameEn: 'Fine Fino Bread',
    price: 5.00,
    imagePublicId: 'pandamarket/categories/bakery/products/fine-fino-bread/1',
    imagePublicIds: getPublicIds('bakery', 'fine-fino-bread', 4),
    category: 'bakery',
    description: 'خبز فينو طازج مثالي للفطار',
    descriptionEn: 'Fresh Fino bread perfect for breakfast',
    brand: 'فاين',
    stock: 200,
    unit: 'رغيف'
  },
  {
    id: 'bk2',
    name: 'خبز بلدي',
    nameEn: 'Balady Bread',
    price: 3.00,
    imagePublicId: 'pandamarket/categories/bakery/products/balady-bread/1',
    imagePublicIds: getPublicIds('bakery', 'balady-bread', 4),
    category: 'bakery',
    description: 'خبز بلدي مصري تقليدي',
    descriptionEn: 'Traditional Egyptian balady bread',
    brand: 'محلي',
    stock: 300,
    unit: 'رغيف'
  },
  {
    id: 'bk3',
    name: 'توست أولكر أبيض',
    nameEn: 'Ulker White Toast',
    price: 12.00,
    imagePublicId: 'pandamarket/categories/bakery/products/ulker-white-toast/1',
    imagePublicIds: getPublicIds('bakery', 'ulker-white-toast', 4),
    category: 'bakery',
    description: 'توست أبيض 20 شريحة',
    descriptionEn: 'White toast 20 slices',
    brand: 'أولكر',
    stock: 150,
    unit: '550 جم'
  },
  {
    id: 'bk4',
    name: 'توست قمح كامل',
    nameEn: 'Whole Wheat Toast',
    price: 15.00,
    imagePublicId: 'pandamarket/categories/bakery/products/whole-wheat-toast/1',
    imagePublicIds: getPublicIds('bakery', 'whole-wheat-toast', 4),
    category: 'bakery',
    description: 'توست قمح كامل صحي 18 شريحة',
    descriptionEn: 'Healthy whole wheat toast 18 slices',
    brand: 'أولكر',
    stock: 100,
    unit: '550 جم'
  },
  {
    id: 'bk5',
    name: 'كرواسون سيفن دايز شوكولاتة',
    nameEn: '7 Days Chocolate Croissant',
    price: 8.50,
    imagePublicId: 'pandamarket/categories/bakery/products/chocolate-croissant/1',
    imagePublicIds: getPublicIds('bakery', 'chocolate-croissant', 4),
    category: 'bakery',
    description: 'كرواسون محشي شوكولاتة',
    descriptionEn: 'Chocolate filled croissant',
    brand: '7Days',
    stock: 120,
    unit: 'قطعة'
  },
  {
    id: 'bk6',
    name: 'كرواسون فانيليا',
    nameEn: 'Vanilla Croissant',
    price: 8.00,
    imagePublicId: 'pandamarket/categories/bakery/products/vanilla-croissant/1',
    imagePublicIds: getPublicIds('bakery', 'vanilla-croissant', 4),
    category: 'bakery',
    description: 'كرواسون بحشوة الفانيليا',
    descriptionEn: 'Vanilla cream filled croissant',
    brand: '7Days',
    stock: 110,
    unit: 'قطعة'
  },
  {
    id: 'bk7',
    name: 'خبز الشوفان',
    nameEn: 'Oat Bread',
    price: 18.00,
    imagePublicId: 'pandamarket/categories/bakery/products/oat-bread/1',
    imagePublicIds: getPublicIds('bakery', 'oat-bread', 4),
    category: 'bakery',
    description: 'خبز الشوفان الصحي',
    descriptionEn: 'Healthy oat bread',
    brand: 'فاين',
    stock: 80,
    unit: 'رغيف'
  },
  {
    id: 'bk8',
    name: 'باجيت فرنسي',
    nameEn: 'French Baguette',
    price: 10.00,
    imagePublicId: 'pandamarket/categories/bakery/products/french-baguette/1',
    imagePublicIds: getPublicIds('bakery', 'french-baguette', 4),
    category: 'bakery',
    description: 'باجيت فرنسي طازج',
    descriptionEn: 'Fresh French baguette',
    brand: 'محلي',
    stock: 70,
    unit: 'رغيف'
  },
  {
    id: 'bk9',
    name: 'عيش السن',
    nameEn: 'Bran Bread',
    price: 7.00,
    imagePublicId: 'pandamarket/categories/bakery/products/bran-bread/1',
    imagePublicIds: getPublicIds('bakery', 'bran-bread', 4),
    category: 'bakery',
    description: 'عيش السن الصحي بالردة',
    descriptionEn: 'Healthy bran bread',
    brand: 'محلي',
    stock: 90,
    unit: 'رغيف'
  },
  {
    id: 'bk10',
    name: 'خبز برجر',
    nameEn: 'Burger Buns',
    price: 15.00,
    imagePublicId: 'pandamarket/categories/bakery/products/burger-buns/1',
    imagePublicIds: getPublicIds('bakery', 'burger-buns', 4),
    category: 'bakery',
    description: 'خبز برجر 6 قطع',
    descriptionEn: 'Burger buns 6 pieces',
    brand: 'فاين',
    stock: 100,
    unit: 'عبوة 6 قطع'
  },
  {
    id: 'bk11',
    name: 'خبز هوت دوج',
    nameEn: 'Hot Dog Buns',
    price: 14.00,
    imagePublicId: 'pandamarket/categories/bakery/products/hot-dog-buns/1',
    imagePublicIds: getPublicIds('bakery', 'hot-dog-buns', 4),
    category: 'bakery',
    description: 'خبز هوت دوج 6 قطع',
    descriptionEn: 'Hot dog buns 6 pieces',
    brand: 'فاين',
    stock: 95,
    unit: 'عبوة 6 قطع'
  },
  {
    id: 'bk12',
    name: 'كعك بالسمسم',
    nameEn: 'Sesame Bagel',
    price: 6.00,
    imagePublicId: 'pandamarket/categories/bakery/products/sesame-bagel/1',
    imagePublicIds: getPublicIds('bakery', 'sesame-bagel', 4),
    category: 'bakery',
    description: 'كعك محمص بالسمسم',
    descriptionEn: 'Toasted sesame bagel',
    brand: 'محلي',
    stock: 85,
    unit: 'قطعة'
  },

  // ============================================
  // 🌶️ SPICES - التوابل
  // ============================================
  {
    id: 'sp1',
    name: 'كمون',
    nameEn: 'Cumin',
    price: 25.00,
    imagePublicId: 'pandamarket/categories/spices/products/cumin/1',
    imagePublicIds: getPublicIds('spices', 'cumin', 4),
    category: 'spices',
    description: 'كمون مطحون عالي الجودة',
    descriptionEn: 'High quality ground cumin',
    brand: 'أبو على',
    stock: 80,
    unit: '100 جم'
  },
  {
    id: 'sp2',
    name: 'فلفل أسود',
    nameEn: 'Black Pepper',
    price: 30.00,
    imagePublicId: 'pandamarket/categories/spices/products/black-pepper/1',
    imagePublicIds: getPublicIds('spices', 'black-pepper', 4),
    category: 'spices',
    description: 'فلفل أسود مطحون',
    descriptionEn: 'Ground black pepper',
    brand: 'أبو على',
    stock: 90,
    unit: '100 جم'
  },
  {
    id: 'sp3',
    name: 'كركم',
    nameEn: 'Turmeric',
    price: 20.00,
    imagePublicId: 'pandamarket/categories/spices/products/turmeric/1',
    imagePublicIds: getPublicIds('spices', 'turmeric', 4),
    category: 'spices',
    description: 'كركم بودرة نقي',
    descriptionEn: 'Pure turmeric powder',
    brand: 'أبو على',
    stock: 85,
    unit: '100 جم'
  },
  {
    id: 'sp4',
    name: 'كزبرة ناشفة',
    nameEn: 'Coriander',
    price: 18.00,
    imagePublicId: 'pandamarket/categories/spices/products/coriander/1',
    imagePublicIds: getPublicIds('spices', 'coriander', 4),
    category: 'spices',
    description: 'كزبرة مطحونة',
    descriptionEn: 'Ground coriander',
    brand: 'أبو على',
    stock: 75,
    unit: '100 جم'
  },
  {
    id: 'sp5',
    name: 'قرفة',
    nameEn: 'Cinnamon',
    price: 35.00,
    imagePublicId: 'pandamarket/categories/spices/products/cinnamon/1',
    imagePublicIds: getPublicIds('spices', 'cinnamon', 4),
    category: 'spices',
    description: 'قرفة مطحونة',
    descriptionEn: 'Ground cinnamon',
    brand: 'أبو على',
    stock: 70,
    unit: '100 جم'
  },

  // ============================================
  // 🥛 DAIRY - الألبان
  // ============================================
  {
    id: 'da1',
    name: 'حليب جهينة كامل الدسم 1 لتر',
    nameEn: 'Juhayna Full Cream Milk 1L',
    price: 22.00,
    imagePublicId: 'pandamarket/categories/dairy/products/juhayna-full-cream-milk-1l/1',
    imagePublicIds: getPublicIds('dairy', 'juhayna-full-cream-milk-1l', 4),
    category: 'dairy',
    description: 'حليب جهينة كامل الدسم 1 لتر',
    descriptionEn: 'Juhayna full cream milk 1L',
    brand: 'جهينة',
    stock: 200,
    unit: '1 لتر'
  },
  {
    id: 'da2',
    name: 'لبن جهينة خالي الدسم 1 لتر',
    nameEn: 'Juhayna Skim Milk 1L',
    price: 20.00,
    imagePublicId: 'pandamarket/categories/dairy/products/juhayna-skim-milk-1l/1',
    imagePublicIds: getPublicIds('dairy', 'juhayna-skim-milk-1l', 4),
    category: 'dairy',
    description: 'لبن جهينة خالي الدسم 1 لتر',
    descriptionEn: 'Juhayna skim milk 1L',
    brand: 'جهينة',
    stock: 150,
    unit: '1 لتر'
  },
  {
    id: 'da3',
    name: 'زبادي جهينة طبيعي',
    nameEn: 'Juhayna Plain Yogurt',
    price: 12.00,
    imagePublicId: 'pandamarket/categories/dairy/products/juhayna-plain-yogurt/1',
    imagePublicIds: getPublicIds('dairy', 'juhayna-plain-yogurt', 4),
    category: 'dairy',
    description: 'زبادي طبيعي 200 جم',
    descriptionEn: 'Plain yogurt 200g',
    brand: 'جهينة',
    stock: 180,
    unit: '200 جم'
  },
  {
    id: 'da4',
    name: 'جبنة بيضاء دومتي',
    nameEn: 'Domty White Cheese',
    price: 45.00,
    imagePublicId: 'pandamarket/categories/dairy/products/domty-white-cheese/1',
    imagePublicIds: getPublicIds('dairy', 'domty-white-cheese', 4),
    category: 'dairy',
    description: 'جبنة بيضاء دمياطي 500 جم',
    descriptionEn: 'Domty white cheese 500g',
    brand: 'دمتي',
    stock: 100,
    unit: '500 جم'
  },
  {
    id: 'da5',
    name: 'زبدة لورباك',
    nameEn: 'Lurpak Butter',
    price: 65.00,
    imagePublicId: 'pandamarket/categories/dairy/products/lurpak-butter/1',
    imagePublicIds: getPublicIds('dairy', 'lurpak-butter', 4),
    category: 'dairy',
    description: 'زبدة لورباك الدنماركية 250 جم',
    descriptionEn: 'Danish Lurpak butter 250g',
    brand: 'لورباك',
    stock: 80,
    unit: '250 جم'
  },

  // ============================================
  // 🥤 BEVERAGES - المشروبات
  // ============================================
  {
    id: 'be1',
    name: 'كوكاكولا 1 لتر',
    nameEn: 'Coca Cola 1L',
    price: 18.00,
    imagePublicId: 'pandamarket/categories/beverages/products/coca-cola-1l/1',
    imagePublicIds: getPublicIds('beverages', 'coca-cola-1l', 4),
    category: 'beverages',
    description: 'مشروب كوكاكولا الأصلي 1 لتر',
    descriptionEn: 'Original Coca Cola 1L',
    brand: 'كوكاكولا',
    stock: 250,
    unit: '1 لتر'
  },
  {
    id: 'be2',
    name: 'بيبسي 1 لتر',
    nameEn: 'Pepsi 1L',
    price: 17.00,
    imagePublicId: 'pandamarket/categories/beverages/products/pepsi-1l/1',
    imagePublicIds: getPublicIds('beverages', 'pepsi-1l', 4),
    category: 'beverages',
    description: 'مشروب بيبسي 1 لتر',
    descriptionEn: 'Pepsi 1L',
    brand: 'بيبسي',
    stock: 200,
    unit: '1 لتر'
  },
  {
    id: 'be3',
    name: 'ماء سيوة 1.5 لتر',
    nameEn: 'Siwa Water 1.5L',
    price: 5.00,
    imagePublicId: 'pandamarket/categories/beverages/products/siwa-water-1.5l/1',
    imagePublicIds: getPublicIds('beverages', 'siwa-water-1.5l', 4),
    category: 'beverages',
    description: 'مياه سيوة الطبيعية 1.5 لتر',
    descriptionEn: 'Siwa natural water 1.5L',
    brand: 'سيوة',
    stock: 500,
    unit: '1.5 لتر'
  },
  {
    id: 'be4',
    name: 'عصير جهينة برتقال 1 لتر',
    nameEn: 'Juhayna Orange Juice 1L',
    price: 25.00,
    imagePublicId: 'pandamarket/categories/beverages/products/juhayna-orange-juice-1l/1',
    imagePublicIds: getPublicIds('beverages', 'juhayna-orange-juice-1l', 4),
    category: 'beverages',
    description: 'عصير برتقال طبيعي 100% 1 لتر',
    descriptionEn: '100% natural orange juice 1L',
    brand: 'جهينة',
    stock: 120,
    unit: '1 لتر'
  },
  {
    id: 'be5',
    name: 'نسكافيه جولد 200 جم',
    nameEn: 'Nescafe Gold 200g',
    price: 120.00,
    imagePublicId: 'pandamarket/categories/beverages/products/nescafe-gold-200g/1',
    imagePublicIds: getPublicIds('beverages', 'nescafe-gold-200g', 4),
    category: 'beverages',
    description: 'قهوة نسكافيه جولد 200 جم',
    descriptionEn: 'Nescafe Gold coffee 200g',
    brand: 'نسكافيه',
    stock: 90,
    unit: '200 جم'
  },

  // ============================================
  // 🍿 SNACKS - السناكس
  // ============================================
  {
    id: 'sn1',
    name: 'تشيبسي جبنة',
    nameEn: 'Chipsy Cheese',
    price: 12.00,
    imagePublicId: 'pandamarket/categories/snacks/products/chipsy-cheese/1',
    imagePublicIds: getPublicIds('snacks', 'chipsy-cheese', 4),
    category: 'snacks',
    description: 'بطاطس تشيبسي بالجبنة 60 جم',
    descriptionEn: 'Chipsy cheese chips 60g',
    brand: 'تشيبسي',
    stock: 300,
    unit: '60 جم'
  },
  {
    id: 'sn2',
    name: 'تشيبسي كاتشب',
    nameEn: 'Chipsy Ketchup',
    price: 12.00,
    imagePublicId: 'pandamarket/categories/snacks/products/chipsy-ketchup/1',
    imagePublicIds: getPublicIds('snacks', 'chipsy-ketchup', 4),
    category: 'snacks',
    description: 'بطاطس تشيبسي بالكاتشب 60 جم',
    descriptionEn: 'Chipsy ketchup chips 60g',
    brand: 'تشيبسي',
    stock: 280,
    unit: '60 جم'
  },
  {
    id: 'sn3',
    name: 'دوريتوس ناچو تشيز',
    nameEn: 'Doritos Nacho Cheese',
    price: 15.00,
    imagePublicId: 'pandamarket/categories/snacks/products/doritos-nacho-cheese/1',
    imagePublicIds: getPublicIds('snacks', 'doritos-nacho-cheese', 4),
    category: 'snacks',
    description: 'دوريتوس بنكهة الجبنة 60 جم',
    descriptionEn: 'Doritos nacho cheese 60g',
    brand: 'دوريتوس',
    stock: 200,
    unit: '60 جم'
  },
  {
    id: 'sn4',
    name: 'بريتز مالح',
    nameEn: 'Salted Pretzels',
    price: 18.00,
    imagePublicId: 'pandamarket/categories/snacks/products/salted-pretzels/1',
    imagePublicIds: getPublicIds('snacks', 'salted-pretzels', 4),
    category: 'snacks',
    description: 'بريتز بالملح 120 جم',
    descriptionEn: 'Salted pretzels 120g',
    brand: 'محلي',
    stock: 150,
    unit: '120 جم'
  },
  {
    id: 'sn5',
    name: 'مكسرات مشكلة',
    nameEn: 'Mixed Nuts',
    price: 45.00,
    imagePublicId: 'pandamarket/categories/snacks/products/mixed-nuts/1',
    imagePublicIds: getPublicIds('snacks', 'mixed-nuts', 4),
    category: 'snacks',
    description: 'مكسرات مشكلة محمصة 200 جم',
    descriptionEn: 'Roasted mixed nuts 200g',
    brand: 'محلي',
    stock: 80,
    unit: '200 جم'
  },

  // ============================================
  // 🧊 FROZEN - المجمدات
  // ============================================
  {
    id: 'fr1',
    name: 'بطاطس مقلية مجمدة',
    nameEn: 'Frozen French Fries',
    price: 35.00,
    imagePublicId: 'pandamarket/categories/frozen/products/frozen-french-fries/1',
    imagePublicIds: getPublicIds('frozen', 'frozen-french-fries', 4),
    category: 'frozen',
    description: 'بطاطس مقلية جاهزة للقلي 1 كيلو',
    descriptionEn: 'Ready to fry french fries 1kg',
    brand: 'محلي',
    stock: 100,
    unit: '1 كيلو'
  },
  {
    id: 'fr2',
    name: 'فروج مجمد كامل',
    nameEn: 'Whole Frozen Chicken',
    price: 85.00,
    imagePublicId: 'pandamarket/categories/frozen/products/whole-frozen-chicken/1',
    imagePublicIds: getPublicIds('frozen', 'whole-frozen-chicken', 4),
    category: 'frozen',
    description: 'فروج مجمد كامل 1.2 كيلو',
    descriptionEn: 'Whole frozen chicken 1.2kg',
    brand: 'محلي',
    stock: 50,
    unit: '1.2 كيلو'
  },
  {
    id: 'fr3',
    name: 'خضار مشكلة مجمدة',
    nameEn: 'Frozen Mixed Vegetables',
    price: 25.00,
    imagePublicId: 'pandamarket/categories/frozen/products/frozen-mixed-vegetables/1',
    imagePublicIds: getPublicIds('frozen', 'frozen-mixed-vegetables', 4),
    category: 'frozen',
    description: 'خضار مشكلة (جزر، بازلاء، ذرة) 450 جم',
    descriptionEn: 'Mixed vegetables (carrots, peas, corn) 450g',
    brand: 'محلي',
    stock: 120,
    unit: '450 جم'
  },

  // ============================================
  // 🧴 PERSONAL CARE - العناية الشخصية
  // ============================================
  {
    id: 'pc1',
    name: 'شامبو هيد آند شولدرز',
    nameEn: 'Head & Shoulders Shampoo',
    price: 65.00,
    imagePublicId: 'pandamarket/categories/personal-care/products/head-shoulders-shampoo/1',
    imagePublicIds: getPublicIds('personal-care', 'head-shoulders-shampoo', 4),
    category: 'personal-care',
    description: 'شامبو ضد القشرة 400 مل',
    descriptionEn: 'Anti-dandruff shampoo 400ml',
    brand: 'هيد آند شولدرز',
    stock: 80,
    unit: '400 مل'
  },
  {
    id: 'pc2',
    name: 'معجون أسنان كولجيت',
    nameEn: 'Colgate Toothpaste',
    price: 28.00,
    imagePublicId: 'pandamarket/categories/personal-care/products/colgate-toothpaste/1',
    imagePublicIds: getPublicIds('personal-care', 'colgate-toothpaste', 4),
    category: 'personal-care',
    description: 'معجون أسنان للحماية الكاملة 100 مل',
    descriptionEn: 'Total protection toothpaste 100ml',
    brand: 'كولجيت',
    stock: 150,
    unit: '100 مل'
  },
  {
    id: 'pc3',
    name: 'صابون دوف',
    nameEn: 'Dove Soap',
    price: 22.00,
    imagePublicId: 'pandamarket/categories/personal-care/products/dove-soap/1',
    imagePublicIds: getPublicIds('personal-care', 'dove-soap', 4),
    category: 'personal-care',
    description: 'صابون دوف المرطب 100 جم',
    descriptionEn: 'Dove moisturizing soap 100g',
    brand: 'دوف',
    stock: 200,
    unit: '100 جم'
  },

  // ============================================
  // 🏠 HOUSEHOLD - مستلزمات المنزل
  // ============================================
  {
    id: 'ho1',
    name: 'منظّف أرضيات فانيش',
    nameEn: 'Vanish Floor Cleaner',
    price: 35.00,
    imagePublicId: 'pandamarket/categories/household/products/vanish-floor-cleaner/1',
    imagePublicIds: getPublicIds('household', 'vanish-floor-cleaner', 4),
    category: 'household',
    description: 'منظف أرضيات مركز 1 لتر',
    descriptionEn: 'Concentrated floor cleaner 1L',
    brand: 'فانيش',
    stock: 100,
    unit: '1 لتر'
  },
  {
    id: 'ho2',
    name: 'سائل جلي فيري',
    nameEn: 'Fairy Dishwashing Liquid',
    price: 28.00,
    imagePublicId: 'pandamarket/categories/household/products/fairy-dishwashing-liquid/1',
    imagePublicIds: getPublicIds('household', 'fairy-dishwashing-liquid', 4),
    category: 'household',
    description: 'سائل جلي الأواني 500 مل',
    descriptionEn: 'Dishwashing liquid 500ml',
    brand: 'فيري',
    stock: 120,
    unit: '500 مل'
  },
  {
    id: 'ho3',
    name: 'مناديل فاين',
    nameEn: 'Fine Tissues',
    price: 18.00,
    imagePublicId: 'pandamarket/categories/household/products/fine-tissues/1',
    imagePublicIds: getPublicIds('household', 'fine-tissues', 4),
    category: 'household',
    description: 'مناديل ورقية فاين 150 منديل',
    descriptionEn: 'Fine paper tissues 150 sheets',
    brand: 'فاين',
    stock: 200,
    unit: '150 منديل'
  },

  // ============================================
  // 🥬 VEGETABLES - الخضروات
  // ============================================
  {
    id: 've1',
    name: 'طماطم حمراء',
    nameEn: 'Red Tomatoes',
    price: 12.00,
    imagePublicId: 'pandamarket/categories/vegetables/products/red-tomatoes/1',
    imagePublicIds: getPublicIds('vegetables', 'red-tomatoes', 4),
    category: 'vegetables',
    description: 'طماطم حمراء طازجة كيلو',
    descriptionEn: 'Fresh red tomatoes per kg',
    brand: 'محلي',
    stock: 200,
    unit: 'كيلو'
  },
  {
    id: 've2',
    name: 'خيار بلدي',
    nameEn: 'Local Cucumber',
    price: 10.00,
    imagePublicId: 'pandamarket/categories/vegetables/products/local-cucumber/1',
    imagePublicIds: getPublicIds('vegetables', 'local-cucumber', 4),
    category: 'vegetables',
    description: 'خيار بلدي طازج كيلو',
    descriptionEn: 'Fresh local cucumber per kg',
    brand: 'محلي',
    stock: 180,
    unit: 'كيلو'
  },
  {
    id: 've3',
    name: 'بصل أحمر',
    nameEn: 'Red Onion',
    price: 8.00,
    imagePublicId: 'pandamarket/categories/vegetables/products/red-onion/1',
    imagePublicIds: getPublicIds('vegetables', 'red-onion', 4),
    category: 'vegetables',
    description: 'بصل أحمر طازج كيلو',
    descriptionEn: 'Fresh red onion per kg',
    brand: 'محلي',
    stock: 250,
    unit: 'كيلو'
  },

  // ============================================
  // 🍎 FRUITS - الفواكه
  // ============================================
  {
    id: 'fr1',
    name: 'موز مستورد',
    nameEn: 'Imported Bananas',
    price: 15.00,
    imagePublicId: 'pandamarket/categories/fruits/products/imported-bananas/1',
    imagePublicIds: getPublicIds('fruits', 'imported-bananas', 4),
    category: 'fruits',
    description: 'موز مستورد طازج كيلو',
    descriptionEn: 'Fresh imported bananas per kg',
    brand: 'مستورد',
    stock: 300,
    unit: 'كيلو'
  },
  {
    id: 'fr2',
    name: 'تفاح أحمر',
    nameEn: 'Red Apples',
    price: 35.00,
    imagePublicId: 'pandamarket/categories/fruits/products/red-apples/1',
    imagePublicIds: getPublicIds('fruits', 'red-apples', 4),
    category: 'fruits',
    description: 'تفاح أحمر طازج كيلو',
    descriptionEn: 'Fresh red apples per kg',
    brand: 'مستورد',
    stock: 150,
    unit: 'كيلو'
  },
  {
    id: 'fr3',
    name: 'برتقال صيفي',
    nameEn: 'Summer Oranges',
    price: 18.00,
    imagePublicId: 'pandamarket/categories/fruits/products/summer-oranges/1',
    imagePublicIds: getPublicIds('fruits', 'summer-oranges', 4),
    category: 'fruits',
    description: 'برتقال صيفي طازج كيلو',
    descriptionEn: 'Fresh summer oranges per kg',
    brand: 'محلي',
    stock: 200,
    unit: 'كيلو'
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
  { id: 'bakery', name: 'المخبوزات', nameEn: 'Bakery', slug: 'bakery' },
  { id: 'spices', name: 'التوابل', nameEn: 'Spices', slug: 'spices' },
  { id: 'dairy', name: 'الألبان', nameEn: 'Dairy', slug: 'dairy' },
  { id: 'beverages', name: 'المشروبات', nameEn: 'Beverages', slug: 'beverages' },
  { id: 'snacks', name: 'السناكس', nameEn: 'Snacks', slug: 'snacks' },
  { id: 'frozen', name: 'المجمدات', nameEn: 'Frozen', slug: 'frozen' },
  { id: 'personal-care', name: 'العناية الشخصية', nameEn: 'Personal Care', slug: 'personal-care' },
  { id: 'household', name: 'مستلزمات المنزل', nameEn: 'Household', slug: 'household' },
  { id: 'vegetables', name: 'الخضروات', nameEn: 'Vegetables', slug: 'vegetables' },
  { id: 'fruits', name: 'الفواكه', nameEn: 'Fruits', slug: 'fruits' },
];