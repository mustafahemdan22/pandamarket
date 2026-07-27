const fs = require('fs');
const path = require('path');

const categories = [
  { name: "الخضروات والفواكه الطازجة", nameEn: "Fresh Produce", slug: "produce" },
  { name: "الألبان والبيض والجبن", nameEn: "Dairy, Eggs & Cheese", slug: "dairy" },
  { name: "اللحوم والدواجن", nameEn: "Meat & Poultry", slug: "meat" },
  { name: "الأغذية المجمدة", nameEn: "Frozen Foods", slug: "frozen" },
  { name: "الأرز والمكرونة والبقوليات", nameEn: "Pantry & Grains", slug: "pantry" },
  { name: "الزيوت والسمن والصلصات", nameEn: "Oils, Ghee & Spices", slug: "condiments" },
  { name: "الوجبات الخفيفة والحلويات", nameEn: "Snacks & Sweets", slug: "snacks" },
  { name: "المشروبات والعصائر", nameEn: "Beverages & Juices", slug: "beverages" },
  { name: "المنظفات والأدوات المنزلية", nameEn: "Household & Cleaning", slug: "cleaning" },
  { name: "العناية الشخصية", nameEn: "Personal Care", slug: "personal-care" },
  { name: "منتجات الأطفال", nameEn: "Baby Care", slug: "baby-care" },
  { name: "المخبوزات والخبز", nameEn: "Bakery & Bread", slug: "bakery" }
];

const products = [];

function addProduct(opts) {
  const slug = opts.slug || opts.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const catSlug = opts.category;
  const suffixNum = 1;
  const publicId = `pandamarket/categories/${catSlug}/products/${slug}/${suffixNum}`;
  products.push({
    name: opts.name,
    nameEn: opts.nameEn,
    slug,
    price: opts.price,
    compareAtPrice: opts.compareAtPrice || Math.round(opts.price * 1.15),
    category: catSlug,
    subcategory: opts.subcategory || '',
    brand: opts.brand || '',
    unit: opts.unit || '1 piece',
    description: opts.description || '',
    descriptionEn: opts.descriptionEn || '',
    stock: opts.stock || 100,
    discount: opts.discount || Math.floor(Math.random() * 15) + 5,
    rating: opts.rating || +(4 + Math.random()).toFixed(1),
    reviews: opts.reviews || Math.floor(Math.random() * 300) + 50,
    readinessStatus: "active_sellable",
    isFulfillable: true,
    imagePublicId: publicId,
    imagePublicIds: [publicId],
    imageSecureUrls: [],
    imagePrompt: opts.imagePrompt || `Studio product photo of ${opts.nameEn} on white background, commercial grocery photography, clean lighting.`
  });
}

// ==================== PRODUCE (25) ====================
const cat = 'produce';

addProduct({ name: 'طماطم بلدي طازجة 1 كيلو', nameEn: 'Fresh Local Tomatoes 1 kg', category: cat, price: 18, compareAtPrice: 22, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'طماطم طازجة حمراء عالية الجودة مناسبة للسلطة والطهي', descriptionEn: 'Fresh vine-ripened red tomatoes ideal for salads and cooking', stock: 150, discount: 18, rating: 4.8, reviews: 210,
  imagePrompt: 'Fresh red tomatoes with green stems on white background, commercial grocery product shot, soft studio lighting.' });

addProduct({ name: 'موز بلدي فاخر 1 كيلو', nameEn: 'Premium Local Bananas 1 kg', category: cat, price: 25, compareAtPrice: 28, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'موز بلدي حلو المذاق غني بالبوتاسيوم والطاقة', descriptionEn: 'Sweet local yellow bananas rich in potassium and energy', stock: 120, discount: 10, rating: 4.7, reviews: 180,
  imagePrompt: 'Fresh yellow banana bunch studio packshot on white isolated background, crisp commercial grocery lighting.' });

addProduct({ name: 'بطاطس طهي طازجة 1 كيلو', nameEn: 'Fresh Cooking Potatoes 1 kg', category: cat, price: 20, compareAtPrice: 24, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'بطاطس طازجة ممتازة للقلي والطهي في الفرن', descriptionEn: 'Fresh unpeeled potatoes suitable for frying, boiling and baking', stock: 200, discount: 16, rating: 4.6, reviews: 140,
  imagePrompt: 'Clean fresh raw potatoes on white backdrop, professional supermarket produce shot.' });

addProduct({ name: 'خيار صوبة طازج 1 كيلو', nameEn: 'Fresh Greenhouse Cucumbers 1 kg', category: cat, price: 16, compareAtPrice: 20, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'خيار صوبة طازج ومقرمش ممتاز للسلطات والوجبات السريعة', descriptionEn: 'Fresh crispy greenhouse cucumbers perfect for salads', stock: 130, discount: 20, rating: 4.5, reviews: 95,
  imagePrompt: 'Fresh green cucumbers arranged neatly on white background, grocery produce photography.' });

addProduct({ name: 'تفاح أحمر مستورد 1 كيلو', nameEn: 'Imported Red Apples 1 kg', category: cat, price: 45, compareAtPrice: 55, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'تفاح أحمر لذيذ طازج مستورد', descriptionEn: 'Fresh sweet imported red apples', stock: 90, discount: 18, rating: 4.8, reviews: 200,
  imagePrompt: 'Fresh red apples with stems on white background, commercial fruit photography.' });

addProduct({ name: 'بصل أبيض طازج 1 كيلو', nameEn: 'Fresh White Onions 1 kg', category: cat, price: 15, compareAtPrice: 18, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'بصل أبيض طازج عالي الجودة', descriptionEn: 'Fresh high-quality white onions', stock: 180, discount: 16, rating: 4.5, reviews: 120,
  imagePrompt: 'Fresh white onions studio shot on white background, bulk produce photography.' });

addProduct({ name: 'برتقال بلدي عصير 1 كيلو', nameEn: 'Local Juice Oranges 1 kg', category: cat, price: 22, compareAtPrice: 26, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'برتقال بلدي حلو ممتاز للعصير الطازج', descriptionEn: 'Sweet local oranges perfect for fresh juice', stock: 160, discount: 15, rating: 4.6, reviews: 150,
  imagePrompt: 'Fresh oranges pile on white background, citrus fruit photography for grocery.' });

addProduct({ name: 'عنب أحمر طازج 500 جم', nameEn: 'Fresh Red Grapes 500 g', category: cat, price: 30, compareAtPrice: 35, subcategory: 'fruits', brand: 'Fresh Farm', unit: '500 g', description: 'عنب أحمر حلو الطعم طازج', descriptionEn: 'Fresh sweet red grapes', stock: 80, discount: 14, rating: 4.7, reviews: 90,
  imagePrompt: 'Fresh red grape bunch on white background, fruit studio photography.' });

addProduct({ name: 'جزر طازج 1 كيلو', nameEn: 'Fresh Carrots 1 kg', category: cat, price: 14, compareAtPrice: 17, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'جزر طازج ونظيف مناسب للسلطة والطهي', descriptionEn: 'Fresh clean carrots for salads and cooking', stock: 140, discount: 17, rating: 4.4, reviews: 80,
  imagePrompt: 'Fresh orange carrots with green tops on white background, vegetable photography.' });

addProduct({ name: 'ليمون بلدي طازج 1 كيلو', nameEn: 'Fresh Local Lemons 1 kg', category: cat, price: 20, compareAtPrice: 24, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'ليمون بلدي طازج غني بفيتامين سي', descriptionEn: 'Fresh local lemons rich in vitamin C', stock: 120, discount: 16, rating: 4.5, reviews: 110,
  imagePrompt: 'Fresh yellow lemons on white background, citrus fruit product shot.' });

addProduct({ name: 'فلفل أخضر رومي 500 جم', nameEn: 'Green Bell Peppers 500 g', category: cat, price: 18, compareAtPrice: 22, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '500 g', description: 'فلفل أخضر حلو طازج', descriptionEn: 'Fresh sweet green bell peppers', stock: 100, discount: 18, rating: 4.3, reviews: 65,
  imagePrompt: 'Fresh green bell peppers on white background, vegetable studio photography.' });

addProduct({ name: 'مانجو سكري طازج 1 كيلو', nameEn: 'Fresh Sweet Mangoes 1 kg', category: cat, price: 55, compareAtPrice: 65, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'مانجو سكري طازج ذو طعم رائع', descriptionEn: 'Fresh sweet mangoes with amazing flavor', stock: 60, discount: 15, rating: 4.9, reviews: 250,
  imagePrompt: 'Fresh ripe yellow mangoes on white background, tropical fruit photography.' });

addProduct({ name: 'كوسة طازجة 1 كيلو', nameEn: 'Fresh Zucchini 1 kg', category: cat, price: 16, compareAtPrice: 19, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'كوسة طازجة خضراء مناسبة للطهي', descriptionEn: 'Fresh green zucchini perfect for cooking', stock: 110, discount: 15, rating: 4.4, reviews: 75,
  imagePrompt: 'Fresh green zucchini arranged on white background, vegetable product photography.' });

addProduct({ name: 'بطيحة حمراء طازجة', nameEn: 'Fresh Watermelon 1 piece', category: cat, price: 35, compareAtPrice: 45, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 piece', description: 'بطيحة حمراء طازجة حلوة', descriptionEn: 'Fresh sweet red watermelon', stock: 40, discount: 22, rating: 4.8, reviews: 180,
  imagePrompt: 'Whole fresh watermelon on white background, summer fruit photography.' });

addProduct({ name: 'باذنجان رومي طازج 1 كيلو', nameEn: 'Fresh Italian Eggplant 1 kg', category: cat, price: 14, compareAtPrice: 17, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'باذنجان رومي طازج أرجواني غامق', descriptionEn: 'Fresh dark purple Italian eggplants', stock: 90, discount: 17, rating: 4.3, reviews: 60,
  imagePrompt: 'Fresh purple eggplants on white background, vegetable photography.' });

addProduct({ name: 'جوافة طازجة 1 كيلو', nameEn: 'Fresh Guavas 1 kg', category: cat, price: 24, compareAtPrice: 28, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'جوافة طازجة عطرية الطعم', descriptionEn: 'Fresh aromatic guavas', stock: 70, discount: 14, rating: 4.6, reviews: 100,
  imagePrompt: 'Fresh green guavas on white background, tropical fruit product shot.' });

addProduct({ name: 'فاصوليا خضراء طازجة 500 جم', nameEn: 'Fresh Green Beans 500 g', category: cat, price: 22, compareAtPrice: 26, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '500 g', description: 'فاصوليا خضراء طازجة ومقرمشة', descriptionEn: 'Fresh crispy green beans', stock: 80, discount: 15, rating: 4.4, reviews: 55,
  imagePrompt: 'Fresh green beans bunch on white background, vegetable studio shot.' });

addProduct({ name: 'فراولة طازجة 500 جم', nameEn: 'Fresh Strawberries 500 g', category: cat, price: 35, compareAtPrice: 42, subcategory: 'fruits', brand: 'Fresh Farm', unit: '500 g', description: 'فراولة طازجة حمراء وحلوة', descriptionEn: 'Fresh sweet red strawberries', stock: 50, discount: 16, rating: 4.9, reviews: 220,
  imagePrompt: 'Fresh red strawberries with leaves on white background, berry fruit photography.' });

addProduct({ name: 'سبانخ طازجة 500 جم', nameEn: 'Fresh Spinach 500 g', category: cat, price: 12, compareAtPrice: 15, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '500 g', description: 'سبانخ طازجة خضراء غنية بالحديد', descriptionEn: 'Fresh green spinach rich in iron', stock: 60, discount: 20, rating: 4.2, reviews: 45,
  imagePrompt: 'Fresh green spinach leaves on white background, leafy vegetable photography.' });

addProduct({ name: 'كانتالوب طازج 1 كيلو', nameEn: 'Fresh Cantaloupe 1 kg', category: cat, price: 28, compareAtPrice: 33, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'كانتالوب طازج حلو ومنعش', descriptionEn: 'Fresh sweet cantaloupe melon', stock: 45, discount: 15, rating: 4.6, reviews: 85,
  imagePrompt: 'Fresh cantaloupe melon half on white background, fruit photography.' });

addProduct({ name: 'بقدونس طازج حزمة', nameEn: 'Fresh Parsley Bunch', category: cat, price: 5, compareAtPrice: 7, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 bunch', description: 'بقدونس طازج أخضر منعش', descriptionEn: 'Fresh green parsley bunch', stock: 200, discount: 28, rating: 4.3, reviews: 40,
  imagePrompt: 'Fresh green parsley bunch on white background, herb photography.' });

addProduct({ name: 'نعناع طازج حزمة', nameEn: 'Fresh Mint Bunch', category: cat, price: 5, compareAtPrice: 7, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 bunch', description: 'نعناع طازج أخضر عطري', descriptionEn: 'Fresh aromatic green mint', stock: 180, discount: 28, rating: 4.4, reviews: 50,
  imagePrompt: 'Fresh green mint leaves bunch on white background, herb photography.' });

addProduct({ name: 'أناناس طازج', nameEn: 'Fresh Pineapple 1 piece', category: cat, price: 60, compareAtPrice: 75, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 piece', description: 'أناناس طازج حلو واستوائي', descriptionEn: 'Fresh sweet tropical pineapple', stock: 30, discount: 20, rating: 4.7, reviews: 130,
  imagePrompt: 'Whole fresh pineapple on white background, tropical fruit studio photography.' });

addProduct({ name: 'كمثرى طازجة 1 كيلو', nameEn: 'Fresh Pears 1 kg', category: cat, price: 40, compareAtPrice: 48, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'كمثرى طازجة حلوة وعصيرية', descriptionEn: 'Fresh sweet juicy pears', stock: 55, discount: 16, rating: 4.6, reviews: 95,
  imagePrompt: 'Fresh green-yellow pears on white background, fruit studio shot.' });

addProduct({ name: 'قرنبيط طازج', nameEn: 'Fresh Cauliflower 1 piece', category: cat, price: 20, compareAtPrice: 25, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 piece', description: 'قرنبيط طازج أبيض ونظيف', descriptionEn: 'Fresh clean white cauliflower', stock: 65, discount: 20, rating: 4.2, reviews: 48,
  imagePrompt: 'Fresh white cauliflower head on white background, vegetable photography.' });

addProduct({ name: 'ملوخية طازجة مفرومة 500 جم', nameEn: 'Fresh Molokhia 500 g', category: cat, price: 15, compareAtPrice: 18, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '500 g', description: 'ملوخية طازجة مفرومة خضراء عالية الجودة', descriptionEn: 'Fresh finely chopped green molokhia leaves', stock: 75, discount: 16, rating: 4.5, reviews: 70,
  imagePrompt: 'Fresh chopped green molokhia leaves on white background, Egyptian vegetable photography.' });

addProduct({ name: 'بطاطس حلوة طازجة 1 كيلو', nameEn: 'Fresh Sweet Potatoes 1 kg', category: cat, price: 22, compareAtPrice: 27, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'بطاطس حلوة طازجة غنية بالفيتامينات', descriptionEn: 'Fresh sweet potatoes rich in vitamins', stock: 100, discount: 18, rating: 4.5, reviews: 85,
  imagePrompt: 'Fresh orange sweet potatoes on white background, vegetable studio photography.' });

addProduct({ name: 'فجل أحمر طازج 500 جم', nameEn: 'Fresh Red Radish 500 g', category: cat, price: 10, compareAtPrice: 13, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '500 g', description: 'فجل أحمر طازج مقرمش ومنعش', descriptionEn: 'Fresh crisp and refreshing red radishes', stock: 90, discount: 23, rating: 4.3, reviews: 55,
  imagePrompt: 'Fresh red radishes with green tops on white background, vegetable photography.' });

addProduct({ name: 'سلقي طازج 1 كيلو', nameEn: 'Fresh Okra 1 kg', category: cat, price: 28, compareAtPrice: 33, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'سلقي طازج أخضر صغير الحجم ممتاز للطبخ', descriptionEn: 'Fresh small green okra perfect for cooking', stock: 70, discount: 15, rating: 4.4, reviews: 72,
  imagePrompt: 'Fresh green okra pods on white background, vegetable product photography.' });

addProduct({ name: 'بامية طازجة 500 جم', nameEn: 'Fresh Ladies Fingers 500 g', category: cat, price: 22, compareAtPrice: 27, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '500 g', description: 'بامية طازجة خضراء ناعمة مناسبة للسلطة', descriptionEn: 'Fresh tender green ladies fingers for cooking', stock: 65, discount: 18, rating: 4.3, reviews: 48,
  imagePrompt: 'Fresh green okra ladies fingers on white background, vegetable studio shot.' });

addProduct({ name: 'بصل أحمر طازج 1 كيلو', nameEn: 'Fresh Red Onions 1 kg', category: cat, price: 16, compareAtPrice: 20, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'بصل أحمر طازج حلو المذاق غني بال Ağust', descriptionEn: 'Fresh sweet red onions rich in antioxidants', stock: 150, discount: 20, rating: 4.5, reviews: 110,
  imagePrompt: 'Fresh red onions on white background, vegetable product photography.' });

addProduct({ name: 'ثوم بلدي 250 جم', nameEn: 'Fresh Local Garlic 250 g', category: cat, price: 12, compareAtPrice: 15, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '250 g', description: 'ثوم بلدي طازج عطري وأصلي', descriptionEn: 'Fresh aromatic local garlic cloves', stock: 120, discount: 20, rating: 4.6, reviews: 90,
  imagePrompt: 'Fresh garlic bulbs and cloves on white background, spice photography.' });

addProduct({ name: 'فلفل أحمر حار طازج 250 جم', nameEn: 'Fresh Hot Chili Peppers 250 g', category: cat, price: 8, compareAtPrice: 10, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '250 g', description: 'فلفل أحمر حار طازج لذيذ الحرق', descriptionEn: 'Fresh hot red chili peppers with intense heat', stock: 80, discount: 20, rating: 4.4, reviews: 60,
  imagePrompt: 'Fresh red hot chili peppers on white background, spicy vegetable photography.' });

addProduct({ name: 'كرفس طازج حزمة', nameEn: 'Fresh Celery Bunch', category: cat, price: 8, compareAtPrice: 10, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 bunch', description: 'كرفس طازج أخضر مقرمش منعش للسلطات', descriptionEn: 'Fresh crisp green celery bunch for salads', stock: 130, discount: 20, rating: 4.3, reviews: 55,
  imagePrompt: 'Fresh green celery bunch on white background, vegetable photography.' });

addProduct({ name: 'خس طازج', nameEn: 'Fresh Lettuce 1 head', category: cat, price: 10, compareAtPrice: 13, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 head', description: 'خس طازج أخضر مقرمش للسلطات والسندوتشات', descriptionEn: 'Fresh crisp green lettuce head for salads and sandwiches', stock: 140, discount: 23, rating: 4.4, reviews: 75,
  imagePrompt: 'Fresh green lettuce head on white background, salad vegetable photography.' });

addProduct({ name: 'سلق أخضر طازج 1 كيلو', nameEn: 'Fresh Green Swiss Chard 1 kg', category: cat, price: 12, compareAtPrice: 15, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'سلق أخضر طازج غني بالفيتامينات والمعادن', descriptionEn: 'Fresh green swiss chard rich in vitamins and minerals', stock: 60, discount: 20, rating: 4.2, reviews: 42,
  imagePrompt: 'Fresh green swiss chard leaves on white background, leafy vegetable photography.' });

addProduct({ name: 'برتقال ماندرين 1 كيلو', nameEn: 'Fresh Mandarins 1 kg', category: cat, price: 30, compareAtPrice: 36, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'برتقال ماندرين طازج حلو وسهل التقشير', descriptionEn: 'Fresh sweet easy-to-peel mandarins', stock: 100, discount: 16, rating: 4.7, reviews: 140,
  imagePrompt: 'Fresh mandarin oranges on white background, citrus fruit photography.' });

addProduct({ name: 'كمثرى بيكهام طازج 1 كيلو', nameEn: 'Fresh Packham Pears 1 kg', category: cat, price: 42, compareAtPrice: 50, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'كمثرى بيكهام طازجة حلوة وطريقة', descriptionEn: 'Fresh sweet and tender Packham pears', stock: 55, discount: 16, rating: 4.6, reviews: 88,
  imagePrompt: 'Fresh green Packham pears on white background, fruit studio photography.' });

addProduct({ name: 'مشمش طازج 1 كيلو', nameEn: 'Fresh Apricots 1 kg', category: cat, price: 35, compareAtPrice: 42, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'مشمش طازج برتقالي حلو ولذيذ', descriptionEn: 'Fresh sweet and delicious orange apricots', stock: 50, discount: 16, rating: 4.7, reviews: 105,
  imagePrompt: 'Fresh orange apricots on white background, stone fruit photography.' });

addProduct({ name: 'خوخ بلدي طازج 1 كيلو', nameEn: 'Fresh Local Peaches 1 kg', category: cat, price: 32, compareAtPrice: 38, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'خوخ بلدي طازج عطري وحلو', descriptionEn: 'Fresh aromatic and sweet local peaches', stock: 60, discount: 15, rating: 4.6, reviews: 95,
  imagePrompt: 'Fresh local peaches with blush skin on white background, fruit photography.' });

addProduct({ name: 'كرز أحمر طازج 500 جم', nameEn: 'Fresh Red Cherries 500 g', category: cat, price: 65, compareAtPrice: 78, subcategory: 'fruits', brand: 'Fresh Farm', unit: '500 g', description: 'كرز أحمر طازج حلو ولذيذ جداً', descriptionEn: 'Fresh sweet and delicious red cherries', stock: 40, discount: 16, rating: 4.9, reviews: 180,
  imagePrompt: 'Fresh red cherries with stems on white background, berry fruit photography.' });

addProduct({ name: 'موز أخضر طازج 1 كيلو', nameEn: 'Fresh Green Plantains 1 kg', category: cat, price: 18, compareAtPrice: 22, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'موز أخضر طازج ممتاز للقلي والطبخ', descriptionEn: 'Fresh green plantains perfect for frying and cooking', stock: 90, discount: 18, rating: 4.4, reviews: 65,
  imagePrompt: 'Fresh green plantains on white background, tropical fruit photography.' });

addProduct({ name: 'ليمون عصير بلدي 1 كيلو', nameEn: 'Fresh Juice Lemons 1 kg', category: cat, price: 15, compareAtPrice: 18, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 kg', description: 'ليمون بلدي طازج عصير حلو غني بفيتامين سي', descriptionEn: 'Fresh sweet local juice lemons rich in vitamin C', stock: 130, discount: 16, rating: 4.5, reviews: 100,
  imagePrompt: 'Fresh yellow lemons on white background, citrus fruit studio photography.' });

addProduct({ name: 'بطيخ أصفر طازج', nameEn: 'Fresh Yellow Watermelon 1 piece', category: cat, price: 30, compareAtPrice: 38, subcategory: 'fruits', brand: 'Fresh Farm', unit: '1 piece', description: 'بطيخ أصفر طازج حلو ومنعش', descriptionEn: 'Fresh sweet and refreshing yellow watermelon', stock: 35, discount: 21, rating: 4.8, reviews: 120,
  imagePrompt: 'Fresh yellow watermelon slice showing golden flesh on white background, melon photography.' });

addProduct({ name: 'باذنجان أبيض طازج 1 كيلو', nameEn: 'Fresh White Eggplant 1 kg', category: cat, price: 14, compareAtPrice: 17, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '1 kg', description: 'باذنجان أبيض طازج ناعم ممتاز للطهي', descriptionEn: 'Fresh tender white eggplant perfect for cooking', stock: 75, discount: 17, rating: 4.3, reviews: 50,
  imagePrompt: 'Fresh white eggplants on white background, vegetable product photography.' });

addProduct({ name: 'ذرة طازجة 4 حبات', nameEn: 'Fresh Corn 4 ears', category: cat, price: 16, compareAtPrice: 20, subcategory: 'vegetables', brand: 'Fresh Farm', unit: '4 ears', description: 'ذرة طازجة حلوة ممتازة للسلق والشواء', descriptionEn: 'Fresh sweet corn ears perfect for boiling and grilling', stock: 110, discount: 20, rating: 4.5, reviews: 95,
  imagePrompt: 'Fresh corn ears with husks partially peeled on white background, vegetable photography.' });

// ==================== DAIRY (25) ====================
const dairy = 'dairy';

addProduct({ name: 'حليب جهينة كامل الدسم 1 لتر', nameEn: 'Juhayna Full Cream Milk 1 L', category: dairy, price: 45, compareAtPrice: 50, brand: 'Juhayna', unit: '1 L', description: 'حليب طازج كامل الدسم', descriptionEn: 'Fresh full cream milk', stock: 200,
  imagePrompt: 'Juhayna full cream milk 1 liter carton front view on white background, dairy product photography.' });

addProduct({ name: 'حليب جهينة خالي الدسم 1 لتر', nameEn: 'Juhayna Skimmed Milk 1 L', category: dairy, price: 42, compareAtPrice: 48, brand: 'Juhayna', unit: '1 L', description: 'حليب طازج خالي الدسم', descriptionEn: 'Fresh skimmed milk', stock: 150,
  imagePrompt: 'Juhayna skimmed milk 1 liter carton on white background, dairy product photography.' });

addProduct({ name: 'حليب المراعي كامل الدسم 1 لتر', nameEn: 'Almarai Full Cream Milk 1 L', category: dairy, price: 48, compareAtPrice: 55, brand: 'Almarai', unit: '1 L', description: 'حليب طازج كامل الدسم من المراعي', descriptionEn: 'Almarai fresh full cream milk', stock: 180,
  imagePrompt: 'Almarai full cream milk 1 liter carton front view, dairy product shot.' });

addProduct({ name: 'جبنة بيضاء دومتي 500 جم', nameEn: 'Domty White Feta Cheese 500 g', category: dairy, price: 42, compareAtPrice: 48, brand: 'Domty', unit: '500 g', description: 'جبنة بيضاء طرية فاخرة', descriptionEn: 'Premium soft white feta cheese', stock: 120,
  imagePrompt: 'Domty white cheese 500g package front view on white background, dairy photography.' });

addProduct({ name: 'جبنة فيتا دومتي 500 جم', nameEn: 'Domty Feta Cheese 500 g', category: dairy, price: 55, compareAtPrice: 62, brand: 'Domty', unit: '500 g', description: 'جبنة فيتا مالحة طرية', descriptionEn: 'Soft salty feta cheese', stock: 100,
  imagePrompt: 'Domty feta cheese 500g package on white background, cheese product photography.' });

addProduct({ name: 'جبنة شيدر المراعي 250 جم', nameEn: 'Almarai Cheddar Cheese 250 g', category: dairy, price: 38, compareAtPrice: 44, brand: 'Almarai', unit: '250 g', description: 'جبنة شيدر طرية متعددة الاستخدامات', descriptionEn: 'Versatile soft cheddar cheese slices', stock: 130,
  imagePrompt: 'Almarai cheddar cheese 250g package on white background, cheese photography.' });

addProduct({ name: 'جبنة مثلثات بوك 8 قطعة', nameEn: 'Puck Triangle Cheese 8 pcs', category: dairy, price: 28, compareAtPrice: 33, brand: 'Puck', unit: '8 pcs', description: 'جبنة مثلثات طرية', descriptionEn: 'Soft triangle cheese wedges', stock: 200,
  imagePrompt: 'Puck triangle cheese 8 pack box on white background, processed cheese photography.' });

addProduct({ name: 'زبادي جهينة 105 جم 4 قطعة', nameEn: 'Juhayna Yogurt 105 g 4 pcs', category: dairy, price: 18, compareAtPrice: 22, brand: 'Juhayna', unit: '105 g x 4', description: 'زبادي طبيعي طازج', descriptionEn: 'Fresh natural yogurt cups', stock: 250,
  imagePrompt: 'Juhayna yogurt 4 pack cups on white background, dairy product photography.' });

addProduct({ name: 'زبادي المراعي 110 جم 4 قطعة', nameEn: 'Almarai Yogurt 110 g 4 pcs', category: dairy, price: 20, compareAtPrice: 24, brand: 'Almarai', unit: '110 g x 4', description: 'زبادي طبيعي كريمي', descriptionEn: 'Creamy natural yogurt cups', stock: 230,
  imagePrompt: 'Almarai yogurt 4 pack cups on white background, dairy product shot.' });

addProduct({ name: 'زبادي جهينة بالفراولة 110 جم 4 قطعة', nameEn: 'Juhayna Strawberry Yogurt 110 g 4 pcs', category: dairy, price: 22, compareAtPrice: 26, brand: 'Juhayna', unit: '110 g x 4', description: 'زبادي بنكهة الفراولة اللذيذة', descriptionEn: 'Delicious strawberry flavored yogurt', stock: 190,
  imagePrompt: 'Juhayna strawberry yogurt 4 pack on white background, flavored dairy photography.' });

addProduct({ name: 'بيض بلدي طازج 10 حبات', nameEn: 'Fresh Local Eggs 10 pcs', category: dairy, price: 32, compareAtPrice: 38, brand: 'Fresh Farm', unit: '10 pcs', description: 'بيض بلدي طازج عالي الجودة', descriptionEn: 'Fresh high-quality local farm eggs', stock: 300,
  imagePrompt: 'Fresh brown eggs in cardboard carton on white background, egg product photography.' });

addProduct({ name: 'بيض أبيض طازج 10 حبات', nameEn: 'Fresh White Eggs 10 pcs', category: dairy, price: 28, compareAtPrice: 33, brand: 'Fresh Farm', unit: '10 pcs', description: 'بيض أبيض طازج ونظيف', descriptionEn: 'Fresh clean white eggs', stock: 280,
  imagePrompt: 'Fresh white eggs in carton on white background, egg photography.' });

addProduct({ name: 'جبنة رومي أسيوطي 250 جم', nameEn: 'Asyuti Rumi Cheese 250 g', category: dairy, price: 45, compareAtPrice: 52, brand: 'Domty', unit: '250 g', description: 'جبنة رومي مصرية مالحة', descriptionEn: 'Traditional Egyptian salty Rumi cheese', stock: 80,
  imagePrompt: 'Egyptian Rumi cheese wedge on white background, traditional cheese photography.' });

addProduct({ name: 'جبنة حلوم 250 جم', nameEn: 'Halloumi Cheese 250 g', category: dairy, price: 50, compareAtPrice: 58, brand: 'Almarai', unit: '250 g', description: 'جبنة حلوم للقلي', descriptionEn: 'Grilling halloumi cheese', stock: 70,
  imagePrompt: 'Halloumi cheese block on white background, cheese product photography.' });

addProduct({ name: 'جبنة موزاريلا دومتي 250 جم', nameEn: 'Domty Mozzarella Cheese 250 g', category: dairy, price: 42, compareAtPrice: 48, brand: 'Domty', unit: '250 g', description: 'جبنة موزاريلا للبيتزا والطهي', descriptionEn: 'Mozzarella cheese for pizza and cooking', stock: 110,
  imagePrompt: 'Domty mozzarella cheese 250g package on white background, cheese photography.' });

addProduct({ name: 'زبدة المراعي غير مملحة 200 جم', nameEn: 'Almarai Unsalted Butter 200 g', category: dairy, price: 38, compareAtPrice: 44, brand: 'Almarai', unit: '200 g', description: 'زبدة طبيعية غير مملحة', descriptionEn: 'Natural unsalted butter', stock: 90,
  imagePrompt: 'Almarai unsalted butter 200g block on white background, dairy product photography.' });

addProduct({ name: 'كريمة طبخ المراعي 500 مل', nameEn: 'Almarai Cooking Cream 500 ml', category: dairy, price: 35, compareAtPrice: 40, brand: 'Almarai', unit: '500 ml', description: 'كريمة طبخ طازجة للصلصات', descriptionEn: 'Fresh cooking cream for sauces', stock: 85,
  imagePrompt: 'Almarai cooking cream 500ml carton on white background, cream photography.' });

addProduct({ name: 'حليب مكثف محلى المراعي 395 جم', nameEn: 'Almarai Sweetened Condensed Milk 395 g', category: dairy, price: 32, compareAtPrice: 38, brand: 'Almarai', unit: '395 g', description: 'حليب مكثف محلى للحلويات', descriptionEn: 'Sweetened condensed milk for desserts', stock: 75,
  imagePrompt: 'Almarai sweetened condensed milk can on white background, dairy product photography.' });

addProduct({ name: 'جبنة بارميزان مبشورة دومتي 150 جم', nameEn: 'Domty Grated Parmesan 150 g', category: dairy, price: 40, compareAtPrice: 47, brand: 'Domty', unit: '150 g', description: 'جبنة بارميزان مبشورة للمكرونة', descriptionEn: 'Grated parmesan cheese for pasta', stock: 65,
  imagePrompt: 'Domty grated parmesan cheese pouch on white background, cheese photography.' });

addProduct({ name: 'قشطة المراعي 100 جم 3 قطعة', nameEn: 'Almarai Clotted Cream 100 g 3 pcs', category: dairy, price: 25, compareAtPrice: 30, brand: 'Almarai', unit: '100 g x 3', description: 'قشطة طبيعية طرية', descriptionEn: 'Natural soft clotted cream', stock: 120,
  imagePrompt: 'Almarai clotted cream 3 pack tubs on white background, dairy product shot.' });

addProduct({ name: 'جبنة كريمي فيلادلفيا 200 جم', nameEn: 'Philadelphia Cream Cheese 200 g', category: dairy, price: 60, compareAtPrice: 70, brand: 'Philadelphia', unit: '200 g', description: 'جبنة كريمي طرية للدهن', descriptionEn: 'Soft creamy spreadable cheese', stock: 70,
  imagePrompt: 'Philadelphia cream cheese 200g box on white background, cream cheese photography.' });

addProduct({ name: 'حليب لبنة جهينة 500 جم', nameEn: 'Juhayna Labneh 500 g', category: dairy, price: 40, compareAtPrice: 46, brand: 'Juhayna', unit: '500 g', description: 'لبنة طرية متعددة الاستخدامات', descriptionEn: 'Versatile soft labneh', stock: 100,
  imagePrompt: 'Juhayna labneh 500g tub on white background, middle eastern dairy photography.' });

addProduct({ name: 'سمنة بلدي 500 جم', nameEn: 'Baladi Natural Ghee 500 g', category: dairy, price: 55, compareAtPrice: 65, brand: 'Halwani', unit: '500 g', description: 'سمنة بلدي طبيعية نقيبة', descriptionEn: 'Pure natural baladi ghee', stock: 80,
  imagePrompt: 'Traditional Egyptian baladi ghee 500g container on white background, ghee photography.' });

addProduct({ name: 'جبنة شيدر شرائح دومتي 200 جم', nameEn: 'Domty Cheddar Slices 200 g', category: dairy, price: 30, compareAtPrice: 35, brand: 'Domty', unit: '200 g', description: 'شرائح جبنة شيدر للبرجر والسندوتشات', descriptionEn: 'Cheddar cheese slices for burgers and sandwiches', stock: 140,
  imagePrompt: 'Domty cheddar cheese slices 200g package on white background, cheese photography.' });

addProduct({ name: 'روب فانيليا جهينة 110 جم 4 قطعة', nameEn: 'Juhayna Vanilla Pudding 110 g 4 pcs', category: dairy, price: 24, compareAtPrice: 28, brand: 'Juhayna', unit: '110 g x 4', description: 'روب بالفانيليا اللذيذة', descriptionEn: 'Delicious vanilla flavored pudding', stock: 160,
  imagePrompt: 'Juhayna vanilla pudding 4 pack cups on white background, dessert dairy photography.' });

addProduct({ name: 'حليب جهينة بçشة الشوفان 200 مل 4 قطعة', nameEn: 'Juhayna Oat Milk 200 ml 4 pcs', category: dairy, price: 28, compareAtPrice: 33, brand: 'Juhayna', unit: '200 ml x 4', description: 'حليب نباتي مصنوع من الشوفان بطعم طبيعي لذيذ', descriptionEn: 'Plant-based oat milk with natural flavor, ideal for cereal and coffee', stock: 140, discount: 12, rating: 4.5, reviews: 120, imagePrompt: 'Juhayna oat milk 200ml 4 pack cartons on white background, dairy alternative product photography.' });

addProduct({ name: 'حليب المراعي قليل الدسم 1 لتر', nameEn: 'Almarai Low Fat Milk 1 L', category: dairy, price: 44, compareAtPrice: 50, brand: 'Almarai', unit: '1 L', description: 'حليب طازج قليل الدسم مناسب للكبار والأطفال', descriptionEn: 'Fresh low fat milk suitable for the whole family', stock: 170, discount: 10, rating: 4.6, reviews: 180, imagePrompt: 'Almarai low fat milk 1 liter carton front view on white background, dairy product photography.' });

addProduct({ name: 'لبنة جهينة بطعم الزبادي 500 جم', nameEn: 'Juhayna Yogurt Flavored Labneh 500 g', category: dairy, price: 38, compareAtPrice: 44, brand: 'Juhayna', unit: '500 g', description: 'لبنة طرية بنكهة الزبادي المنعشة', descriptionEn: 'Soft labneh with refreshing yogurt flavor, perfect for breakfast', stock: 100, discount: 14, rating: 4.4, reviews: 95, imagePrompt: 'Juhayna yogurt flavored labneh 500g tub on white background, dairy product photography.' });

addProduct({ name: 'جبنة بيضاء قريش 400 جم', nameEn: 'Fresh Quraish Cheese 400 g', category: dairy, price: 25, compareAtPrice: 30, brand: 'Domty', unit: '400 g', description: 'جبنة قريش بيضاء طازجة قليلة الدسم', descriptionEn: 'Fresh low-fat white Quraish cheese, rich in protein', stock: 130, discount: 16, rating: 4.3, reviews: 110, imagePrompt: 'Domty fresh white Quraish cheese 400g package on white background, cheese product photography.' });

addProduct({ name: 'جبنة شيدر كيري 120 جم 6 قطعة', nameEn: 'Kiri Cheddar Cheese 120 g 6 pcs', category: dairy, price: 28, compareAtPrice: 33, brand: 'Kiri', unit: '120 g x 6', description: 'جبنة شيدر كيري الطرية للاستخدام اليومي', descriptionEn: 'Soft Kiri cheddar cheese portions for daily use and snacks', stock: 150, discount: 12, rating: 4.5, reviews: 140, imagePrompt: 'Kiri cheddar cheese 6 pack portions on white background, processed cheese photography.' });

addProduct({ name: 'زبدة لورباك مملحة 200 جم', nameEn: 'Lurpak Salted Butter 200 g', category: dairy, price: 55, compareAtPrice: 65, brand: 'Lurpak', unit: '200 g', description: 'زبدة دانماركية مملحة فاخرة للطهي والدهن', descriptionEn: 'Premium Danish salted butter for cooking and spreading', stock: 80, discount: 12, rating: 4.7, reviews: 160, imagePrompt: 'Lurpak salted butter 200g block wrapped on white background, premium butter photography.' });

addProduct({ name: 'كريمة خفق المراعي 200 مل', nameEn: 'Almarai Whipping Cream 200 ml', category: dairy, price: 22, compareAtPrice: 27, brand: 'Almarai', unit: '200 ml', description: 'كريمة خفق طازجة لتحضير الحلويات والعصائر', descriptionEn: 'Fresh whipping cream for desserts and beverages', stock: 110, discount: 14, rating: 4.4, reviews: 85, imagePrompt: 'Almarai whipping cream 200ml carton on white background, cream product photography.' });

addProduct({ name: 'حليب أطفال نيدوجين 400 جم', nameEn: 'Nido Growing Up Milk 400 g', category: dairy, price: 75, compareAtPrice: 88, brand: 'Nido', unit: '400 g', description: 'حليب بودرة نيدوجين للأطفال من سن سنة إلى 3 سنوات', descriptionEn: 'Nido powdered growing up milk for children aged 1-3 years', stock: 90, discount: 10, rating: 4.8, reviews: 250, imagePrompt: 'Nido growing up milk 400g tin on white background, baby formula product photography.' });

addProduct({ name: 'قشطة بوك 170 جم 3 قطعة', nameEn: 'Puck Cream 170 g 3 pcs', category: dairy, price: 22, compareAtPrice: 27, brand: 'Puck', unit: '170 g x 3', description: 'قشطة طبيعية لذيذة للحلويات والأطباق', descriptionEn: 'Delicious natural cream for desserts and cooking', stock: 160, discount: 12, rating: 4.5, reviews: 130, imagePrompt: 'Puck cream 170g 3 pack cans on white background, dairy cream photography.' });

addProduct({ name: 'زبادي كيوبي بالفراولة 125 جم 4 قطعة', nameEn: 'Kio Strawberry Yogurt 125 g 4 pcs', category: dairy, price: 20, compareAtPrice: 24, brand: 'Kio', unit: '125 g x 4', description: 'زبادي كريمي بنكهة الفراولة الطبيعية', descriptionEn: 'Creamy yogurt with natural strawberry flavor', stock: 180, discount: 10, rating: 4.3, reviews: 100, imagePrompt: 'Kio strawberry yogurt 4 pack cups on white background, flavored yogurt photography.' });

addProduct({ name: 'جبنة كريمي فيلادلفيا بحشوة بالفلفل 200 جم', nameEn: 'Philadelphia Pepper Flavored Cream Cheese 200 g', category: dairy, price: 65, compareAtPrice: 75, brand: 'Philadelphia', unit: '200 g', description: 'جبنة كريمي فيلادلفيا بطعم الفلفل الحار للساندويتشات', descriptionEn: 'Philadelphia cream cheese with pepper flavor, ideal for sandwiches and dips', stock: 65, discount: 10, rating: 4.6, reviews: 110, imagePrompt: 'Philadelphia pepper flavored cream cheese 200g package on white background, cheese product photography.' });

addProduct({ name: 'بيض بلدي عضوي 10 حبات', nameEn: 'Organic Free Range Eggs 10 pcs', category: dairy, price: 48, compareAtPrice: 55, brand: 'Fresh Farm', unit: '10 pcs', description: 'بيض بلدي عضوي من مزارع حرة خالية من المبيدات', descriptionEn: 'Organic free-range eggs from pesticide-free farms', stock: 70, discount: 10, rating: 4.8, reviews: 190, imagePrompt: 'Organic free-range brown eggs in eco carton on white background, premium egg photography.' });

addProduct({ name: 'جبنة شيدر المراعي شرائح 200 جم', nameEn: 'Almarai Cheddar Slices 200 g', category: dairy, price: 32, compareAtPrice: 38, brand: 'Almarai', unit: '200 g', description: 'شرائح جبنة شيدر طرية جاهزة للتقديم', descriptionEn: 'Soft ready-to-serve cheddar cheese slices', stock: 130, discount: 12, rating: 4.5, reviews: 150, imagePrompt: 'Almarai cheddar cheese slices 200g package on white background, sliced cheese photography.' });

addProduct({ name: 'حليب جهينة كريمي 1 لتر', nameEn: 'Juhayna Creamy Milk 1 L', category: dairy, price: 48, compareAtPrice: 55, brand: 'Juhayna', unit: '1 L', description: 'حليب كريمي كثيف بقية المذاق الغنية', descriptionEn: 'Rich creamy milk with a thick smooth texture', stock: 120, discount: 10, rating: 4.7, reviews: 170, imagePrompt: 'Juhayna creamy milk 1 liter carton on white background, premium dairy photography.' });

addProduct({ name: 'روب زبادي جهينة بالمانجو 110 جم 4 قطعة', nameEn: 'Juhayna Mango Yogurt 110 g 4 pcs', category: dairy, price: 22, compareAtPrice: 26, brand: 'Juhayna', unit: '110 g x 4', description: 'زبادي منكهة بنكهة المانجو الطبيعية المنعشة', descriptionEn: 'Refreshing natural mango flavored yogurt cups', stock: 200, discount: 10, rating: 4.4, reviews: 130, imagePrompt: 'Juhayna mango yogurt 4 pack cups on white background, fruit flavored dairy photography.' });

addProduct({ name: 'جبنة حلوم مقلية 250 جم', nameEn: 'Fried Halloumi Cheese 250 g', category: dairy, price: 55, compareAtPrice: 65, brand: 'Almarai', unit: '250 g', description: 'جبنة حلوم مقلية مسبقاً جاهزة للتقديم', descriptionEn: 'Pre-fried halloumi cheese, ready to serve', stock: 60, discount: 12, rating: 4.5, reviews: 90, imagePrompt: 'Almarai fried halloumi cheese 250g package on white background, ready-to-eat cheese photography.' });

addProduct({ name: 'لبنة طرية مقدمة 400 جم', nameEn: 'Soft Spreadable Labneh 400 g', category: dairy, price: 30, compareAtPrice: 35, brand: 'Domty', unit: '400 g', description: 'لبنة طرية متعددة الاستخدامات للساندويتشات والسلطات', descriptionEn: 'Soft versatile labneh for sandwiches and salads', stock: 140, discount: 10, rating: 4.4, reviews: 120, imagePrompt: 'Domty soft spreadable labneh 400g tub on white background, labneh dairy photography.' });

addProduct({ name: 'كريمة طبخ للاستخدام اليومي 500 مل', nameEn: 'Daily Cooking Cream 500 ml', category: dairy, price: 28, compareAtPrice: 33, brand: 'Almarai', unit: '500 ml', description: 'كريمة طبخ كريمية مناسبة لجميع الصلصات والأطباق', descriptionEn: 'Creamy cooking cream suitable for all sauces and dishes', stock: 100, discount: 12, rating: 4.5, reviews: 140, imagePrompt: 'Almarai daily cooking cream 500ml carton on white background, cooking cream photography.' });

addProduct({ name: 'حليب المراعي بالفراولة 200 مل 6 قطعة', nameEn: 'Almarai Strawberry Milk 200 ml 6 pcs', category: dairy, price: 25, compareAtPrice: 30, brand: 'Almarai', unit: '200 ml x 6', description: 'حليب منكهة بنكهة الفراولة المحببة للأطفال والكبار', descriptionEn: 'Strawberry flavored milk loved by kids and adults alike', stock: 190, discount: 12, rating: 4.6, reviews: 160, imagePrompt: 'Almarai strawberry milk 200ml 6 pack cartons on white background, flavored milk photography.' });

addProduct({ name: 'جبنة موزاريلا مبشورة 200 جم', nameEn: 'Shredded Mozzarella Cheese 200 g', category: dairy, price: 38, compareAtPrice: 44, brand: 'Domty', unit: '200 g', description: 'جبنة موزاريلا مبشورة جاهزة للبيتزا والمعجنات', descriptionEn: 'Shredded mozzarella cheese ready for pizza and pastries', stock: 110, discount: 10, rating: 4.6, reviews: 145, imagePrompt: 'Domty shredded mozzarella cheese 200g package on white background, cheese photography.' });

// ==================== MEAT (18) ====================
const meat = 'meat';

addProduct({ name: 'صدر دجاج طازج مخلٍ 1 كيلو', nameEn: 'Fresh Boneless Chicken Breast 1 kg', category: meat, price: 120, compareAtPrice: 140, brand: 'Al Watania', unit: '1 kg', description: 'صدر دجاج طازج مخلٍ عالي الجودة', descriptionEn: 'Fresh boneless skinless chicken breast', stock: 100,
  imagePrompt: 'Fresh raw chicken breast fillets on white tray, butcher meat photography.' });

addProduct({ name: 'دجاجة كاملة طازجة 1.2 كيلو', nameEn: 'Fresh Whole Chicken 1.2 kg', category: meat, price: 95, compareAtPrice: 110, brand: 'Al Watania', unit: '1.2 kg', description: 'دجاجة كاملة طازجة', descriptionEn: 'Fresh whole chicken', stock: 80,
  imagePrompt: 'Fresh whole raw chicken on white background, poultry meat photography.' });

addProduct({ name: 'لحم بقري مفروم طازج 500 جم', nameEn: 'Fresh Minced Beef 500 g', category: meat, price: 85, compareAtPrice: 100, brand: 'Fresh Farm', unit: '500 g', description: 'لحم بقري مفروم طازج', descriptionEn: 'Fresh ground beef', stock: 90,
  imagePrompt: 'Fresh raw minced beef on white tray, butcher meat photography.' });

addProduct({ name: 'لحم بقري مكعبات للطهي 500 جم', nameEn: 'Beef Cubes for Cooking 500 g', category: meat, price: 110, compareAtPrice: 130, brand: 'Fresh Farm', unit: '500 g', description: 'لحم بقري مكعبات طازج', descriptionEn: 'Fresh beef cubes for stew', stock: 60,
  imagePrompt: 'Fresh raw beef cubes on white background, butcher meat photography.' });

addProduct({ name: 'كبد دجاج طازج 500 جم', nameEn: 'Fresh Chicken Liver 500 g', category: meat, price: 35, compareAtPrice: 42, brand: 'Al Watania', unit: '500 g', description: 'كبد دجاج طازج', descriptionEn: 'Fresh chicken liver', stock: 50,
  imagePrompt: 'Fresh chicken livers on white tray, organ meat photography.' });

addProduct({ name: 'أفخاذ دجاج طازجة 1 كيلو', nameEn: 'Fresh Chicken Thighs 1 kg', category: meat, price: 80, compareAtPrice: 95, brand: 'Al Watania', unit: '1 kg', description: 'أفخاذ دجاج طازجة ومنزوعة الجلد', descriptionEn: 'Fresh chicken thighs', stock: 85,
  imagePrompt: 'Fresh raw chicken thighs on white background, poultry meat photography.' });

addProduct({ name: 'أجنحة دجاج طازجة 1 كيلو', nameEn: 'Fresh Chicken Wings 1 kg', category: meat, price: 55, compareAtPrice: 65, brand: 'Al Watania', unit: '1 kg', description: 'أجنحة دجاج طازجة', descriptionEn: 'Fresh chicken wings', stock: 70,
  imagePrompt: 'Fresh raw chicken wings on white background, poultry photography.' });

addProduct({ name: 'دجاج مشوي كامل', nameEn: 'Whole Roasted Chicken', category: meat, price: 75, compareAtPrice: 90, brand: 'Al Watania', unit: '1 piece', description: 'دجاج مشوي كامل وجاهز', descriptionEn: 'Ready-to-eat whole roasted chicken', stock: 30, rating: 4.7, reviews: 200,
  imagePrompt: 'Whole roasted golden brown chicken on white background, cooked poultry photography.' });

addProduct({ name: 'لحم ضأن طازج مكعبات 500 جم', nameEn: 'Fresh Lamb Cubes 500 g', category: meat, price: 140, compareAtPrice: 165, brand: 'Fresh Farm', unit: '500 g', description: 'لحم ضأن طازج مكعبات للشواء والطهي', descriptionEn: 'Fresh lamb cubes for grilling and stew', stock: 40,
  imagePrompt: 'Fresh raw lamb meat cubes on white background, butcher photography.' });

addProduct({ name: 'لحم عجل ستيك طازج 400 جم', nameEn: 'Fresh Veal Steak 400 g', category: meat, price: 130, compareAtPrice: 155, brand: 'Fresh Farm', unit: '400 g', description: 'شريحة لحم عجل طازج', descriptionEn: 'Fresh veal steak cut', stock: 35,
  imagePrompt: 'Fresh raw veal steak on white background, premium meat photography.' });

addProduct({ name: 'سجق بقري طازج 500 جم', nameEn: 'Fresh Beef Sausage 500 g', category: meat, price: 65, compareAtPrice: 78, brand: 'Fresh Farm', unit: '500 g', description: 'سجق بقري طازج بالتوابل', descriptionEn: 'Fresh spiced beef sausage', stock: 60,
  imagePrompt: 'Fresh raw beef sausages on white background, sausage meat photography.' });

addProduct({ name: 'كفتة لحم بقري طازجة 500 جم', nameEn: 'Fresh Beef Kofta 500 g', category: meat, price: 90, compareAtPrice: 108, brand: 'Fresh Farm', unit: '500 g', description: 'كفتة لحم بقري طازجة بالتوابل المصرية', descriptionEn: 'Fresh Egyptian spiced beef kofta', stock: 55,
  imagePrompt: 'Fresh raw beef kofta skewers on white background, Egyptian meat photography.' });

addProduct({ name: 'سجق بلدي طازج 500 جم', nameEn: 'Fresh Baladi Sausage 500 g', category: meat, price: 55, compareAtPrice: 65, brand: 'Fresh Farm', unit: '500 g', description: 'سجق بلدي طازج بالبهارات', descriptionEn: 'Fresh local spiced sausage', stock: 45,
  imagePrompt: 'Fresh traditional Egyptian sausages on white background, meat photography.' });

addProduct({ name: 'لانشون بقري شرائح 200 جم', nameEn: 'Beef Luncheon Slices 200 g', category: meat, price: 25, compareAtPrice: 30, brand: 'Venice', unit: '200 g', description: 'لانشون بقري شرائح طرية', descriptionEn: 'Soft beef luncheon slices', stock: 150, rating: 4.3, reviews: 120,
  imagePrompt: 'Beef luncheon slices package on white background, processed meat photography.' });

addProduct({ name: 'بسطرمة بقري شرائح 150 جم', nameEn: 'Beef Pastrami Slices 150 g', category: meat, price: 50, compareAtPrice: 60, brand: 'Venice', unit: '150 g', description: 'بسطرمة بقري بالتوابل', descriptionEn: 'Spiced beef pastrami slices', stock: 100, rating: 4.5, reviews: 90,
  imagePrompt: 'Beef pastrami slices package on white background, delicatessen meat photography.' });

addProduct({ name: 'هوت دوج دجاج 400 جم', nameEn: 'Chicken Hot Dogs 400 g', category: meat, price: 30, compareAtPrice: 36, brand: 'Venice', unit: '400 g', description: 'هوت دوج دجاج طرية', descriptionEn: 'Soft chicken hot dogs', stock: 130,
  imagePrompt: 'Chicken hot dogs package on white background, processed meat photography.' });

addProduct({ name: 'دجاج هبرة مفرومة 500 جم', nameEn: 'Ground Chicken 500 g', category: meat, price: 65, compareAtPrice: 78, brand: 'Al Watania', unit: '500 g', description: 'دجاج مفروم طازج', descriptionEn: 'Fresh ground chicken', stock: 70,
  imagePrompt: 'Fresh ground chicken meat on white tray, poultry photography.' });

addProduct({ name: 'بانيه دجاج طازج 500 جم', nameEn: 'Fresh Chicken Pane 500 g', category: meat, price: 75, compareAtPrice: 88, brand: 'Al Watania', unit: '500 g', description: 'بانيه دجاج طازج مغطى بطبقة مقرمشة', descriptionEn: 'Fresh breaded chicken fillets', stock: 60,
  imagePrompt: 'Fresh breaded chicken fillets on white background, prepared poultry photography.' });

addProduct({ name: 'كفتة دجاج طازجة 500 جم', nameEn: 'Fresh Chicken Kofta 500 g', category: meat, price: 60, compareAtPrice: 72, brand: 'Al Watania', unit: '500 g', description: 'كفتة دجاج طازجة بالتوابل المصرية مجهزة للشواء', descriptionEn: 'Fresh chicken kofta with Egyptian spices ready for grilling', stock: 80, discount: 17, rating: 4.6, reviews: 150,
  imagePrompt: 'Fresh raw chicken kofta skewers on white tray, clean commercial meat photography on white background.' });

addProduct({ name: 'لحم بقري شرائح 400 جم', nameEn: 'Fresh Beef Slices 400 g', category: meat, price: 100, compareAtPrice: 120, brand: 'Fresh Farm', unit: '400 g', description: 'شرائح لحم بقري طازجة رقيقة مناسبة للشواء والطهي', descriptionEn: 'Fresh thinly sliced beef perfect for grilling and stir-fry', stock: 65, discount: 17, rating: 4.7, reviews: 180,
  imagePrompt: 'Fresh raw beef slices neatly arranged on white background, commercial butcher meat photography.' });

addProduct({ name: 'بطاطس دجاج متبلة 500 جم', nameEn: 'Spiced Chicken Breast 500 g', category: meat, price: 80, compareAtPrice: 95, brand: 'Al Watania', unit: '500 g', description: 'صدر دجاج متبل بالتوابل جاهز للطهي', descriptionEn: 'Spiced chicken breast ready to cook with aromatic seasonings', stock: 90, discount: 16, rating: 4.5, reviews: 130,
  imagePrompt: 'Fresh spiced chicken breast pieces on white tray, commercial poultry photography on white background.' });

addProduct({ name: 'لحم ضأن مفروم 500 جم', nameEn: 'Fresh Minced Lamb 500 g', category: meat, price: 130, compareAtPrice: 155, brand: 'Fresh Farm', unit: '500 g', description: 'لحم ضأن مفروم طازج ممتاز للكفتة والطهي', descriptionEn: 'Fresh premium minced lamb ideal for kofta and cooking', stock: 50, discount: 16, rating: 4.8, reviews: 160,
  imagePrompt: 'Fresh raw minced lamb on white tray, commercial butcher meat photography on white background.' });

addProduct({ name: 'صدر دجاج متبل للشواء 500 جم', nameEn: 'Marinated Grilling Chicken Breast 500 g', category: meat, price: 90, compareAtPrice: 108, brand: 'Al Watania', unit: '500 g', description: 'صدر دجاج متبل ومضبوط للشواء مباشرة', descriptionEn: 'Pre-marinated chicken breast ready for immediate grilling', stock: 75, discount: 17, rating: 4.6, reviews: 140,
  imagePrompt: 'Marinated chicken breast on white background, commercial prepared poultry photography.' });

addProduct({ name: 'لحم عجل مفروم 500 جم', nameEn: 'Fresh Minced Veal 500 g', category: meat, price: 115, compareAtPrice: 135, brand: 'Fresh Farm', unit: '500 g', description: 'لحم عجل مفروم طازج ناعم القوام مناسب للفطائر والبرغر', descriptionEn: 'Fresh finely ground veal perfect for pies and burgers', stock: 60, discount: 15, rating: 4.7, reviews: 120,
  imagePrompt: 'Fresh raw minced veal on white tray, commercial meat photography on white background.' });

addProduct({ name: 'أضلاع بقري طازجة 1 كيلو', nameEn: 'Fresh Beef Ribs 1 kg', category: meat, price: 150, compareAtPrice: 180, brand: 'Fresh Farm', unit: '1 kg', description: 'أضلاع بقري طازجة عالي الجودة للشواء في الفرن', descriptionEn: 'Fresh premium beef ribs ideal for oven roasting and grilling', stock: 40, discount: 17, rating: 4.8, reviews: 95,
  imagePrompt: 'Fresh raw beef ribs on white background, premium butcher meat photography.' });

addProduct({ name: 'صدور دجاج مجمدة بالتوابل 500 جم', nameEn: 'Spiced Frozen Chicken Breasts 500 g', category: meat, price: 70, compareAtPrice: 82, brand: 'Al Watania', unit: '500 g', description: 'صدور دجاج مجمدة متبلة بالتوابل جاهزة للقلي', descriptionEn: 'Frozen spiced chicken breasts ready to pan-fry', stock: 100, discount: 15, rating: 4.4, reviews: 110,
  imagePrompt: 'Frozen spiced chicken breast package on white background, commercial frozen meat photography.' });

addProduct({ name: 'لحم بقري شرائح للستيك 500 جم', nameEn: 'Beef Steak Slices 500 g', category: meat, price: 140, compareAtPrice: 165, brand: 'Fresh Farm', unit: '500 g', description: 'شرائح لحم بقري فاخرة للستيك ناعمة وطازجة', descriptionEn: 'Premium tender beef steak slices fresh and ready to grill', stock: 45, discount: 15, rating: 4.9, reviews: 200,
  imagePrompt: 'Fresh raw beef steak slices on white background, premium meat photography on white background.' });

addProduct({ name: 'دجاج كامل مجمد 1.5 كيلو', nameEn: 'Frozen Whole Chicken 1.5 kg', category: meat, price: 85, compareAtPrice: 100, brand: 'Al Watania', unit: '1.5 kg', description: 'دجاجة كاملة مجمدة طازجة مناسبة للتحمير والشواء', descriptionEn: 'Fresh frozen whole chicken ideal for roasting and grilling', stock: 90, discount: 15, rating: 4.5, reviews: 170,
  imagePrompt: 'Frozen whole chicken on white background, commercial frozen poultry photography.' });

addProduct({ name: 'لحم ضأن مسلوق 400 جم', nameEn: 'Boiled Lamb Meat 400 g', category: meat, price: 120, compareAtPrice: 140, brand: 'Fresh Farm', unit: '400 g', description: 'لحم ضأن مسلوق مجهز جاهز للطهي في الصلصة أو الشرمولة', descriptionEn: 'Pre-cooked boiled lamb meat ready for stew or shawarma seasoning', stock: 55, discount: 14, rating: 4.6, reviews: 85,
  imagePrompt: 'Boiled lamb meat pieces on white tray, cooked meat commercial photography on white background.' });

addProduct({ name: 'رقبة دجاج طازجة 1 كيلو', nameEn: 'Fresh Chicken Necks 1 kg', category: meat, price: 35, compareAtPrice: 42, brand: 'Al Watania', unit: '1 kg', description: 'رقب دجاج طازجة مناسبة للسلق والطهي بالصلصة', descriptionEn: 'Fresh chicken necks perfect for boiling and stewing', stock: 120, discount: 17, rating: 4.3, reviews: 60,
  imagePrompt: 'Fresh raw chicken necks on white tray, poultry parts photography on white background.' });

addProduct({ name: 'كبد لحم بقري طازج 500 جم', nameEn: 'Fresh Beef Liver 500 g', category: meat, price: 45, compareAtPrice: 55, brand: 'Fresh Farm', unit: '500 g', description: 'كبد لحم بقري طازج غني بالحديد والفيتامينات', descriptionEn: 'Fresh beef liver rich in iron and essential vitamins', stock: 70, discount: 18, rating: 4.4, reviews: 75,
  imagePrompt: 'Fresh raw beef liver on white tray, organ meat commercial photography on white background.' });

addProduct({ name: 'لسان بقري طازج 500 جم', nameEn: 'Fresh Beef Tongue 500 g', category: meat, price: 80, compareAtPrice: 95, brand: 'Fresh Farm', unit: '500 g', description: 'لسان بقري طازج لذيذ غني بالبروتين', descriptionEn: 'Fresh delicious beef tongue high in protein', stock: 45, discount: 16, rating: 4.5, reviews: 65,
  imagePrompt: 'Fresh raw beef tongue on white background, premium organ meat photography on white background.' });

addProduct({ name: 'شورما دجاج جاهزة 400 جم', nameEn: 'Ready Chicken Shawarma Meat 400 g', category: meat, price: 60, compareAtPrice: 72, brand: 'Koki', unit: '400 g', description: 'شورما دجاج متبلة وجاهزة للتسخين مباشرة', descriptionEn: 'Seasoned chicken shawarma meat ready to heat and serve', stock: 110, discount: 17, rating: 4.6, reviews: 190,
  imagePrompt: 'Ready chicken shawarma slices on white background, commercial prepared meat photography.' });

// ==================== FROZEN (18) ====================
const frozen = 'frozen';

addProduct({ name: 'بطاطس مقلية فارم فريتس 2.5 كيلو', nameEn: 'Farm Frites French Fries 2.5 kg', category: frozen, price: 65, compareAtPrice: 78, brand: 'Farm Frites', unit: '2.5 kg', description: 'بطاطس مقلية مجمدة', descriptionEn: 'Frozen french fries', stock: 100,
  imagePrompt: 'Farm Frites frozen french fries bag on white background, frozen food photography.' });

addProduct({ name: 'بانيه دجاج كروكي 800 جم', nameEn: 'Koki Crunchy Chicken Pane 800 g', category: frozen, price: 85, compareAtPrice: 100, brand: 'Koki', unit: '800 g', description: 'بانيه دجاج مقرمش مجمد', descriptionEn: 'Frozen crispy chicken breaded fillets', stock: 80,
  imagePrompt: 'Koki chicken pane frozen bag on white background, frozen poultry photography.' });

addProduct({ name: 'بازلاء وجزر مجمد 500 جم', nameEn: 'Frozen Peas & Carrots 500 g', category: frozen, price: 22, compareAtPrice: 27, brand: 'Green Valley', unit: '500 g', description: 'بازلاء وجزر طازجة مجمدة', descriptionEn: 'Frozen peas and carrots mix', stock: 120,
  imagePrompt: 'Frozen peas and carrots bag on white background, frozen vegetables photography.' });

addProduct({ name: 'بروكلي مجمد 500 جم', nameEn: 'Frozen Broccoli 500 g', category: frozen, price: 28, compareAtPrice: 34, brand: 'Green Valley', unit: '500 g', description: 'بروكلي مجمد طازج', descriptionEn: 'Frozen broccoli florets', stock: 90,
  imagePrompt: 'Frozen broccoli florets bag on white background, frozen vegetable photography.' });

addProduct({ name: 'سبانخ مجمد 400 جم', nameEn: 'Frozen Spinach 400 g', category: frozen, price: 18, compareAtPrice: 22, brand: 'Green Valley', unit: '400 g', description: 'سبانخ مفرومة مجمدة', descriptionEn: 'Frozen chopped spinach', stock: 85,
  imagePrompt: 'Frozen spinach leaves bag on white background, frozen vegetable photography.' });

addProduct({ name: 'شيش طاووق دجاج مجمد 500 جم', nameEn: 'Frozen Chicken Shawarma 500 g', category: frozen, price: 55, compareAtPrice: 65, brand: 'Koki', unit: '500 g', description: 'شيش طاووق دجاج مجمد وجاهز للقلي', descriptionEn: 'Frozen ready-to-cook chicken shawarma', stock: 70,
  imagePrompt: 'Frozen chicken shawarma cubes bag on white background, frozen ready meal photography.' });

addProduct({ name: 'سمك بلطي طازج مجمد 1 كيلو', nameEn: 'Frozen Fresh Tilapia 1 kg', category: frozen, price: 65, compareAtPrice: 78, brand: 'Fresh Catch', unit: '1 kg', description: 'سمك بلطي طازج مجمد كامل', descriptionEn: 'Frozen whole fresh tilapia fish', stock: 60,
  imagePrompt: 'Frozen whole tilapia fish on white background, frozen seafood photography.' });

addProduct({ name: 'فيليه سمك بلطي مجمد 500 جم', nameEn: 'Frozen Tilapia Fillets 500 g', category: frozen, price: 55, compareAtPrice: 65, brand: 'Fresh Catch', unit: '500 g', description: 'فيليه سمك بلطي مجمد', descriptionEn: 'Frozen tilapia fish fillets', stock: 75,
  imagePrompt: 'Frozen tilapia fillets bag on white background, frozen seafood photography.' });

addProduct({ name: 'جمبري مجمد حجم وسط 500 جم', nameEn: 'Frozen Medium Shrimp 500 g', category: frozen, price: 120, compareAtPrice: 145, brand: 'Fresh Catch', unit: '500 g', description: 'جمبري مجمد مقشر متوسط الحجم', descriptionEn: 'Frozen peeled medium shrimp', stock: 40,
  imagePrompt: 'Frozen raw shrimp bag on white background, frozen seafood photography.' });

addProduct({ name: 'سمك سلمون نرويجي مجمد 500 جم', nameEn: 'Frozen Norwegian Salmon 500 g', category: frozen, price: 180, compareAtPrice: 210, brand: 'Fresh Catch', unit: '500 g', description: 'شرائح سلمون مجمدة عالية الجودة', descriptionEn: 'Premium frozen salmon fillets', stock: 25,
  imagePrompt: 'Frozen salmon fillet on white background, premium frozen fish photography.' });

addProduct({ name: 'ميني بيتزا جبنة مجمدة 250 جم', nameEn: 'Frozen Mini Cheese Pizza 250 g', category: frozen, price: 30, compareAtPrice: 36, brand: 'Koki', unit: '250 g', description: 'ميني بيتزا بالجبنة مجمدة', descriptionEn: 'Frozen mini cheese pizzas', stock: 90,
  imagePrompt: 'Frozen mini cheese pizza box on white background, frozen food photography.' });

addProduct({ name: 'سمبوسك جبنة مجمدة 400 جم', nameEn: 'Frozen Cheese Sambousak 400 g', category: frozen, price: 35, compareAtPrice: 42, brand: 'Koki', unit: '400 g', description: 'سمبوسك بالجبنة مجمدة وجاهزة للقلي', descriptionEn: 'Frozen ready-to-fry cheese sambousak', stock: 80,
  imagePrompt: 'Frozen cheese sambousak bag on white background, frozen appetizer photography.' });

addProduct({ name: 'بطاطس ودجز حارة مجمدة 1 كيلو', nameEn: 'Frozen Spicy Potato Wedges 1 kg', category: frozen, price: 35, compareAtPrice: 42, brand: 'Farm Frites', unit: '1 kg', description: 'بطاطس ودجز حارة مجمدة', descriptionEn: 'Frozen spicy potato wedges', stock: 90,
  imagePrompt: 'Frozen spicy potato wedges bag on white background, frozen potato product photography.' });

addProduct({ name: 'خضار سوتيه مجمد 500 جم', nameEn: 'Frozen Mixed Vegetables 500 g', category: frozen, price: 20, compareAtPrice: 25, brand: 'Green Valley', unit: '500 g', description: 'خضار مشكل مجمد للطهي', descriptionEn: 'Frozen mixed vegetables for cooking', stock: 110,
  imagePrompt: 'Frozen mixed vegetables bag on white background, frozen vegetable photography.' });

addProduct({ name: 'وراك دجاج مجمدة 1 كيلو', nameEn: 'Frozen Chicken Legs 1 kg', category: frozen, price: 70, compareAtPrice: 84, brand: 'Al Watania', unit: '1 kg', description: 'أوراك دجاج مجمدة', descriptionEn: 'Frozen chicken legs', stock: 85,
  imagePrompt: 'Frozen chicken legs bag on white background, frozen poultry photography.' });

addProduct({ name: 'كالاماري مجمد 500 جم', nameEn: 'Frozen Calamari Rings 500 g', category: frozen, price: 85, compareAtPrice: 100, brand: 'Fresh Catch', unit: '500 g', description: 'حلقات كالاماري مجمدة', descriptionEn: 'Frozen calamari rings', stock: 35,
  imagePrompt: 'Frozen calamari rings bag on white background, frozen seafood photography.' });

addProduct({ name: 'كاتو شوكولاتة مجمد 400 جم', nameEn: 'Frozen Chocolate Cake 400 g', category: frozen, price: 45, compareAtPrice: 55, brand: 'Koki', unit: '400 g', description: 'كاتو شوكولاتة مجمد للتحلية', descriptionEn: 'Frozen chocolate dessert cake', stock: 40,
  imagePrompt: 'Frozen chocolate cake box on white background, frozen dessert photography.' });

addProduct({ name: 'لا زانيا باللحمة المجمدة 500 جم', nameEn: 'Frozen Beef Lasagna 500 g', category: frozen, price: 55, compareAtPrice: 65, brand: 'Koki', unit: '500 g', description: 'لازانيا باللحمة المجمدة وجاهزة للطهي', descriptionEn: 'Frozen ready-to-bake beef lasagna', stock: 45,
  imagePrompt: 'Frozen beef lasagna box on white background, frozen ready meal photography.' });

addProduct({ name: 'كفته لحم بقري مجمدة 500 جم', nameEn: 'Frozen Beef Kofta 500 g', category: frozen, price: 75, compareAtPrice: 88, subcategory: 'meat', brand: 'Koki', unit: '500 g', description: 'كفته لحم بقري مجمدة مغلفة بالتوابل المصرية، جاهزة للشواء أو القلي', descriptionEn: 'Frozen beef kofta patties seasoned with Egyptian spices, ready to grill or fry', stock: 150, discount: 15, rating: 4.7, reviews: 120,
  imagePrompt: 'Frozen beef kofta patties in packaging on white background, frozen meat product photography.' });

addProduct({ name: 'م春卷 دجاج مجمدة 400 جم', nameEn: 'Frozen Chicken Spring Rolls 400 g', category: frozen, price: 35, compareAtPrice: 42, subcategory: 'appetizers', brand: 'Koki', unit: '400 g', description: 'لفائف سبرينغ رول بالدجاج المجمدة مقرمشة ولذيذة، سريعة التحضير', descriptionEn: 'Frozen crispy chicken spring rolls, quick and easy to prepare', stock: 180, discount: 15, rating: 4.5, reviews: 95,
  imagePrompt: 'Frozen chicken spring rolls in packaging on white background, frozen appetizer photography.' });

addProduct({ name: 'بطاطس مجمدة قطع 1 كيلو', nameEn: 'Frozen Potato Dices 1 kg', category: frozen, price: 30, compareAtPrice: 36, subcategory: 'vegetables', brand: 'Farm Frites', unit: '1 kg', description: 'قطع بطاطس مجمدة مكعبات صغيرة مناسبة للقلي والطهي', descriptionEn: 'Frozen diced potato cubes perfect for frying and cooking', stock: 140, discount: 16, rating: 4.6, reviews: 110,
  imagePrompt: 'Frozen potato dices in bag on white background, frozen vegetable product photography.' });

addProduct({ name: 'فاصوليا خضراء مجمدة 500 جم', nameEn: 'Frozen Green Beans 500 g', category: frozen, price: 22, compareAtPrice: 27, subcategory: 'vegetables', brand: 'Green Valley', unit: '500 g', description: 'فاصوليا خضراء طازجة مجمدة، مغسولة ومقطعة ومناسبة للسلق والطهي', descriptionEn: 'Fresh frozen green beans, washed and trimmed for steaming and cooking', stock: 130, discount: 18, rating: 4.4, reviews: 75,
  imagePrompt: 'Frozen green beans in bag on white background, frozen vegetable photography.' });

addProduct({ name: 'كنافة نابلسية مجمدة 500 جم', nameEn: 'Frozen Knafeh Nabulsieh 500 g', category: frozen, price: 45, compareAtPrice: 55, subcategory: 'desserts', brand: 'Koki', unit: '500 g', description: 'كنافة نابلسية تقليدية مجمدة بالجبنة، جاهزة للطهي في الفرن', descriptionEn: 'Traditional frozen knafeh nabulsieh with cheese, ready to bake in oven', stock: 60, discount: 18, rating: 4.8, reviews: 140,
  imagePrompt: 'Frozen knafeh nabulsieh pastry in packaging on white background, frozen dessert photography.' });

addProduct({ name: 'ريبان مقشر مجمد 300 جم', nameEn: 'Frozen Peeled Shrimp 300 g', category: frozen, price: 95, compareAtPrice: 115, subcategory: 'seafood', brand: 'Fresh Catch', unit: '300 g', description: 'ربيان مقشر مجمد عالي الجودة نظيف وجاهز للطبخ', descriptionEn: 'Premium frozen peeled shrimp, clean and ready to cook', stock: 50, discount: 17, rating: 4.7, reviews: 85,
  imagePrompt: 'Frozen peeled shrimp in packaging on white background, frozen seafood photography.' });

addProduct({ name: 'سمك بورى مجمد 1 كيلو', nameEn: 'Frozen Bonefish 1 kg', category: frozen, price: 55, compareAtPrice: 65, subcategory: 'seafood', brand: 'Fresh Catch', unit: '1 kg', description: 'سمك بورى مجمد كامل مناسب للشوي والقلي', descriptionEn: 'Frozen whole bonefish perfect for grilling and frying', stock: 70, discount: 15, rating: 4.5, reviews: 60,
  imagePrompt: 'Frozen whole bonefish on white background, frozen fish photography.' });

addProduct({ name: 'بانيه بقري مجمد 500 جم', nameEn: 'Frozen Beef Schnitzel 500 g', category: frozen, price: 80, compareAtPrice: 95, subcategory: 'meat', brand: 'Koki', unit: '500 g', description: 'شرائح لحم بقري مغطاة بالبقسماط المجمدة، مقرمشة عند القلي', descriptionEn: 'Frozen breaded beef schnitzel fillets, crispy when fried', stock: 100, discount: 15, rating: 4.6, reviews: 90,
  imagePrompt: 'Frozen beef schnitzel breaded fillets in packaging on white background, frozen meat photography.' });

addProduct({ name: 'عيش مقرمش مجمد 12 قطعة', nameEn: 'Frozen Garlic Bread 12 pcs', category: frozen, price: 25, compareAtPrice: 30, subcategory: 'bakery', brand: 'Koki', unit: '12 pcs', description: 'خبز بالثوم مجمد مقرمش ولذيذ، مثالي مع الوجبات الإيطالية', descriptionEn: 'Frozen garlic bread slices, crispy and delicious, perfect with Italian meals', stock: 160, discount: 16, rating: 4.5, reviews: 100,
  imagePrompt: 'Frozen garlic bread slices in packaging on white background, frozen bakery photography.' });

addProduct({ name: 'خضار مشكلة للسلطة مجمدة 400 جم', nameEn: 'Frozen Salad Vegetables Mix 400 g', category: frozen, price: 18, compareAtPrice: 22, subcategory: 'vegetables', brand: 'Green Valley', unit: '400 g', description: '混合 خضروات مجمدة مناسبة للسلطات والطهي اليومي', descriptionEn: 'Frozen mixed salad vegetables for daily cooking and salads', stock: 120, discount: 18, rating: 4.3, reviews: 65,
  imagePrompt: 'Frozen salad vegetable mix in bag on white background, frozen vegetable photography.' });

addProduct({ name: 'صدور دجاج مجمدة 1 كيلو', nameEn: 'Frozen Chicken Breasts 1 kg', category: frozen, price: 85, compareAtPrice: 100, subcategory: 'poultry', brand: 'Al Watania', unit: '1 kg', description: 'صدور دجاج مجمدة مخلية عالية الجودة مناسبة للسلق والشوي', descriptionEn: 'Frozen boneless skinless chicken breasts, high quality for grilling and cooking', stock: 150, discount: 15, rating: 4.7, reviews: 130,
  imagePrompt: 'Frozen chicken breasts in packaging on white background, frozen poultry photography.' });

addProduct({ name: 'فطيرة لحم بقري مجمدة 400 جم', nameEn: 'Frozen Beef Pie 400 g', category: frozen, price: 50, compareAtPrice: 60, subcategory: 'ready meals', brand: 'Koki', unit: '400 g', description: 'فطيرة باللحمة المفرومة مجمدة وجاهزة للطهي في الفرن', descriptionEn: 'Frozen ground beef pie, ready to bake in the oven', stock: 90, discount: 16, rating: 4.6, reviews: 80,
  imagePrompt: 'Frozen beef pie in packaging on white background, frozen ready meal photography.' });

addProduct({ name: 'فراولة مجمدة 500 جم', nameEn: 'Frozen Strawberries 500 g', category: frozen, price: 30, compareAtPrice: 36, subcategory: 'fruits', brand: 'Green Valley', unit: '500 g', description: 'فراولة طازجة مجمدة حلوة الطعم ممتازة للعصير والحلويات', descriptionEn: 'Fresh frozen sweet strawberries, perfect for smoothies and desserts', stock: 100, discount: 16, rating: 4.8, reviews: 115,
  imagePrompt: 'Frozen strawberries in bag on white background, frozen fruit photography.' });

addProduct({ name: 'عيش بريوش مجمد 6 حبات', nameEn: 'Frozen Brioche Buns 6 pcs', category: frozen, price: 22, compareAtPrice: 27, subcategory: 'bakery', brand: 'Rich Bake', unit: '6 pcs', description: 'خبز بريوش مجمد طري وحلو، مثالي للبرجر والسندوتشات', descriptionEn: 'Frozen soft sweet brioche buns, perfect for burgers and sandwiches', stock: 140, discount: 18, rating: 4.4, reviews: 70,
  imagePrompt: 'Frozen brioche buns in packaging on white background, frozen bakery photography.' });

addProduct({ name: 'مكسرات مشكلة مجمدة 300 جم', nameEn: 'Frozen Mixed Nuts 300 g', category: frozen, price: 65, compareAtPrice: 78, subcategory: 'snacks', brand: 'Kinooz', unit: '300 g', description: 'مكسرات مشكلة فاخرة مجمدة تشمل اللوز والكاجو والجوز', descriptionEn: 'Premium frozen mixed nuts including almonds, cashews, and walnuts', stock: 80, discount: 16, rating: 4.7, reviews: 95,
  imagePrompt: 'Frozen mixed nuts in packaging on white background, frozen snack photography.' });

// ==================== PANTRY (25) ====================
const pantry = 'pantry';

addProduct({ name: 'أرز الدوحة مصري 5 كيلو', nameEn: 'Al Doha Egyptian Rice 5 kg', category: pantry, price: 85, compareAtPrice: 100, brand: 'Al Doha', unit: '5 kg', description: 'أرز مصري فاخر', descriptionEn: 'Premium Egyptian rice', stock: 150,
  imagePrompt: 'Al Doha Egyptian rice 5kg bag on white background, pantry photography.' });

addProduct({ name: 'أرز بسمتي هندي الدوحة 1 كيلو', nameEn: 'Al Doha Basmati Rice 1 kg', category: pantry, price: 30, compareAtPrice: 36, brand: 'Al Doha', unit: '1 kg', description: 'أرز بسمتي هندي فاخر', descriptionEn: 'Premium Indian basmati rice', stock: 120,
  imagePrompt: 'Al Doha basmati rice 1kg bag on white background, rice photography.' });

addProduct({ name: 'مكرونة سباغيتي الملكة 400 جم', nameEn: 'El Malka Spaghetti 400 g', category: pantry, price: 12, compareAtPrice: 15, brand: 'El Malka', unit: '400 g', description: 'مكرونة سباغيتي إيطالية', descriptionEn: 'Italian spaghetti pasta', stock: 200,
  imagePrompt: 'El Malka spaghetti pasta 400g box on white background, pasta photography.' });

addProduct({ name: 'مكرونة بيني الملكة 400 جم', nameEn: 'El Malka Penne Pasta 400 g', category: pantry, price: 12, compareAtPrice: 15, brand: 'El Malka', unit: '400 g', description: 'مكرونة بيني أنابيب', descriptionEn: 'Penne tube pasta', stock: 190,
  imagePrompt: 'El Malka penne pasta 400g box on white background, pasta photography.' });

addProduct({ name: 'مكرونة فيوزيلي الملكة 400 جم', nameEn: 'El Malka Fusilli 400 g', category: pantry, price: 13, compareAtPrice: 16, brand: 'El Malka', unit: '400 g', description: 'مكرونة فيوزيلي حلزونية', descriptionEn: 'Fusilli spiral pasta', stock: 170,
  imagePrompt: 'El Malka fusilli pasta 400g box on white background, pasta photography.' });

addProduct({ name: 'عدس أصفر الدوحة 500 جم', nameEn: 'Al Doha Yellow Lentils 500 g', category: pantry, price: 20, compareAtPrice: 24, brand: 'Al Doha', unit: '500 g', description: 'عدس أصفر مجروش', descriptionEn: 'Split yellow lentils', stock: 130,
  imagePrompt: 'Al Doha yellow lentils 500g bag on white background, legumes photography.' });

addProduct({ name: 'فول مدمس كينوز 400 جم', nameEn: 'Kinooz Fava Beans 400 g', category: pantry, price: 14, compareAtPrice: 17, brand: 'Kinooz', unit: '400 g', description: 'فول مدمس مصري', descriptionEn: 'Egyptian fava beans', stock: 160,
  imagePrompt: 'Kinooz fava beans 400g bag on white background, legumes photography.' });

addProduct({ name: 'حمص شامي الدوحة 500 جم', nameEn: 'Al Doha Chickpeas 500 g', category: pantry, price: 22, compareAtPrice: 26, brand: 'Al Doha', unit: '500 g', description: 'حمص شامي حب كبير', descriptionEn: 'Large chickpeas', stock: 100,
  imagePrompt: 'Al Doha chickpeas 500g bag on white background, legumes photography.' });

addProduct({ name: 'فاصوليا بيضاء الدوحة 400 جم', nameEn: 'Al Doha White Beans 400 g', category: pantry, price: 18, compareAtPrice: 22, brand: 'Al Doha', unit: '400 g', description: 'فاصوليا بيضاء عالية الجودة', descriptionEn: 'High-quality white beans', stock: 90,
  imagePrompt: 'Al Doha white beans 400g bag on white background, legumes photography.' });

addProduct({ name: 'دقيق أبيض فاخر 1 كيلو', nameEn: 'White Flour 1 kg', category: pantry, price: 16, compareAtPrice: 19, brand: 'El Malka', unit: '1 kg', description: 'دقيق أبيض فاخر متعدد الاستخدامات', descriptionEn: 'Premium all-purpose white flour', stock: 140,
  imagePrompt: 'White flour 1kg bag on white background, baking ingredient photography.' });

addProduct({ name: 'سكر أبيض نقي 1 كيلو', nameEn: 'Pure White Sugar 1 kg', category: pantry, price: 20, compareAtPrice: 24, brand: 'El Malka', unit: '1 kg', description: 'سكر أبيض نقي للتحلية', descriptionEn: 'Pure white sugar for sweetening', stock: 200,
  imagePrompt: 'White sugar 1kg bag on white background, baking ingredient photography.' });

addProduct({ name: 'ملح طعام ناعم 500 جم', nameEn: 'Fine Table Salt 500 g', category: pantry, price: 5, compareAtPrice: 7, brand: 'El Malka', unit: '500 g', description: 'ملح طعام ناعم معالج باليود', descriptionEn: 'Iodized fine table salt', stock: 250,
  imagePrompt: 'Fine table salt 500g pack on white background, spice photography.' });

addProduct({ name: 'شوفان كامل كويكر 500 جم', nameEn: 'Quaker Whole Oats 500 g', category: pantry, price: 35, compareAtPrice: 42, brand: 'Quaker', unit: '500 g', description: 'شوفان كامل سريع التحضير', descriptionEn: 'Quick-cook whole oats', stock: 80,
  imagePrompt: 'Quaker oats 500g container on white background, breakfast cereal photography.' });

addProduct({ name: 'فريك الدوحة 500 جم', nameEn: 'Al Doha Freekeh 500 g', category: pantry, price: 25, compareAtPrice: 30, brand: 'Al Doha', unit: '500 g', description: 'فريك أخضر مجروش', descriptionEn: 'Green cracked freekeh wheat', stock: 70,
  imagePrompt: 'Al Doha freekeh 500g bag on white background, Egyptian grain photography.' });

addProduct({ name: 'كسكسي الدوحة 500 جم', nameEn: 'Al Doha Couscous 500 g', category: pantry, price: 22, compareAtPrice: 26, brand: 'Al Doha', unit: '500 g', description: 'كسكسي مغربي ناعم', descriptionEn: 'Fine Moroccan couscous', stock: 75,
  imagePrompt: 'Al Doha couscous 500g bag on white background, grain photography.' });

addProduct({ name: 'بسلة يابسة الدوحة 400 جم', nameEn: 'Al Doha Dried Peas 400 g', category: pantry, price: 16, compareAtPrice: 19, brand: 'Al Doha', unit: '400 g', description: 'بسلة يابسة مجففة', descriptionEn: 'Dried split peas', stock: 85,
  imagePrompt: 'Al Doha dried peas 400g bag on white background, legumes photography.' });

addProduct({ name: 'لوبيا بيضاء الدوحة 400 جم', nameEn: 'Al Doha Cowpeas 400 g', category: pantry, price: 18, compareAtPrice: 22, brand: 'Al Doha', unit: '400 g', description: 'لوبيا بيضاء مجففة', descriptionEn: 'Dried cowpeas', stock: 80,
  imagePrompt: 'Al Doha cowpeas 400g bag on white background, legumes photography.' });

addProduct({ name: 'شعرية سريعة التحضير الملكة 300 جم', nameEn: 'El Malka Vermicelli 300 g', category: pantry, price: 10, compareAtPrice: 13, brand: 'El Malka', unit: '300 g', description: 'شعرية سريعة التحضير', descriptionEn: 'Quick-cook vermicelli pasta', stock: 160,
  imagePrompt: 'El Malka vermicelli 300g pack on white background, pasta photography.' });

addProduct({ name: 'بيكينج بودر 20 جم', nameEn: 'Baking Powder 20 g', category: pantry, price: 6, compareAtPrice: 8, brand: 'El Malka', unit: '20 g', description: 'بيكينج بودر للخبز والحلويات', descriptionEn: 'Baking powder for baking and desserts', stock: 200,
  imagePrompt: 'Baking powder 20g sachet on white background, baking ingredient photography.' });

addProduct({ name: 'خميرة فورية 10 جم', nameEn: 'Instant Yeast 10 g', category: pantry, price: 5, compareAtPrice: 7, brand: 'El Malka', unit: '10 g', description: 'خميرة فورية للخبز', descriptionEn: 'Instant dry yeast for baking', stock: 180,
  imagePrompt: 'Instant yeast 10g pack on white background, baking ingredient photography.' });

addProduct({ name: 'فانيليا بودرة 10 جم', nameEn: 'Vanilla Powder 10 g', category: pantry, price: 6, compareAtPrice: 8, brand: 'El Malka', unit: '10 g', description: 'فانيليا بودرة للحلويات', descriptionEn: 'Vanilla powder for desserts', stock: 220,
  imagePrompt: 'Vanilla powder 10g sachet on white background, baking photography.' });

addProduct({ name: 'جلي بالفراولة 125 جم', nameEn: 'Strawberry Jelly 125 g', category: pantry, price: 8, compareAtPrice: 10, brand: 'El Malka', unit: '125 g', description: 'جلي بنكهة الفراولة', descriptionEn: 'Strawberry flavored jelly dessert', stock: 140,
  imagePrompt: 'Strawberry jelly dessert box on white background, dessert mix photography.' });

addProduct({ name: 'بسلة خضراء مجففة الدوحة 400 جم', nameEn: 'Al Doha Green Peas 400 g', category: pantry, price: 20, compareAtPrice: 24, brand: 'Al Doha', unit: '400 g', description: 'بسلة خضراء مجففة', descriptionEn: 'Dried green peas', stock: 90,
  imagePrompt: 'Al Doha green peas 400g bag on white background, legumes photography.' });

addProduct({ name: 'مكرونة لسان عصفور الملكة 350 جم', nameEn: 'El Malka Orzo Pasta 350 g', category: pantry, price: 11, compareAtPrice: 14, brand: 'El Malka', unit: '350 g', description: 'مكرونة لسان عصفور', descriptionEn: 'Orzo pasta', stock: 170,
  imagePrompt: 'El Malka orzo pasta 350g pack on white background, pasta photography.' });

addProduct({ name: 'جوز هند مبشور 100 جم', nameEn: 'Shredded Coconut 100 g', category: pantry, price: 15, compareAtPrice: 18, brand: 'El Malka', unit: '100 g', description: 'جوز هند مبشور للحلويات', descriptionEn: 'Shredded coconut for desserts', stock: 100,
  imagePrompt: 'Shredded coconut 100g bag on white background, baking ingredient photography.' });

addProduct({ name: 'أرز بسمتي أبو كاس 1 كيلو', nameEn: 'Abu Kas Basmati Rice 1 kg', category: pantry, price: 35, compareAtPrice: 42, brand: 'Abu Kas', unit: '1 kg', description: 'أرز بسمتي فاخر من أبي كاس بحب طويل ورائحة عطرية مميزة', descriptionEn: 'Premium Abu Kas basmati rice with long grains and distinctive aroma', stock: 180, discount: 16, rating: 4.6, reviews: 120,
  imagePrompt: 'Abu Kas basmati rice 1kg bag on white background, premium rice product photography.' });

addProduct({ name: 'مكرونة ألبان صوابع 400 جم', nameEn: 'Swaa Pasta Fingers 400 g', category: pantry, price: 10, compareAtPrice: 13, brand: 'El Malka', unit: '400 g', description: 'مكرونة صوابع ملونة للأطفال والمعلبات', descriptionEn: 'Colorful finger-shaped pasta for kids and ready meals', stock: 160, discount: 15, rating: 4.3, reviews: 85,
  imagePrompt: 'Swaa pasta fingers 400g box on white background, shaped pasta product photography.' });

addProduct({ name: 'عدس أحمر الدوحة 500 جم', nameEn: 'Al Doha Red Lentils 500 g', category: pantry, price: 22, compareAtPrice: 26, brand: 'Al Doha', unit: '500 g', description: 'عدس أحمر مجروش سريع التحضير غني بالبروتين والألياف', descriptionEn: 'Al Doha split red lentils rich in protein and fiber, quick to cook', stock: 140, discount: 15, rating: 4.7, reviews: 95,
  imagePrompt: 'Al Doha red lentils 500g bag on white background, legume product photography.' });

addProduct({ name: 'فول مدمس بالزيت كينوز 400 جم', nameEn: 'Kinooz Fava Beans in Oil 400 g', category: pantry, price: 16, compareAtPrice: 19, brand: 'Kinooz', unit: '400 g', description: 'فول مدمس مصري بالزيت جاهز للأكل مع البصل والليمون', descriptionEn: 'Kinooz Egyptian fava beans in oil ready to serve with onion and lemon', stock: 170, discount: 14, rating: 4.5, reviews: 110,
  imagePrompt: 'Kinooz fava beans in oil 400g can on white background, canned beans photography.' });

addProduct({ name: 'حمص مسلوق الدوحة 400 جم', nameEn: 'Al Doha Cooked Chickpeas 400 g', category: pantry, price: 14, compareAtPrice: 17, brand: 'Al Doha', unit: '400 g', description: 'حمص شامي مسلوق جاهز للأكل والسلطات', descriptionEn: 'Al Doha cooked chickpeas ready for salads and meals', stock: 150, discount: 15, rating: 4.4, reviews: 78,
  imagePrompt: 'Al Doha cooked chickpeas 400g can on white background, canned legume photography.' });

addProduct({ name: 'دقيق أسمر 1 كيلو', nameEn: 'Brown Flour 1 kg', category: pantry, price: 18, compareAtPrice: 22, brand: 'El Malka', unit: '1 kg', description: 'دقيق أسمر غني بالألياف مناسب للخبز الصحي', descriptionEn: 'El Malka fiber-rich brown flour ideal for healthy baking', stock: 130, discount: 18, rating: 4.3, reviews: 65,
  imagePrompt: 'El Malka brown flour 1kg bag on white background, baking ingredient photography.' });

addProduct({ name: 'سكر بني 500 جم', nameEn: 'Brown Sugar 500 g', category: pantry, price: 15, compareAtPrice: 18, brand: 'El Malka', unit: '500 g', description: 'سكر بني ناعم بنكهة الكراميل الخفيفة للحلويات والمشروبات', descriptionEn: 'El Malka fine brown sugar with light caramel flavor for baking and drinks', stock: 140, discount: 15, rating: 4.4, reviews: 72,
  imagePrompt: 'El Malka brown sugar 500g pack on white background, sugar product photography.' });

addProduct({ name: 'أرز ياسمين 1 كيلو', nameEn: 'Jasmine Rice 1 kg', category: pantry, price: 28, compareAtPrice: 33, brand: 'Al Doha', unit: '1 kg', description: 'أرز ياسمين تايلندي عطري بحب متوسط الحجم', descriptionEn: 'Al Doha aromatic Thai jasmine rice with medium grains', stock: 110, discount: 15, rating: 4.7, reviews: 135,
  imagePrompt: 'Al Doha jasmine rice 1kg bag on white background, aromatic rice product photography.' });

addProduct({ name: 'شعيرية صينية 250 جم', nameEn: 'Chinese Noodles 250 g', category: pantry, price: 12, compareAtPrice: 15, brand: 'El Malka', unit: '250 g', description: 'شعيرية صينية رقيقة سريعة التحضير للشوربات والأطباق المقلية', descriptionEn: 'El Malka thin Chinese noodles quick to prepare for soups and stir-fries', stock: 120, discount: 16, rating: 4.3, reviews: 58,
  imagePrompt: 'El Malka Chinese noodles 250g pack on white background, Asian noodle photography.' });

addProduct({ name: 'صلصة طماطم مركزة 200 جم', nameEn: 'Concentrated Tomato Paste 200 g', category: pantry, price: 10, compareAtPrice: 13, brand: 'California Garden', unit: '200 g', description: 'صلصة طماطم مركزة عالية الجودة لتحسين نكهة الأطباق', descriptionEn: 'California Garden concentrated tomato paste to enhance flavor of dishes', stock: 200, discount: 15, rating: 4.6, reviews: 145,
  imagePrompt: 'California Garden tomato paste 200g can on white background, cooking ingredient photography.' });

addProduct({ name: 'صلصة فاصوليا 400 جم', nameEn: 'Baked Beans Sauce 400 g', category: pantry, price: 14, compareAtPrice: 17, brand: 'California Garden', unit: '400 g', description: 'فاصوليا بيضاء في صلصة حلوة جاهزة للأكل', descriptionEn: 'California Garden baked beans in sweet sauce ready to serve', stock: 160, discount: 15, rating: 4.5, reviews: 92,
  imagePrompt: 'California Garden baked beans 400g can on white background, canned food photography.' });

addProduct({ name: 'فول أخضر مجفف 400 جم', nameEn: 'Al Doha Dried Green Fava Beans 400 g', category: pantry, price: 18, compareAtPrice: 22, brand: 'Al Doha', unit: '400 g', description: 'فول أخضر مجفف عالي الجودة مناسب لشوربة الفول والطبخ', descriptionEn: 'Al Doha dried green fava beans ideal for fava bean soup and cooking', stock: 90, discount: 18, rating: 4.3, reviews: 55,
  imagePrompt: 'Al Doha dried green fava beans 400g bag on white background, dried legume photography.' });

addProduct({ name: 'برقوق مجفف 200 جم', nameEn: 'Dried Apricots 200 g', category: pantry, price: 25, compareAtPrice: 30, brand: 'Kinooz', unit: '200 g', description: 'برقوق مجفف حلو المذاق غني بالفيتامينات والمعادن', descriptionEn: 'Kinooz sweet dried apricots rich in vitamins and minerals', stock: 80, discount: 16, rating: 4.7, reviews: 105,
  imagePrompt: 'Kinooz dried apricots 200g pack on white background, dried fruit photography.' });

addProduct({ name: 'عنب مجفف 200 جم', nameEn: 'Raisins 200 g', category: pantry, price: 20, compareAtPrice: 24, brand: 'Kinooz', unit: '200 g', description: 'زبيب ذهبي حلو مناسب للحلويات والأطباق الشرقية', descriptionEn: 'Kinooz golden sweet raisins ideal for desserts and Middle Eastern dishes', stock: 100, discount: 16, rating: 4.5, reviews: 88,
  imagePrompt: 'Kinooz golden raisins 200g pack on white background, dried fruit photography.' });

addProduct({ name: 'شوفان سريع التحضير 350 جم', nameEn: 'Quick Oats 350 g', category: pantry, price: 28, compareAtPrice: 34, brand: 'Quaker', unit: '350 g', description: 'شوفان كويكر سريع التحضير للإفطار الصحي والمشبع', descriptionEn: 'Quaker quick oats for a healthy and filling breakfast', stock: 95, discount: 17, rating: 4.8, reviews: 160,
  imagePrompt: 'Quaker quick oats 350g box on white background, breakfast cereal photography.' });

addProduct({ name: 'بسكويت شعيرية 200 جم', nameEn: 'Wheat Biscuits 200 g', category: pantry, price: 15, compareAtPrice: 18, brand: 'El Malka', unit: '200 g', description: 'بسكويت شعيرية صحي مقرمش مناسب للإفطار مع الحليب', descriptionEn: 'El Malka crunchy wheat biscuits perfect for breakfast with milk', stock: 130, discount: 15, rating: 4.3, reviews: 70,
  imagePrompt: 'El Malka wheat biscuits 200g pack on white background, biscuit product photography.' });

addProduct({ name: 'مكسرات مشكلة محمصة 200 جم', nameEn: 'Roasted Mixed Nuts 200 g', category: pantry, price: 55, compareAtPrice: 65, brand: 'Kinooz', unit: '200 g', description: 'مكسرات مشكلة محمصة بالملح خلطة بندق ولوز وجوز وكركديه', descriptionEn: 'Kinooz roasted mixed nuts with hazelnuts, almonds, cashews and hibiscus', stock: 70, discount: 15, rating: 4.8, reviews: 195,
  imagePrompt: 'Kinooz roasted mixed nuts 200g pack on white background, nut snack photography.' });

addProduct({ name: 'بندق محمص 150 جم', nameEn: 'Roasted Hazelnuts 150 g', category: pantry, price: 40, compareAtPrice: 48, brand: 'Kinooz', unit: '150 g', description: 'بندق محمص مقشر غني بالدهون الصحية والبروتين', descriptionEn: 'Kinooz roasted peeled hazelnuts rich in healthy fats and protein', stock: 65, discount: 16, rating: 4.7, reviews: 110,
  imagePrompt: 'Kinooz roasted hazelnuts 150g pack on white background, premium nut photography.' });

addProduct({ name: 'لوز محمص 150 جم', nameEn: 'Roasted Almonds 150 g', category: pantry, price: 50, compareAtPrice: 60, brand: 'Kinooz', unit: '150 g', description: 'لوز محمص مقرمش غني بالألياف والفيتامينات', descriptionEn: 'Kinooz crunchy roasted almonds rich in fiber and vitamins', stock: 75, discount: 16, rating: 4.8, reviews: 140,
  imagePrompt: 'Kinooz roasted almonds 150g pack on white background, premium nut photography.' });

addProduct({ name: 'كاجو محمص 100 جم', nameEn: 'Roasted Cashews 100 g', category: pantry, price: 45, compareAtPrice: 55, brand: 'Kinooz', unit: '100 g', description: 'كاجو محمص فاخر بملمس طريق ولذيذ', descriptionEn: 'Kinooz premium roasted cashews with soft texture and delicious taste', stock: 60, discount: 17, rating: 4.9, reviews: 130,
  imagePrompt: 'Kinooz roasted cashews 100g pack on white background, premium nut photography.' });

// ==================== CONDIMENTS (20) ====================
const condiments = 'condiments';

addProduct({ name: 'زيت كريستال عباد شمس 1.5 لتر', nameEn: 'Cristal Sunflower Oil 1.5 L', category: condiments, price: 95, compareAtPrice: 110, brand: 'Cristal', unit: '1.5 L', description: 'زيت عباد شمس نقي', descriptionEn: 'Pure sunflower oil', stock: 150,
  imagePrompt: 'Cristal sunflower oil 1.5L bottle on white background, cooking oil photography.' });

addProduct({ name: 'زيت كريستال ذرة 1.5 لتر', nameEn: 'Cristal Corn Oil 1.5 L', category: condiments, price: 100, compareAtPrice: 118, brand: 'Cristal', unit: '1.5 L', description: 'زيت ذرة نقي للطهي', descriptionEn: 'Pure corn oil for cooking', stock: 130,
  imagePrompt: 'Cristal corn oil 1.5L bottle on white background, cooking oil photography.' });

addProduct({ name: 'زيت زيتون عافية 500 مل', nameEn: 'Afia Olive Oil 500 ml', category: condiments, price: 65, compareAtPrice: 78, brand: 'Afia', unit: '500 ml', description: 'زيت زيتون بكر ممتاز', descriptionEn: 'Extra virgin olive oil', stock: 80,
  imagePrompt: 'Afia olive oil 500ml bottle on white background, olive oil photography.' });

addProduct({ name: 'سمنه طبيعية حلواني 1 كيلو', nameEn: 'Halwani Natural Ghee 1 kg', category: condiments, price: 85, compareAtPrice: 100, brand: 'Halwani', unit: '1 kg', description: 'سمن طبيعي نقي', descriptionEn: 'Pure natural ghee', stock: 90,
  imagePrompt: 'Halwani ghee 1kg container on white background, ghee photography.' });

addProduct({ name: 'سمنة شيراتون سايل 800 جم', nameEn: 'Sheraton Pure Ghee 800 g', category: condiments, price: 70, compareAtPrice: 82, brand: 'Sheraton', unit: '800 g', description: 'سمنة طبيعية صافية', descriptionEn: 'Pure clarified ghee', stock: 85,
  imagePrompt: 'Sheraton ghee 800g container on white background, ghee photography.' });

addProduct({ name: 'كاتشب هاينز 397 جم', nameEn: 'Heinz Tomato Ketchup 397 g', category: condiments, price: 30, compareAtPrice: 36, brand: 'Heinz', unit: '397 g', description: 'كاتشب طماطم غني', descriptionEn: 'Rich tomato ketchup', stock: 200,
  imagePrompt: 'Heinz tomato ketchup 397g bottle on white background, condiment photography.' });

addProduct({ name: 'مايونيز هالمانز 400 مل', nameEn: 'Hellmanns Mayonnaise 400 ml', category: condiments, price: 42, compareAtPrice: 50, brand: 'Hellmanns', unit: '400 ml', description: 'مايونيز كريمي غني', descriptionEn: 'Rich creamy mayonnaise', stock: 160,
  imagePrompt: 'Hellmanns mayonnaise 400ml jar on white background, condiment photography.' });

addProduct({ name: 'مستردة هاينز 200 جم', nameEn: 'Heinz Mustard 200 g', category: condiments, price: 25, compareAtPrice: 30, brand: 'Heinz', unit: '200 g', description: 'مستردة صفراء حارة', descriptionEn: 'Yellow spicy mustard', stock: 90,
  imagePrompt: 'Heinz mustard 200g jar on white background, condiment photography.' });

addProduct({ name: 'صلصة طماطم كاليفورنيا جاردن 400 جم', nameEn: 'California Garden Tomato Sauce 400 g', category: condiments, price: 18, compareAtPrice: 22, brand: 'California Garden', unit: '400 g', description: 'صلصة طماطم مركزة للطهي', descriptionEn: 'Concentrated tomato sauce for cooking', stock: 180,
  imagePrompt: 'California Garden tomato sauce 400g pouch on white background, cooking sauce photography.' });

addProduct({ name: 'صلصة مكرونة ايطالية 400 جم', nameEn: 'Italian Pasta Sauce 400 g', category: condiments, price: 32, compareAtPrice: 38, brand: 'Heinz', unit: '400 g', description: 'صلصة مكرونة بالريحان والثوم', descriptionEn: 'Basil and garlic pasta sauce', stock: 100,
  imagePrompt: 'Italian pasta sauce 400g jar on white background, cooking sauce photography.' });

addProduct({ name: 'خل أبيض 500 مل', nameEn: 'White Vinegar 500 ml', category: condiments, price: 12, compareAtPrice: 15, brand: 'El Malka', unit: '500 ml', description: 'خل أبيض للطهي والتخليل', descriptionEn: 'White vinegar for cooking and pickling', stock: 140,
  imagePrompt: 'White vinegar 500ml bottle on white background, condiment photography.' });

addProduct({ name: 'خل تفاح كريستال 500 مل', nameEn: 'Cristal Apple Vinegar 500 ml', category: condiments, price: 18, compareAtPrice: 22, brand: 'Cristal', unit: '500 ml', description: 'خل تفاح طبيعي', descriptionEn: 'Natural apple cider vinegar', stock: 100,
  imagePrompt: 'Cristal apple vinegar 500ml bottle on white background, condiment photography.' });

addProduct({ name: 'بهارات مشكلة كينوز 200 جم', nameEn: 'Kinooz Mixed Spices 200 g', category: condiments, price: 18, compareAtPrice: 22, brand: 'Kinooz', unit: '200 g', description: 'بهارات مشكلة للطهي', descriptionEn: 'Mixed cooking spices blend', stock: 120,
  imagePrompt: 'Kinooz mixed spices 200g bag on white background, spice photography.' });

addProduct({ name: 'كمون كينوز 100 جم', nameEn: 'Kinooz Cumin 100 g', category: condiments, price: 10, compareAtPrice: 13, brand: 'Kinooz', unit: '100 g', description: 'كمون حب نقي', descriptionEn: 'Pure cumin seeds', stock: 130,
  imagePrompt: 'Kinooz cumin 100g pack on white background, spice photography.' });

addProduct({ name: 'بابريكا كينوز 100 جم', nameEn: 'Kinooz Paprika 100 g', category: condiments, price: 14, compareAtPrice: 17, brand: 'Kinooz', unit: '100 g', description: 'بابريكا حلوة مطحونة', descriptionEn: 'Ground sweet paprika', stock: 110,
  imagePrompt: 'Kinooz paprika 100g pack on white background, spice photography.' });

addProduct({ name: 'كركم كينوز 100 جم', nameEn: 'Kinooz Turmeric 100 g', category: condiments, price: 12, compareAtPrice: 15, brand: 'Kinooz', unit: '100 g', description: 'كركم مطحون نقي', descriptionEn: 'Pure ground turmeric', stock: 115,
  imagePrompt: 'Kinooz turmeric 100g pack on white background, spice photography.' });

addProduct({ name: 'شطة كينوز 100 جم', nameEn: 'Kinooz Chili Powder 100 g', category: condiments, price: 10, compareAtPrice: 13, brand: 'Kinooz', unit: '100 g', description: 'شطة حارة مطحونة', descriptionEn: 'Ground hot chili powder', stock: 125,
  imagePrompt: 'Kinooz chili powder 100g pack on white background, spice photography.' });

addProduct({ name: 'دقة كينوز 150 جم', nameEn: 'Kinooz Duqqa 150 g', category: condiments, price: 15, compareAtPrice: 18, brand: 'Kinooz', unit: '150 g', description: 'دقة مصرية بالسمسم والملح', descriptionEn: 'Egyptian duqqa spice blend with sesame', stock: 95,
  imagePrompt: 'Kinooz duqqa 150g container on white background, Egyptian spice photography.' });

addProduct({ name: 'صلصة الصويا 200 مل', nameEn: 'Soy Sauce 200 ml', category: condiments, price: 18, compareAtPrice: 22, brand: 'Kikkoman', unit: '200 ml', description: 'صلصة صويا يابانية', descriptionEn: 'Japanese soy sauce', stock: 60,
  imagePrompt: 'Soy sauce 200ml bottle on white background, condiment photography.' });

addProduct({ name: 'زيت نباتي صني 1.5 لتر', nameEn: 'Sunny Vegetable Oil 1.5 L', category: condiments, price: 85, compareAtPrice: 100, brand: 'Sunny', unit: '1.5 L', description: 'زيت نباتي متعدد الاستخدامات', descriptionEn: 'Multi-purpose vegetable oil', stock: 140,
  imagePrompt: 'Sunny vegetable oil 1.5L bottle on white background, cooking oil photography.' });

addProduct({ name: 'زيت زيتون كريستال بكر 1 لتر', nameEn: 'Cristal Extra Virgin Olive Oil 1 L', category: condiments, price: 110, compareAtPrice: 130, brand: 'Cristal', unit: '1 L', description: 'زيت زيتون بكر ممتاز من أجود ثمار الزيتون، مناسب للسلطات والطبخ الصحي', descriptionEn: 'Premium extra virgin olive oil from the finest olives, ideal for salads and healthy cooking', stock: 180, discount: 15, rating: 4.8, reviews: 190, imagePrompt: 'Cristal extra virgin olive oil 1 liter dark glass bottle on white background, premium olive oil product photography.' });

addProduct({ name: 'خل بلسميك 250 مل', nameEn: 'Balsamic Vinegar 250 ml', category: condiments, price: 25, compareAtPrice: 30, brand: 'El Malka', unit: '250 ml', description: 'خل بلسميك إيطالي مركز بنكهة حلوة مميزة، مثالي للسلطات والuhan', descriptionEn: 'Italian concentrated balsamic vinegar with a distinctive sweet flavor, perfect for salads and marinades', stock: 120, discount: 16, rating: 4.5, reviews: 85, imagePrompt: 'El Malka balsamic vinegar 250ml bottle on white background, premium vinegar product photography.' });

addProduct({ name: 'صلصة بيتزا هاينز 340 جم', nameEn: 'Heinz Pizza Sauce 340 g', category: condiments, price: 35, compareAtPrice: 42, brand: 'Heinz', unit: '340 g', description: 'صلصة بيتزا جاهزة بالتوابل الإيطالية والريحان، سريعة التحضير', descriptionEn: 'Ready-to-use pizza sauce with Italian herbs and basil for quick homemade pizza', stock: 100, discount: 17, rating: 4.6, reviews: 110, imagePrompt: 'Heinz pizza sauce 340g jar on white background, cooking sauce product photography.' });

addProduct({ name: 'صلصة صويا لايت 150 مل', nameEn: 'Light Soy Sauce 150 ml', category: condiments, price: 22, compareAtPrice: 27, brand: 'Kikkoman', unit: '150 ml', description: 'صلصة صويا يابانية خفيفة قليلة الصوديوم، مثالية للطبخ اليومي والسلطات', descriptionEn: 'Japanese light soy sauce with reduced sodium, ideal for daily cooking and salads', stock: 140, discount: 18, rating: 4.7, reviews: 120, imagePrompt: 'Kikkoman light soy sauce 150ml bottle on white background, Japanese condiment photography.' });

addProduct({ name: 'زيت سمسم 250 مل', nameEn: 'Sesame Oil 250 ml', category: condiments, price: 30, compareAtPrice: 36, brand: 'Kikkoman', unit: '250 ml', description: 'زيت سمسم ياباني عطري لتتبيل الأطباق الآسيوية والسلطات', descriptionEn: 'Aromatic Japanese sesame oil for seasoning Asian dishes and salads', stock: 90, discount: 15, rating: 4.6, reviews: 95, imagePrompt: 'Kikkoman sesame oil 250ml bottle on white background, Asian cooking oil photography.' });

addProduct({ name: 'صلصة برتقال البرازيل 500 مل', nameEn: 'Brazilian Orange Sauce 500 ml', category: condiments, price: 28, compareAtPrice: 34, brand: 'Heinz', unit: '500 ml', description: 'صلصة برتقال برازيلية حلوة وحامضة لذيذة مع الدجاج واللحوم المشوية', descriptionEn: 'Sweet and tangy Brazilian orange sauce perfect for grilled chicken and meats', stock: 110, discount: 18, rating: 4.4, reviews: 70, imagePrompt: 'Heinz Brazilian orange sauce 500ml bottle on white background, fruit sauce product photography.' });

addProduct({ name: 'مستردة داين 200 جم', nameEn: 'Dijon Mustard 200 g', category: condiments, price: 32, compareAtPrice: 38, brand: 'Heinz', unit: '200 g', description: 'مستردة داين فرنسية حارة وباردة، مثالية للساندويتشات والصلصات', descriptionEn: 'Classic French Dijon mustard, sharp and tangy, ideal for sandwiches and sauces', stock: 85, discount: 16, rating: 4.7, reviews: 130, imagePrompt: 'Heinz Dijon mustard 200g jar on white background, premium condiment photography.' });

addProduct({ name: 'صلصة ورشيستير 150 مل', nameEn: 'Worcestershire Sauce 150 ml', category: condiments, price: 22, compareAtPrice: 27, brand: 'Heinz', unit: '150 ml', description: 'صلصة ورشيستير إنجليزية غنية بنكهة الكراميل والتوابل، تضيف عمق للطعام', descriptionEn: 'Rich English Worcestershire sauce with caramel and spice notes to deepen flavor', stock: 75, discount: 15, rating: 4.5, reviews: 80, imagePrompt: 'Heinz Worcestershire sauce 150ml bottle on white background, condiment product photography.' });

addProduct({ name: 'بهارات كارى كينوز 100 جم', nameEn: 'Kinooz Curry Powder 100 g', category: condiments, price: 15, compareAtPrice: 18, brand: 'Kinooz', unit: '100 g', description: 'خلطة بهارات كارى هندية غنية بالتوابل العطرية للأطباق المتنوعة', descriptionEn: 'Aromatic Indian curry powder spice blend for a variety of flavorful dishes', stock: 130, discount: 14, rating: 4.6, reviews: 90, imagePrompt: 'Kinooz curry powder 100g pack on white background, Indian spice product photography.' });

addProduct({ name: 'فلفل أسود مطحون كينوز 100 جم', nameEn: 'Kinooz Ground Black Pepper 100 g', category: condiments, price: 12, compareAtPrice: 15, brand: 'Kinooz', unit: '100 g', description: 'فلفل أسود مطحون نقي بنكهة حارة قوية مناسب لجميع الأطباق', descriptionEn: 'Pure ground black pepper with intense heat, essential seasoning for all dishes', stock: 150, discount: 13, rating: 4.8, reviews: 145, imagePrompt: 'Kinooz ground black pepper 100g pack on white background, spice product photography.' });

addProduct({ name: 'قرفة كينوز 50 جم', nameEn: 'Kinooz Cinnamon 50 g', category: condiments, price: 10, compareAtPrice: 13, brand: 'Kinooz', unit: '50 g', description: 'قرفة مطحونة عطرية بنكهة دافئة ومميزة للحلويات والمشروبات', descriptionEn: 'Aromatic ground cinnamon with warm flavor for desserts and beverages', stock: 160, discount: 15, rating: 4.7, reviews: 115, imagePrompt: 'Kinooz cinnamon 50g pack on white background, warm spice product photography.' });

addProduct({ name: 'زعتر كينوز 50 جم', nameEn: 'Kinooz Thyme 50 g', category: condiments, price: 10, compareAtPrice: 13, brand: 'Kinooz', unit: '50 g', description: 'زعتر مجفف عطري ناعم مناسب للسلطات والمعجنات والأطباق الشرقية', descriptionEn: 'Dried aromatic fine thyme perfect for salads, pastries, and Middle Eastern dishes', stock: 140, discount: 14, rating: 4.6, reviews: 100, imagePrompt: 'Kinooz dried thyme 50g pack on white background, herb spice photography.' });

addProduct({ name: 'ملح اسود كينوز 100 جم', nameEn: 'Kinooz Black Salt 100 g', category: condiments, price: 8, compareAtPrice: 10, brand: 'Kinooz', unit: '100 g', description: 'ملح أسود هندي غني بالمعادن بنكهة مميزة للسلطات والسلطات الهندية', descriptionEn: 'Mineral-rich Indian black salt with distinctive flavor for salads and chaat', stock: 120, discount: 12, rating: 4.4, reviews: 65, imagePrompt: 'Kinooz black salt 100g pack on white background, specialty salt photography.' });

addProduct({ name: 'زيت أفوكادو 250 مل', nameEn: 'Afia Avocado Oil 250 ml', category: condiments, price: 55, compareAtPrice: 65, brand: 'Afia', unit: '250 ml', description: 'زيت أفوكادو بكر غني بالدهون الصحية المناسب للطهي والسلطات', descriptionEn: 'Premium virgin avocado oil rich in healthy fats, ideal for cooking and salads', stock: 70, discount: 15, rating: 4.8, reviews: 140, imagePrompt: 'Afia avocado oil 250ml bottle on white background, premium healthy oil photography.' });

addProduct({ name: 'صلصة حارة تاباسكو 60 مل', nameEn: 'Tabasco Hot Sauce 60 ml', category: condiments, price: 28, compareAtPrice: 34, brand: 'Tabasco', unit: '60 ml', description: 'صلصة حارة تاباسكو أمريكية معتدلة تضيف لمسة حارة لذيذة للأطباق', descriptionEn: 'Classic American Tabasco hot sauce with moderate heat to add a spicy kick to dishes', stock: 95, discount: 16, rating: 4.7, reviews: 175, imagePrompt: 'Tabasco hot sauce 60ml bottle on white background, iconic hot sauce product photography.' });

// ==================== SNACKS (28) ====================
const snacks = 'snacks';

addProduct({ name: 'بسكويت أوريو 154 جم', nameEn: 'Oreo Chocolate Biscuits 154 g', category: snacks, price: 30, compareAtPrice: 36, brand: 'Oreo', unit: '154 g', description: 'بسكويت أوريو بالشوكولاتة', descriptionEn: 'Chocolate Oreo biscuits', stock: 200,
  imagePrompt: 'Oreo chocolate biscuits 154g pack on white background, snack photography.' });

addProduct({ name: 'بسكويت أوريو دابل 133 جم', nameEn: 'Oreo Double Cream 133 g', category: snacks, price: 32, compareAtPrice: 38, brand: 'Oreo', unit: '133 g', description: 'بسكويت أوريو بكريمة مضاعفة', descriptionEn: 'Oreo biscuits with double cream', stock: 160,
  imagePrompt: 'Oreo double cream 133g pack on white background, biscuit photography.' });

addProduct({ name: 'بسكويت دايجستف لايت 250 جم', nameEn: 'Light Digestive Biscuits 250 g', category: snacks, price: 18, compareAtPrice: 22, brand: 'Bisco Misr', unit: '250 g', description: 'بسكويت دايجستف لايت', descriptionEn: 'Light digestive biscuits', stock: 180,
  imagePrompt: 'Digestive biscuits 250g pack on white background, biscuit photography.' });

addProduct({ name: 'بسكويت تيدي بور 110 جم', nameEn: 'Teddy Bear Biscuits 110 g', category: snacks, price: 10, compareAtPrice: 13, brand: 'Bisco Misr', unit: '110 g', description: 'بسكويت تيدي للاطفال', descriptionEn: 'Teddy bear shaped biscuits for kids', stock: 220,
  imagePrompt: 'Teddy bear biscuits 110g pack on white background, kids snack photography.' });

addProduct({ name: 'بسكويت ويفر شوكولاتة 150 جم', nameEn: 'Chocolate Wafer 150 g', category: snacks, price: 16, compareAtPrice: 20, brand: 'Edita', unit: '150 g', description: 'ويفر مغطى بالشوكولاتة', descriptionEn: 'Chocolate covered wafer', stock: 190,
  imagePrompt: 'Chocolate wafer 150g pack on white background, snack photography.' });

addProduct({ name: 'بسكويت لوتس 154 جم', nameEn: 'Lotus Biscoff 154 g', category: snacks, price: 28, compareAtPrice: 34, brand: 'Lotus', unit: '154 g', description: 'بسكويت لوتس بالكاراميل', descriptionEn: 'Caramelized Lotus biscoff biscuits', stock: 140,
  imagePrompt: 'Lotus biscoff 154g pack on white background, biscuit photography.' });

addProduct({ name: 'رقائق بطاطس شيبسي ملح وخل 100 جم', nameEn: 'Chipsy Salt & Vinegar 100 g', category: snacks, price: 10, compareAtPrice: 13, brand: 'Chipsy', unit: '100 g', description: 'شيبس بطاطس ملح وخل', descriptionEn: 'Salt and vinegar potato chips', stock: 300,
  imagePrompt: 'Chipsy salt and vinegar 100g pack on white background, chip snack photography.' });

addProduct({ name: 'رقائق بطاطس شيبسي كاتشب 100 جم', nameEn: 'Chipsy Ketchup 100 g', category: snacks, price: 10, compareAtPrice: 13, brand: 'Chipsy', unit: '100 g', description: 'شيبس بطاطس بنكهة الكاتشب', descriptionEn: 'Ketchup flavored potato chips', stock: 280,
  imagePrompt: 'Chipsy ketchup 100g pack on white background, chip photography.' });

addProduct({ name: 'رقائق بطاطس شيبسي شطة وليمون 100 جم', nameEn: 'Chipsy Chili & Lemon 100 g', category: snacks, price: 10, compareAtPrice: 13, brand: 'Chipsy', unit: '100 g', description: 'شيبس بطاطس شطة وليمون', descriptionEn: 'Chili and lemon potato chips', stock: 260,
  imagePrompt: 'Chipsy chili lemon 100g pack on white background, chip photography.' });

addProduct({ name: 'رقائق بطاطس برينجلز أوريجينال 165 جم', nameEn: 'Pringles Original 165 g', category: snacks, price: 45, compareAtPrice: 55, brand: 'Pringles', unit: '165 g', description: 'رقائق بطاطس برينجلز الأصلية', descriptionEn: 'Original Pringles potato crisps', stock: 120,
  imagePrompt: 'Pringles original 165g can on white background, chip snack photography.' });

addProduct({ name: 'رقائق بطاطس برينجلز حار 165 جم', nameEn: 'Pringles Hot & Spicy 165 g', category: snacks, price: 45, compareAtPrice: 55, brand: 'Pringles', unit: '165 g', description: 'رقائق بطاطس برينجلز الحارة', descriptionEn: 'Hot and spicy Pringles', stock: 100,
  imagePrompt: 'Pringles hot spicy 165g can on white background, chip photography.' });

addProduct({ name: 'شوكولاتة كادبوري ديري ميلك 90 جم', nameEn: 'Cadbury Dairy Milk 90 g', category: snacks, price: 25, compareAtPrice: 30, brand: 'Cadbury', unit: '90 g', description: 'شوكولاتة كادبوري ديري ميلك', descriptionEn: 'Cadbury Dairy Milk chocolate', stock: 180,
  imagePrompt: 'Cadbury dairy milk 90g bar on white background, chocolate photography.' });

addProduct({ name: 'شوكولاتة كادبوري فلوت 70 جم', nameEn: 'Cadbury Flute 70 g', category: snacks, price: 22, compareAtPrice: 27, brand: 'Cadbury', unit: '70 g', description: 'شوكولاتة كادبوري فلوت بالبندق', descriptionEn: 'Cadbury Flute chocolate with hazelnut', stock: 160,
  imagePrompt: 'Cadbury flute 70g bar on white background, chocolate photography.' });

addProduct({ name: 'شوكولاتة سنيكرز 55 جم', nameEn: 'Snickers Bar 55 g', category: snacks, price: 18, compareAtPrice: 22, brand: 'Snickers', unit: '55 g', description: 'شوكولاتة سنيكرز بالفول السوداني', descriptionEn: 'Snickers bar with peanuts and caramel', stock: 200,
  imagePrompt: 'Snickers 55g bar on white background, chocolate bar photography.' });

addProduct({ name: 'شوكولاتة كيت كات 41.5 جم', nameEn: 'Kit Kat 41.5 g', category: snacks, price: 12, compareAtPrice: 15, brand: 'Kit Kat', unit: '41.5 g', description: 'شوكولاتة كيت كات مقرمشة', descriptionEn: 'Crispy Kit Kat chocolate wafer', stock: 220,
  imagePrompt: 'Kit Kat 41.5g bar on white background, chocolate wafer photography.' });

addProduct({ name: 'بسكويت بوو 32 جم', nameEn: 'Booh Biscuits 32 g', category: snacks, price: 5, compareAtPrice: 7, brand: 'Bisco Misr', unit: '32 g', description: 'بسكويت بوو للاطفال بالشوكولاتة', descriptionEn: 'Booh kids chocolate biscuits', stock: 250,
  imagePrompt: 'Booh kids biscuits 32g pack on white background, kids snack photography.' });

addProduct({ name: 'بسكويت ماري 200 جم', nameEn: 'Marie Biscuits 200 g', category: snacks, price: 12, compareAtPrice: 15, brand: 'Bisco Misr', unit: '200 g', description: 'بسكويت ماري السادة', descriptionEn: 'Plain Marie biscuits', stock: 240,
  imagePrompt: 'Marie biscuits 200g pack on white background, tea biscuit photography.' });

addProduct({ name: 'سناكس ذرة شيبسي 75 جم', nameEn: 'Chipsy Corn Snack 75 g', category: snacks, price: 8, compareAtPrice: 10, brand: 'Chipsy', unit: '75 g', description: 'سناكس ذرة بنكهة الجبنة', descriptionEn: 'Cheese flavored corn snack', stock: 230,
  imagePrompt: 'Chipsy corn snack 75g pack on white background, corn snack photography.' });

addProduct({ name: 'فول سوداني محمص مملح 100 جم', nameEn: 'Roasted Salted Peanuts 100 g', category: snacks, price: 10, compareAtPrice: 13, brand: 'Kinooz', unit: '100 g', description: 'فول سوداني محمص ومملح', descriptionEn: 'Roasted salted peanuts', stock: 170,
  imagePrompt: 'Roasted salted peanuts pack on white background, nut snack photography.' });

addProduct({ name: 'بذور عباد الشمس محمصة 150 جم', nameEn: 'Roasted Sunflower Seeds 150 g', category: snacks, price: 8, compareAtPrice: 10, brand: 'Kinooz', unit: '150 g', description: 'بذور عباد الشمس المحمصة والمملحة', descriptionEn: 'Roasted salted sunflower seeds', stock: 160,
  imagePrompt: 'Roasted sunflower seeds bag on white background, seed snack photography.' });

addProduct({ name: 'حلاوة طحينية سادة 300 جم', nameEn: 'Plain Halva Tahini 300 g', category: snacks, price: 22, compareAtPrice: 27, brand: 'Halwani', unit: '300 g', description: 'حلاوة طحينية سادة بيضاء', descriptionEn: 'Plain white tahini halva', stock: 100,
  imagePrompt: 'Plain halva tahini 300g block on white background, traditional Egyptian sweet photography.' });

addProduct({ name: 'حلاوة طحينية بالشوكولاتة 300 جم', nameEn: 'Chocolate Halva 300 g', category: snacks, price: 25, compareAtPrice: 30, brand: 'Halwani', unit: '300 g', description: 'حلاوة طحينية بالشوكولاتة', descriptionEn: 'Chocolate flavored halva', stock: 90,
  imagePrompt: 'Chocolate halva 300g block on white background, Egyptian sweet photography.' });

addProduct({ name: 'علكة فيتا فواكه مشكلة 30 جم', nameEn: 'Vita Mixed Fruit Gum 30 g', category: snacks, price: 5, compareAtPrice: 7, brand: 'Vita', unit: '30 g', description: 'علكة بنكهات الفواكه المشكلة', descriptionEn: 'Mixed fruit flavored chewing gum', stock: 300,
  imagePrompt: 'Vita mixed fruit gum pack on white background, chewing gum photography.' });

addProduct({ name: 'علكة فيتا نعناع 30 جم', nameEn: 'Vita Mint Gum 30 g', category: snacks, price: 5, compareAtPrice: 7, brand: 'Vita', unit: '30 g', description: 'علكة بنكهة النعناع المنعشة', descriptionEn: 'Refreshing mint flavored gum', stock: 280,
  imagePrompt: 'Vita mint gum pack on white background, chewing gum photography.' });

addProduct({ name: 'كورن فلكس كوري فليكس 250 جم', nameEn: 'Corn Flakes 250 g', category: snacks, price: 28, compareAtPrice: 34, brand: 'Kelloggs', unit: '250 g', description: 'رقائق ذرة محلاة للإفطار', descriptionEn: 'Sweetened corn flakes breakfast cereal', stock: 110,
  imagePrompt: 'Corn flakes 250g box on white background, breakfast cereal photography.' });

addProduct({ name: 'بسكويت ساندوتش شوكولاتة 175 جم', nameEn: 'Chocolate Sandwich Biscuits 175 g', category: snacks, price: 15, compareAtPrice: 19, brand: 'Edita', unit: '175 g', description: 'بسكويت ساندوتش بحشوة الشوكولاتة', descriptionEn: 'Chocolate cream sandwich biscuits', stock: 170,
  imagePrompt: 'Chocolate sandwich biscuits 175g pack on white background, biscuit photography.' });

addProduct({ name: 'بفك ذرة جبنة 40 جم', nameEn: 'Cheese Puffs 40 g', category: snacks, price: 6, compareAtPrice: 8, brand: 'Chipsy', unit: '40 g', description: 'بفك ذرة بالجبنة', descriptionEn: 'Cheese flavored corn puffs', stock: 300,
  imagePrompt: 'Cheese puffs snack pack on white background, snack photography.' });

addProduct({ name: 'تورتيلا شيبس طبيعي 125 جم', nameEn: 'Natural Tortilla Chips 125 g', category: snacks, price: 18, compareAtPrice: 22, brand: 'Chipsy', unit: '125 g', description: 'رقائق تورتيلا طبيعية', descriptionEn: 'Natural tortilla chips', stock: 140,
  imagePrompt: 'Natural tortilla chips 125g pack on white background, chips photography.' });

addProduct({ name: 'شوكولاتة ميلكا بالحليب 90 جم', nameEn: 'Milka Milk Chocolate 90 g', category: snacks, price: 28, compareAtPrice: 34, brand: 'Milka', unit: '90 g', subcategory: 'chocolate', description: 'شوكولاتة ميلكا بالحليب الناعمة بنكهة الألبان السويسرية الفاخرة', descriptionEn: 'Smooth Milka milk chocolate made with fine Alpine milk for an irresistible creamy taste', stock: 150, discount: 14, rating: 4.7, reviews: 185,
  imagePrompt: 'Milka milk chocolate 90g purple wrapper bar on white background, Swiss chocolate product photography, clean studio lighting.' });

addProduct({ name: 'بسكويت شعيرية بوك 200 جم', nameEn: 'Puck Wheat Biscuits 200 g', category: snacks, price: 18, compareAtPrice: 22, brand: 'Puck', unit: '200 g', subcategory: 'biscuits', description: 'بسكويت شعيرية بوك مقرمش ولذيذ غني بالحبوب للإفطار أو الوجبات الخفيفة', descriptionEn: 'Crispy Puck wheat biscuits enriched with whole grains, perfect for breakfast or snacking', stock: 180, discount: 12, rating: 4.4, reviews: 95,
  imagePrompt: 'Puck wheat biscuits 200g pack on white background, cereal biscuit product photography, soft natural lighting.' });

addProduct({ name: 'شيبس برينجلز بابريكا 165 جم', nameEn: 'Pringles Paprika 165 g', category: snacks, price: 45, compareAtPrice: 55, brand: 'Pringles', unit: '165 g', subcategory: 'chips', description: 'رقائق بطاطس برينجلز بنكهة البابريكا الحلوة والمدخنة', descriptionEn: 'Pringles paprika flavored potato crisps with a sweet smoky seasoning', stock: 90, discount: 16, rating: 4.6, reviews: 130,
  imagePrompt: 'Pringles paprika 165g red can on white background, potato chips product photography, vibrant studio lighting.' });

addProduct({ name: 'بسكويت أولكر 120 جم', nameEn: 'Ulker Biscuits 120 g', category: snacks, price: 15, compareAtPrice: 18, brand: 'Ulker', unit: '120 g', subcategory: 'biscuits', description: 'بسكويت أولكر الناعم والحلو بالزبدة الطبيعية مثالي مع الشاي أو القهوة', descriptionEn: 'Soft Ulker butter biscuits with a delicate sweet flavor, ideal with tea or coffee', stock: 200, discount: 12, rating: 4.5, reviews: 110,
  imagePrompt: 'Ulker butter biscuits 120g pack on white background, Turkish biscuit product photography, warm studio lighting.' });

addProduct({ name: 'شوكولاتة جالكسي 90 جم', nameEn: 'Galaxy Chocolate 90 g', category: snacks, price: 25, compareAtPrice: 30, brand: 'Galaxy', unit: '90 g', subcategory: 'chocolate', description: 'شوكولاتة جالكسي بالحليب الناعمة الملساء بنكهة الكاكاو الفاخرة', descriptionEn: 'Smooth and silky Galaxy milk chocolate made with finest cocoa for a luxurious melt', stock: 170, discount: 14, rating: 4.7, reviews: 200,
  imagePrompt: 'Galaxy milk chocolate 90g bar on white background, premium chocolate product photography, soft diffused lighting.' });

addProduct({ name: 'بسكويت لوتس كراميل 230 جم', nameEn: 'Lotus Caramel Biscoff 230 g', category: snacks, price: 38, compareAtPrice: 45, brand: 'Lotus', unit: '230 g', subcategory: 'biscuits', description: 'بسكويت لوتس بالكراميل المحمص بنكهة السكر البني الفريدة والمقرمشة المميزة', descriptionEn: 'Lotus caramelized biscuits with distinctive brown sugar flavor and signature crunch', stock: 120, discount: 14, rating: 4.8, reviews: 240,
  imagePrompt: 'Lotus Biscoff caramel biscuits 230g pack on white background, speculoos biscuit product photography, warm studio lighting.' });

addProduct({ name: 'رقائق بطاطس شيبسي خل وملح 50 جم', nameEn: 'Chipsy Salt & Vinegar 50 g', category: snacks, price: 5, compareAtPrice: 7, brand: 'Chipsy', unit: '50 g', subcategory: 'chips', description: 'رقائق بطاطس شيبسي بنكهة الخل والملح الحامض والمقرمشة للوجبات الخفيفة', descriptionEn: 'Crispy Chipsy potato chips with tangy salt and vinegar flavor in a convenient snack pack', stock: 300, discount: 15, rating: 4.3, reviews: 75,
  imagePrompt: 'Chipsy salt and vinegar 50g small pack on white background, snack chip product photography, bright clean lighting.' });

addProduct({ name: 'شوكولاتة دايم 80 جم', nameEn: 'Daim Chocolate 80 g', category: snacks, price: 30, compareAtPrice: 36, brand: 'Daim', unit: '80 g', subcategory: 'chocolate', description: 'شوكولاتة دايم بالحليب مع قلب الكراميل المقرمش المغطى بالشوكولاتة السويسرية', descriptionEn: 'Daim chocolate with crunchy almond caramel center covered in smooth Swedish milk chocolate', stock: 100, discount: 14, rating: 4.6, reviews: 120,
  imagePrompt: 'Daim chocolate 80g bar on white background, almond caramel chocolate product photography, sharp studio lighting.' });

addProduct({ name: 'بسكويت أوريو فانيلا 133 جم', nameEn: 'Oreo Vanilla 133 g', category: snacks, price: 32, compareAtPrice: 38, brand: 'Oreo', unit: '133 g', subcategory: 'biscuits', description: 'بسكويت أوريو بحشوة الفانيليا اللذيذة بين قطعتين من البسكويت الداكن المقرمش', descriptionEn: 'Oreo biscuits with delicious vanilla cream filling between two dark crunchy cookie wafers', stock: 160, discount: 12, rating: 4.5, reviews: 175,
  imagePrompt: 'Oreo vanilla biscuits 133g pack on white background, sandwich biscuit product photography, crisp studio lighting.' });

addProduct({ name: 'مكسرات مشكلة محمصة 100 جم', nameEn: 'Roasted Mixed Nuts 100 g', category: snacks, price: 35, compareAtPrice: 42, brand: 'Kinooz', unit: '100 g', subcategory: 'nuts', description: 'مكسرات مشكلة محمصة ومملحة تحتوي على اللوز والجوز والكاجو والفول السوداني', descriptionEn: 'Roasted and lightly salted mixed nuts blend of almonds, cashews, peanuts and hazelnuts', stock: 130, discount: 14, rating: 4.6, reviews: 155,
  imagePrompt: 'Roasted mixed nuts 100g pack on white background, premium nut mix product photography, warm natural lighting.' });

addProduct({ name: 'كندر جافي 150 جم', nameEn: 'Gummy Candies 150 g', category: snacks, price: 12, compareAtPrice: 15, brand: 'Vita', unit: '150 g', subcategory: 'candy', description: 'حلويات جامية بنكهات الفواكه المشكلة ناعمة وممتعة للأطفال والكبار', descriptionEn: 'Soft and chewy gummy candies in mixed fruit flavors, a fun treat for all ages', stock: 220, discount: 16, rating: 4.4, reviews: 90,
  imagePrompt: 'Colorful gummy candies 150g pack on white background, candy product photography, bright vivid lighting.' });

addProduct({ name: 'شوكولاتة فيررو روشر 100 جم', nameEn: 'Ferrero Rocher 100 g', category: snacks, price: 85, compareAtPrice: 100, brand: 'Ferrero', unit: '100 g', subcategory: 'chocolate', description: 'شوكولاتة فيررو روشر الفاخرة بقلب البندق المحمص المغطى بالشوكولاتة والمكسرات المبشورة', descriptionEn: 'Luxury Ferrero Rocher hazelnut praline wrapped in milk chocolate with crispy roasted hazelnut pieces', stock: 80, discount: 12, rating: 4.9, reviews: 280,
  imagePrompt: 'Ferrero Rocher 100g gold wrapped chocolates arranged on white background, luxury chocolate product photography, elegant lighting.' });

addProduct({ name: 'بسكويت ريبلكس 375 جم', nameEn: 'Weetabix 375 g', category: snacks, price: 42, compareAtPrice: 50, brand: 'Weetabix', unit: '375 g', subcategory: 'biscuits', description: 'بسكويت ريبلكس بالقمح الكامل الصحي للإفطار الصحي والمشبع بالعديد من الفيتامينات', descriptionEn: 'Weetabix whole grain wheat biscuits for a healthy fiber-rich breakfast fortified with vitamins', stock: 90, discount: 14, rating: 4.5, reviews: 140,
  imagePrompt: 'Weetabix whole grain biscuits 375g box on white background, healthy cereal product photography, clean bright lighting.' });

addProduct({ name: 'بوب كورن بالشوكولاتة 100 جم', nameEn: 'Chocolate Popcorn 100 g', category: snacks, price: 15, compareAtPrice: 18, brand: 'Chipsy', unit: '100 g', subcategory: 'popcorn', description: 'بوب كورن مقرمش مغطى بالشوكولاتة بالحليب حلو ولذيذ كوجبة خفيفة ممتعة', descriptionEn: 'Crispy popcorn kernels coated in sweet milk chocolate for a delicious fun snack', stock: 180, discount: 14, rating: 4.3, reviews: 85,
  imagePrompt: 'Chocolate coated popcorn 100g pack on white background, sweet snack product photography, playful studio lighting.' });

addProduct({ name: 'كيكرز بسكويت بالزبدة 200 جم', nameEn: 'Kickers Butter Biscuits 200 g', category: snacks, price: 20, compareAtPrice: 24, brand: 'Bisco Misr', unit: '200 g', subcategory: 'biscuits', description: 'بسكويت كيكرز بالزبدة الطبيعية مقرمش ولذيذ مناسب مع الشاي والقهوة', descriptionEn: 'Kickers butter biscuits made with real butter, crispy and delicious with tea or coffee', stock: 170, discount: 14, rating: 4.4, reviews: 105,
  imagePrompt: 'Kickers butter biscuits 200g pack on white background, butter biscuit product photography, warm soft lighting.' });

// ==================== BEVERAGES (25) ====================
const beverages = 'beverages';

addProduct({ name: 'عصير برتقال بيتي 1 لتر', nameEn: 'Beyti Orange Juice 1 L', category: beverages, price: 22, compareAtPrice: 26, brand: 'Beyti', unit: '1 L', description: 'عصير برتقال طبيعي', descriptionEn: 'Natural orange juice', stock: 200,
  imagePrompt: 'Beyti orange juice 1L carton on white background, juice photography.' });

addProduct({ name: 'عصير جهينة برتقال 1 لتر', nameEn: 'Juhayna Orange Juice 1 L', category: beverages, price: 24, compareAtPrice: 28, brand: 'Juhayna', unit: '1 L', description: 'عصير برتقال طازج طبيعي', descriptionEn: 'Fresh natural orange juice', stock: 180,
  imagePrompt: 'Juhayna orange juice 1L carton on white background, juice photography.' });

addProduct({ name: 'عصير جهينة مانجو 1 لتر', nameEn: 'Juhayna Mango Juice 1 L', category: beverages, price: 28, compareAtPrice: 33, brand: 'Juhayna', unit: '1 L', description: 'عصير مانجو طبيعي', descriptionEn: 'Natural mango juice', stock: 150,
  imagePrompt: 'Juhayna mango juice 1L carton on white background, juice photography.' });

addProduct({ name: 'عصير بيتي تفاح 1 لتر', nameEn: 'Beyti Apple Juice 1 L', category: beverages, price: 22, compareAtPrice: 26, brand: 'Beyti', unit: '1 L', description: 'عصير تفاح طبيعي', descriptionEn: 'Natural apple juice', stock: 160,
  imagePrompt: 'Beyti apple juice 1L carton on white background, juice photography.' });

addProduct({ name: 'كوكاكولا 1 لتر', nameEn: 'Coca Cola 1 L', category: beverages, price: 22, compareAtPrice: 25, brand: 'Coca Cola', unit: '1 L', description: 'مشروب غازي منعش', descriptionEn: 'Refreshing soft drink', stock: 300,
  imagePrompt: 'Coca Cola 1L plastic bottle on white background, soft drink photography.' });

addProduct({ name: 'كوكاكولا دايت 1 لتر', nameEn: 'Diet Coke 1 L', category: beverages, price: 22, compareAtPrice: 25, brand: 'Coca Cola', unit: '1 L', description: 'كوكاكولا بدون سكر', descriptionEn: 'Sugar-free Diet Coke', stock: 200,
  imagePrompt: 'Diet Coke 1L bottle on white background, soft drink photography.' });

addProduct({ name: 'بيبسي 1.5 لتر', nameEn: 'Pepsi 1.5 L', category: beverages, price: 28, compareAtPrice: 33, brand: 'Pepsi', unit: '1.5 L', description: 'مشروب غازي بيبسي', descriptionEn: 'Pepsi cola soft drink', stock: 250,
  imagePrompt: 'Pepsi 1.5L bottle on white background, soft drink photography.' });

addProduct({ name: 'سبلايت 1 لتر', nameEn: 'Sprite 1 L', category: beverages, price: 20, compareAtPrice: 24, brand: 'Sprite', unit: '1 L', description: 'مشروب غازي بنكهة الليمون', descriptionEn: 'Lemon flavored soft drink', stock: 220,
  imagePrompt: 'Sprite 1L bottle on white background, lemon soft drink photography.' });

addProduct({ name: 'مياه حيات طبيعية 600 مل', nameEn: 'Hayat Natural Water 600 ml', category: beverages, price: 4, compareAtPrice: 5, brand: 'Hayat', unit: '600 ml', description: 'مياه شرب طبيعية', descriptionEn: 'Natural drinking water', stock: 500, discount: 20, rating: 4.5, reviews: 500,
  imagePrompt: 'Hayat natural water 600ml bottle on white background, bottled water photography.' });

addProduct({ name: 'مياه شرب أكوا 1.5 لتر', nameEn: 'Aqua Mineral Water 1.5 L', category: beverages, price: 8, compareAtPrice: 10, brand: 'Aqua', unit: '1.5 L', description: 'مياه شرب معدنية', descriptionEn: 'Mineral drinking water', stock: 400,
  imagePrompt: 'Aqua mineral water 1.5L bottle on white background, bottled water photography.' });

addProduct({ name: 'شاي ليبتون 100 كيس', nameEn: 'Lipton Tea 100 bags', category: beverages, price: 42, compareAtPrice: 50, brand: 'Lipton', unit: '100 bags', description: 'شاي ليبتون نقي', descriptionEn: 'Pure Lipton tea bags', stock: 180,
  imagePrompt: 'Lipton tea 100 bags box on white background, tea photography.' });

addProduct({ name: 'شاي كرك اللذيذ 20 كيس', nameEn: 'Delicious Karak Tea 20 bags', category: beverages, price: 25, compareAtPrice: 30, brand: 'Lipton', unit: '20 bags', description: 'شاي كرك بالحليب والتوابل', descriptionEn: 'Karak tea with milk and spices', stock: 120,
  imagePrompt: 'Karak tea 20 bags box on white background, tea photography.' });

addProduct({ name: 'نسكافيه كلاسيك 100 جم', nameEn: 'Nescafe Classic 100 g', category: beverages, price: 45, compareAtPrice: 55, brand: 'Nescafe', unit: '100 g', description: 'قهوة سريعة الذوبان', descriptionEn: 'Instant coffee classic', stock: 150,
  imagePrompt: 'Nescafe classic 100g jar on white background, coffee photography.' });

addProduct({ name: 'نسكافيه جولد 100 جم', nameEn: 'Nescafe Gold 100 g', category: beverages, price: 65, compareAtPrice: 78, brand: 'Nescafe', unit: '100 g', description: 'قهوة سريعة الذوبان فاخرة', descriptionEn: 'Premium instant coffee', stock: 100,
  imagePrompt: 'Nescafe gold 100g jar on white background, premium coffee photography.' });

addProduct({ name: 'قهوة سادة مطحونة 250 جم', nameEn: 'Ground Arabic Coffee 250 g', category: beverages, price: 35, compareAtPrice: 42, brand: 'Kinooz', unit: '250 g', description: 'قهوة عربية مطحونة سادة', descriptionEn: 'Finely ground Arabic coffee', stock: 110,
  imagePrompt: 'Ground Arabic coffee 250g pack on white background, coffee photography.' });

addProduct({ name: 'ميرندا برتقال 1 لتر', nameEn: 'Mirinda Orange 1 L', category: beverages, price: 18, compareAtPrice: 22, brand: 'Mirinda', unit: '1 L', description: 'مشروب غازي بنكهة البرتقال', descriptionEn: 'Orange flavored carbonated drink', stock: 210,
  imagePrompt: 'Mirinda orange 1L bottle on white background, soft drink photography.' });

addProduct({ name: 'سفن أب 1 لتر', nameEn: '7 Up 1 L', category: beverages, price: 18, compareAtPrice: 22, brand: '7 Up', unit: '1 L', description: 'مشروب غازي بنكهة الليمون', descriptionEn: 'Lemon lime flavored soft drink', stock: 200,
  imagePrompt: '7 Up 1L bottle on white background, lemon lime drink photography.' });

addProduct({ name: 'عصير بيتي مانجو 1 لتر', nameEn: 'Beyti Mango Juice 1 L', category: beverages, price: 28, compareAtPrice: 33, brand: 'Beyti', unit: '1 L', description: 'عصير مانجو طبيعي', descriptionEn: 'Natural mango juice', stock: 140,
  imagePrompt: 'Beyti mango juice 1L carton on white background, mango juice photography.' });

addProduct({ name: 'عصير بيتي رمان 1 لتر', nameEn: 'Beyti Pomegranate Juice 1 L', category: beverages, price: 35, compareAtPrice: 42, brand: 'Beyti', unit: '1 L', description: 'عصير رمان طبيعي', descriptionEn: 'Natural pomegranate juice', stock: 100,
  imagePrompt: 'Beyti pomegranate juice 1L carton on white background, juice photography.' });

addProduct({ name: 'شاي ليبتون أخضر 30 كيس', nameEn: 'Lipton Green Tea 30 bags', category: beverages, price: 22, compareAtPrice: 27, brand: 'Lipton', unit: '30 bags', description: 'شاي أخضر طبيعي', descriptionEn: 'Natural green tea bags', stock: 130,
  imagePrompt: 'Lipton green tea 30 bags box on white background, green tea photography.' });

addProduct({ name: 'مياه غازية سوداستريم كلوب صودا 330 مل', nameEn: 'Club Soda 330 ml', category: beverages, price: 10, compareAtPrice: 13, brand: 'Schweppes', unit: '330 ml', description: 'مياه غازية صودا', descriptionEn: 'Carbonated club soda', stock: 180,
  imagePrompt: 'Schweppes club soda 330ml can on white background, carbonated water photography.' });

addProduct({ name: 'عصير توت بري طبيعي 200 مل', nameEn: 'Natural Cranberry Juice 200 ml', category: beverages, price: 12, compareAtPrice: 15, brand: 'Beyti', unit: '200 ml', description: 'عصير توت بري طبيعي', descriptionEn: 'Natural cranberry juice', stock: 120,
  imagePrompt: 'Beyti cranberry juice 200ml box on white background, juice photography.' });

addProduct({ name: 'بودرة عصير تانج برتقال 80 جم', nameEn: 'Tang Orange Powder 80 g', category: beverages, price: 8, compareAtPrice: 10, brand: 'Tang', unit: '80 g', description: 'بودرة عصير برتقال سريع التحضير', descriptionEn: 'Instant orange juice powder', stock: 250,
  imagePrompt: 'Tang orange powder 80g jar on white background, instant drink photography.' });

addProduct({ name: 'مياه جيزة الطبيعية 1.5 لتر', nameEn: 'Giza Natural Water 1.5 L', category: beverages, price: 7, compareAtPrice: 9, brand: 'Giza', unit: '1.5 L', description: 'مياه شرب طبيعية', descriptionEn: 'Natural drinking water', stock: 350,
  imagePrompt: 'Giza natural water 1.5L bottle on white background, water photography.' });

addProduct({ name: 'عصير قصب طبيعي 330 مل', nameEn: 'Natural Sugarcane Juice 330 ml', category: beverages, price: 10, compareAtPrice: 13, brand: 'Juhayna', unit: '330 ml', description: 'عصير قصب طبيعي منعش', descriptionEn: 'Refreshing natural sugarcane juice', stock: 130,
  imagePrompt: 'Natural sugarcane juice 330ml can on white background, juice photography.' });

addProduct({ name: 'عصير جهينة فراولة 1 لتر', nameEn: 'Juhayna Strawberry Juice 1 L', category: beverages, price: 24, compareAtPrice: 28, brand: 'Juhayna', unit: '1 L', description: 'عصير جهينة فراولة طبيعي 1 لتر، طعم فراولة غني ومنعش', descriptionEn: 'Juhayna natural strawberry juice 1 L, rich and refreshing strawberry flavor', stock: 180, discount: 14, rating: 4.7, reviews: 210, imagePrompt: 'Juhayna strawberry juice 1L carton on white background, juice product photography.' });

addProduct({ name: 'فانتا برتقال 1 لتر', nameEn: 'Fanta Orange 1 L', category: beverages, price: 18, compareAtPrice: 22, brand: 'Fanta', unit: '1 L', description: 'مشروب غازي برتقال بنكهة طبيعية، منعش ومثالي للصيف', descriptionEn: 'Orange flavored carbonated drink, refreshing and perfect for summer', stock: 250, discount: 12, rating: 4.6, reviews: 320, imagePrompt: 'Fanta orange 1L plastic bottle on white background, soda photography.' });

addProduct({ name: 'روف عصير تفاح 1 لتر', nameEn: 'Raf Apple Juice 1 L', category: beverages, price: 20, compareAtPrice: 24, brand: 'Raf', unit: '1 L', description: 'عصير تفاح طبيعي من روف، طعم تفاح حلو وطازج', descriptionEn: 'Raf natural apple juice, sweet and fresh apple taste', stock: 200, discount: 15, rating: 4.5, reviews: 150, imagePrompt: 'Raf apple juice 1L carton on white background, fruit juice photography.' });

addProduct({ name: 'شاي ليبتون أخضر بالنعناع 20 كيس', nameEn: 'Lipton Green Tea Mint 20 bags', category: beverages, price: 25, compareAtPrice: 30, brand: 'Lipton', unit: '20 bags', description: 'شاي أخضر ليبتون بنكهة النعناع الطازج، 20 كيس منعش', descriptionEn: 'Lipton green tea with fresh mint flavor, 20 refreshing bags', stock: 300, discount: 12, rating: 4.8, reviews: 280, imagePrompt: 'Lipton green tea mint 20 bags box on white background, tea packaging photography.' });

addProduct({ name: 'قهوة عربية محضرة 200 جم', nameEn: 'Prepared Arabic Coffee 200 g', category: beverages, price: 40, compareAtPrice: 48, brand: 'Al Aan', unit: '200 g', description: 'قهوة عربية محضرة جاهزة للتحضير بنكهة الهيل الأصيلة', descriptionEn: 'Prepared Arabic coffee ready to brew with authentic cardamom flavor', stock: 120, discount: 15, rating: 4.9, reviews: 190, imagePrompt: 'Al Aan prepared Arabic coffee 200g package on white background, coffee product photography.' });

addProduct({ name: 'مياه جازل 1.5 لتر', nameEn: 'Dasani Water 1.5 L', category: beverages, price: 8, compareAtPrice: 10, brand: 'Dasani', unit: '1.5 L', description: 'مياه شرب نظيفة ونقية من داساني، 1.5 لتر', descriptionEn: 'Clean pure drinking water from Dasani, 1.5 L', stock: 500, discount: 10, rating: 4.4, reviews: 350, imagePrompt: 'Dasani water 1.5L bottle on white background, water bottle photography.' });

addProduct({ name: 'عصير سفن أب ليمون 1 لتر', nameEn: '7 Up Lemon Juice 1 L', category: beverages, price: 18, compareAtPrice: 22, brand: '7 Up', unit: '1 L', description: 'مشروب غازي بنكهة الليمون المنعش من سفن أب', descriptionEn: 'Refreshing lemon flavored carbonated drink from 7 Up', stock: 220, discount: 13, rating: 4.5, reviews: 260, imagePrompt: '7 Up lemon 1L bottle on white background, soda product photography.' });

addProduct({ name: 'بيبسي دايت 1 لتر', nameEn: 'Diet Pepsi 1 L', category: beverages, price: 22, compareAtPrice: 25, brand: 'Pepsi', unit: '1 L', description: 'بيبسي دايت بدون سكر، مشروب غازي خفيف ومنعش', descriptionEn: 'Diet Pepsi sugar-free, light and refreshing carbonated drink', stock: 190, discount: 11, rating: 4.6, reviews: 240, imagePrompt: 'Diet Pepsi 1L bottle on white background, diet soda photography.' });

addProduct({ name: 'عصير ربيع مانجو 200 مل 6 قطعة', nameEn: 'Rabea Mango Juice 200 ml 6 pcs', category: beverages, price: 18, compareAtPrice: 22, brand: 'Rabea', unit: '6 x 200 ml', description: 'عبوات عصير ربيع مانجو 200 مل، عبوة 6 قطع مثالية للعائلات', descriptionEn: 'Rabea mango juice 200 ml packs, 6-pack perfect for families', stock: 280, discount: 14, rating: 4.4, reviews: 170, imagePrompt: 'Rabea mango juice 200ml 6-pack carton on white background, juice packaging photography.' });

addProduct({ name: 'شاي أحمر كرك 100 كيس', nameEn: 'Red Karak Tea 100 bags', category: beverages, price: 35, compareAtPrice: 42, brand: 'Lipton', unit: '100 bags', description: 'شاي أحمر كرك ليبتون 100 كيس، مثالي لتحضير الشاي التقليدي', descriptionEn: 'Red Karak tea Lipton 100 bags, ideal for traditional tea preparation', stock: 160, discount: 16, rating: 4.7, reviews: 310, imagePrompt: 'Red Karak tea 100 bags box on white background, tea box photography.' });

addProduct({ name: 'نسكافيه تورينو 100 جم', nameEn: 'Torino Instant Coffee 100 g', category: beverages, price: 30, compareAtPrice: 36, brand: 'Torino', unit: '100 g', description: 'قهوة سريعة التحضير تورينو، نكهة قوية وعميقة', descriptionEn: 'Torino instant coffee, strong and deep flavor', stock: 200, discount: 13, rating: 4.5, reviews: 220, imagePrompt: 'Torino instant coffee 100g jar on white background, coffee jar photography.' });

addProduct({ name: 'عصير جهينة موز بالفراولة 1 لتر', nameEn: 'Juhayna Banana Strawberry Juice 1 L', category: beverages, price: 26, compareAtPrice: 30, brand: 'Juhayna', unit: '1 L', description: 'عصير جهينة مix موز وفراولة، مزيج فواكه طازج ولذيذ', descriptionEn: 'Juhayna banana strawberry mix juice, fresh and delicious fruit blend', stock: 170, discount: 12, rating: 4.6, reviews: 180, imagePrompt: 'Juhayna banana strawberry juice 1L carton on white background, fruit juice photography.' });

addProduct({ name: 'مشروب شوكولاتة بوك 200 مل 6 قطعة', nameEn: 'Puck Chocolate Drink 200 ml 6 pcs', category: beverages, price: 22, compareAtPrice: 27, brand: 'Puck', unit: '6 x 200 ml', description: 'مشروب شوكولاتة بوك كريمي 200 مل، عبوة 6 قطع مثالية للأطفال', descriptionEn: 'Puck creamy chocolate drink 200 ml, 6-pack perfect for kids', stock: 240, discount: 14, rating: 4.7, reviews: 270, imagePrompt: 'Puck chocolate drink 200ml 6-pack on white background, chocolate milk photography.' });

addProduct({ name: 'عصير طبيعي مانجو وجوافة 1 لتر', nameEn: 'Natural Mango Guava Juice 1 L', category: beverages, price: 30, compareAtPrice: 36, brand: 'Beyti', unit: '1 L', description: 'عصير طبيعي مزيج مانجو وجوافة من بينتي، طعم فواكه استوائية غني', descriptionEn: 'Beyti natural mango and guava juice, rich tropical fruit flavor', stock: 150, discount: 15, rating: 4.8, reviews: 190, imagePrompt: 'Beyti mango guava juice 1L carton on white background, tropical juice photography.' });

addProduct({ name: 'مياه غازية سبرينت 330 مل 6 علب', nameEn: 'Sprint Sparkling Water 330 ml 6 cans', category: beverages, price: 25, compareAtPrice: 30, brand: 'Sprint', unit: '6 x 330 ml', description: 'مياه غازية سبرينت 330 مل، عبوة 6 علب منعشة ومثالية لل.picnics', descriptionEn: 'Sprint sparkling water 330 ml, 6-pack refreshing and perfect for picnics', stock: 210, discount: 13, rating: 4.5, reviews: 140, imagePrompt: 'Sprint sparkling water 330ml 6 cans pack on white background, sparkling water photography.' });

// ==================== CLEANING (18) ====================
const cleaning = 'cleaning';

addProduct({ name: 'مسحوق غسيل أريال اوتوماتيك 4 كيلو', nameEn: 'Ariel Automatic Powder 4 kg', category: cleaning, price: 120, compareAtPrice: 145, brand: 'Ariel', unit: '4 kg', description: 'مسحوق غسيل أوتوماتيك فعال', descriptionEn: 'Effective automatic washing powder', stock: 100,
  imagePrompt: 'Ariel automatic powder 4kg box on white background, laundry detergent photography.' });

addProduct({ name: 'مسحوق غسيل أريال اوتوماتيك 2.5 كيلو', nameEn: 'Ariel Automatic Powder 2.5 kg', category: cleaning, price: 85, compareAtPrice: 100, brand: 'Ariel', unit: '2.5 kg', description: 'مسحوق غسيل للملابس', descriptionEn: 'Laundry washing powder', stock: 130,
  imagePrompt: 'Ariel automatic powder 2.5kg box on white background, laundry detergent photography.' });

addProduct({ name: 'جيل غسيل تايد باور جل 2 لتر', nameEn: 'Tide Power Gel 2 L', category: cleaning, price: 75, compareAtPrice: 90, brand: 'Tide', unit: '2 L', description: 'جيل غسيل مركز', descriptionEn: 'Concentrated laundry gel', stock: 110,
  imagePrompt: 'Tide power gel 2L bottle on white background, laundry detergent photography.' });

addProduct({ name: 'سائل تنظيف Fairy Lemon 1 لتر', nameEn: 'Fairy Lemon Dish Liquid 1 L', category: cleaning, price: 65, compareAtPrice: 78, brand: 'Fairy', unit: '1 L', description: 'سائل غسيل أطباق برائحة الليمون', descriptionEn: 'Lemon scented dish washing liquid', stock: 160,
  imagePrompt: 'Fairy lemon dish liquid 1L bottle on white background, dish soap photography.' });

addProduct({ name: 'سائل تنظيف Fairy Original 900 مل', nameEn: 'Fairy Original Dish Liquid 900 ml', category: cleaning, price: 58, compareAtPrice: 68, brand: 'Fairy', unit: '900 ml', description: 'سائل غسيل أطباق فعال', descriptionEn: 'Original dish washing liquid', stock: 170,
  imagePrompt: 'Fairy original dish liquid 900ml bottle on white background, dish soap photography.' });

addProduct({ name: 'سائل تنظيف بالكلور كلوركس 1 لتر', nameEn: 'Clorox Bleach 1 L', category: cleaning, price: 22, compareAtPrice: 27, brand: 'Clorox', unit: '1 L', description: 'مبيض بالكلور للتعقيم والتنظيف', descriptionEn: 'Chlorine bleach for cleaning and disinfecting', stock: 140,
  imagePrompt: 'Clorox bleach 1L bottle on white background, cleaning product photography.' });

addProduct({ name: 'فلاش سائل تنظيف أرضيات 1.5 لتر', nameEn: 'Flash Floor Cleaner 1.5 L', category: cleaning, price: 30, compareAtPrice: 36, brand: 'Flash', unit: '1.5 L', description: 'سائل تنظيف للأرضيات', descriptionEn: 'Floor cleaning liquid', stock: 120,
  imagePrompt: 'Flash floor cleaner 1.5L bottle on white background, cleaning product photography.' });

addProduct({ name: 'ملمع زجاج ويندو ليمون 500 مل', nameEn: 'Window Lemon Glass Cleaner 500 ml', category: cleaning, price: 18, compareAtPrice: 22, brand: 'Window', unit: '500 ml', description: 'ملمع زجاج والنوافذ', descriptionEn: 'Glass and window cleaner', stock: 100,
  imagePrompt: 'Window glass cleaner 500ml spray bottle on white background, cleaning photography.' });

addProduct({ name: 'سائل جلي صحون بريل 1 لتر', nameEn: 'Prill Dish Liquid 1 L', category: cleaning, price: 42, compareAtPrice: 50, brand: 'Prill', unit: '1 L', description: 'سائل جلي صحون مركز', descriptionEn: 'Concentrated dish liquid', stock: 140,
  imagePrompt: 'Prill dish liquid 1L bottle on white background, dish soap photography.' });

addProduct({ name: 'معطر جو اير ويك 300 مل', nameEn: 'Air Wick Air Freshener 300 ml', category: cleaning, price: 35, compareAtPrice: 42, brand: 'Air Wick', unit: '300 ml', description: 'معطر جو برائحة الفانيليا', descriptionEn: 'Vanilla scented air freshener', stock: 90,
  imagePrompt: 'Air Wick air freshener 300ml spray on white background, air freshener photography.' });

addProduct({ name: 'مناديل ورقية سكوت 3 طبقات 6 لفات', nameEn: 'Scott Toilet Paper 3-ply 6 rolls', category: cleaning, price: 32, compareAtPrice: 38, brand: 'Scott', unit: '6 rolls', description: 'مناديل تواليت فاخرة 3 طبقات', descriptionEn: 'Premium 3-ply toilet paper', stock: 200,
  imagePrompt: 'Scott toilet paper 6 rolls pack on white background, paper product photography.' });

addProduct({ name: 'مناديل وجه تريو 200 منديل', nameEn: 'Trio Facial Tissues 200 pcs', category: cleaning, price: 15, compareAtPrice: 18, brand: 'Trio', unit: '200 pcs', description: 'مناديل وجه ناعمة', descriptionEn: 'Soft facial tissues', stock: 250,
  imagePrompt: 'Trio facial tissues 200 pcs box on white background, tissue photography.' });

addProduct({ name: 'مناشف مطبخ سكوت 2 لفة', nameEn: 'Scott Kitchen Towels 2 rolls', category: cleaning, price: 28, compareAtPrice: 34, brand: 'Scott', unit: '2 rolls', description: 'مناشف مطبخ ورقية فاخرة', descriptionEn: 'Premium paper kitchen towels', stock: 140,
  imagePrompt: 'Scott kitchen towels 2 rolls pack on white background, kitchen paper photography.' });

addProduct({ name: 'سلك مواعين ناعم 4 حبات', nameEn: 'Soft Scourer Pads 4 pcs', category: cleaning, price: 12, compareAtPrice: 15, brand: 'Prill', unit: '4 pcs', description: 'سلك مواعين ناعم لجلي الأطباق', descriptionEn: 'Soft scourer pads for dish washing', stock: 180,
  imagePrompt: 'Scourer pads 4 pack on white background, kitchen cleaning photography.' });

addProduct({ name: 'إسفنجة جلي 3 قطعة', nameEn: 'Sponge Scourer 3 pcs', category: cleaning, price: 8, compareAtPrice: 10, brand: 'Prill', unit: '3 pcs', description: 'إسفنجة جلي الأطباق', descriptionEn: 'Kitchen sponge scourer', stock: 200,
  imagePrompt: 'Kitchen sponge scourer 3 pack on white background, cleaning tool photography.' });

addProduct({ name: 'فوط ميكروفايبر تنظيف 3 قطعة', nameEn: 'Microfiber Cleaning Cloth 3 pcs', category: cleaning, price: 18, compareAtPrice: 22, brand: 'Cinderella', unit: '3 pcs', description: 'فوط ميكروفايبر للتنظيف', descriptionEn: 'Microfiber cleaning cloths', stock: 120,
  imagePrompt: 'Microfiber cleaning cloths 3 pack on white background, cleaning product photography.' });

addProduct({ name: 'كيس قمامة كبير 50 لتر 15 كيس', nameEn: 'Large Trash Bags 50 L 15 bags', category: cleaning, price: 15, compareAtPrice: 18, brand: 'Cinderella', unit: '15 bags', description: 'أكياس قمامة متينة', descriptionEn: 'Durable large trash bags', stock: 220,
  imagePrompt: 'Large trash bags roll on white background, household product photography.' });

addProduct({ name: 'معطر ملابس كومفورت 1.5 لتر', nameEn: 'Comfort Fabric Conditioner 1.5 L', category: cleaning, price: 60, compareAtPrice: 72, brand: 'Comfort', unit: '1.5 L', description: 'معطر ومنعم للملابس', descriptionEn: 'Fabric softener and conditioner', stock: 110,
  imagePrompt: 'Comfort fabric conditioner 1.5L bottle on white background, laundry product photography.' });

addProduct({ name: 'مسحوق غسيل تايد اوتوماتيك 3 كيلو', nameEn: 'Tide Automatic Powder 3 kg', category: cleaning, price: 95, compareAtPrice: 115, brand: 'Tide', unit: '3 kg', description: 'مسحوق غسيل أوتوماتيك تايد للملابس الأبيض والملونة', descriptionEn: 'Tide automatic washing powder for white and colored clothes', stock: 110, discount: 17, rating: 4.7, reviews: 180,
  imagePrompt: 'Tide automatic powder 3kg box on white background, laundry detergent product photography.' });

addProduct({ name: 'منظف متعدد الاستخدامات كوف 500 مل', nameEn: 'Cif Multi-Purpose Cleaner 500 ml', category: cleaning, price: 22, compareAtPrice: 27, brand: 'Cif', unit: '500 ml', description: 'منظف متعدد الاستخدامات كوف لإزالة البقع والأوساخ', descriptionEn: 'Cif multi-purpose cleaner for removing stains and dirt', stock: 150, discount: 15, rating: 4.5, reviews: 90,
  imagePrompt: 'Cif multi-purpose cleaner 500ml bottle on white background, cleaning product photography.' });

addProduct({ name: 'معطر جو جل أوريفريش 150 جم', nameEn: 'Air Freshener Gel 150 g', category: cleaning, price: 18, compareAtPrice: 22, brand: 'Air Wick', unit: '150 g', description: 'معطر جو على شكل جل لترطيب الجو برائحة منعشة', descriptionEn: 'Gel air freshener for refreshing long-lasting fragrance', stock: 120, discount: 12, rating: 4.3, reviews: 75,
  imagePrompt: 'Air Wick air freshener gel 150g container on white background, air freshener product photography.' });

addProduct({ name: 'مناديل مبللة لليدين 50 منديل', nameEn: 'Scott Wet Hand Wipes 50 pcs', category: cleaning, price: 12, compareAtPrice: 15, brand: 'Scott', unit: '50 pcs', description: 'مناديل مبللة نظيفة لليدين للاستخدام اليومي المنزلي', descriptionEn: 'Scott wet hand wipes for everyday home use', stock: 180, discount: 10, rating: 4.4, reviews: 65,
  imagePrompt: 'Scott wet hand wipes 50 pcs pack on white background, wet wipes product photography.' });

addProduct({ name: 'منظف حمام كوف 750 مل', nameEn: 'Cif Bathroom Cleaner 750 ml', category: cleaning, price: 28, compareAtPrice: 34, brand: 'Cif', unit: '750 ml', description: 'منظف مخصص للحمام لإزالة الصدأ والأوساخ العنيدة', descriptionEn: 'Cif bathroom cleaner to remove limescale and tough dirt', stock: 130, discount: 14, rating: 4.5, reviews: 85,
  imagePrompt: 'Cif bathroom cleaner 750ml spray bottle on white background, cleaning product photography.' });

addProduct({ name: 'ممسحة أرضيات دوف 1 لتر', nameEn: 'Mop Floor Cleaner 1 L', category: cleaning, price: 25, compareAtPrice: 30, brand: 'Dettol', unit: '1 L', description: 'سائل تنظيف الأرضيات برائحة منعشة يقضي على الجراثيم', descriptionEn: 'Floor cleaner with refreshing scent that kills germs', stock: 140, discount: 13, rating: 4.6, reviews: 100,
  imagePrompt: 'Dettol mop floor cleaner 1L bottle on white background, cleaning product photography.' });

addProduct({ name: 'سائل جلي بريل برتقال 1 لتر', nameEn: 'Prill Orange Dish Liquid 1 L', category: cleaning, price: 42, compareAtPrice: 50, brand: 'Prill', unit: '1 L', description: 'سائل جلي صحون بريل ب香味 البرتقال لتنظيف فعال', descriptionEn: 'Prill orange scented dish liquid for effective grease removal', stock: 120, discount: 16, rating: 4.6, reviews: 110,
  imagePrompt: 'Prill orange dish liquid 1L bottle on white background, dish soap product photography.' });

addProduct({ name: 'منظف ميكروفايبر 5 قطعة', nameEn: 'Microfiber Cleaning Set 5 pcs', category: cleaning, price: 25, compareAtPrice: 30, brand: 'Cinderella', unit: '5 pcs', description: 'طقم مناشف ميكروفايبر متعددة الاستخدامات للتنظيف', descriptionEn: 'Set of 5 multi-purpose microfiber cleaning cloths', stock: 100, discount: 12, rating: 4.4, reviews: 70,
  imagePrompt: 'Microfiber cleaning cloths 5 piece set on white background, cleaning product photography.' });

addProduct({ name: 'معطر ملابس أريال 1 لتر', nameEn: 'Ariel Fabric Refresher 1 L', category: cleaning, price: 35, compareAtPrice: 42, brand: 'Ariel', unit: '1 L', description: 'معطر ملابس أريال لرائحة منعشة تدوم طويلاً', descriptionEn: 'Ariel fabric refresher for long-lasting fresh scent on clothes', stock: 90, discount: 15, rating: 4.7, reviews: 130,
  imagePrompt: 'Ariel fabric refresher 1L bottle on white background, laundry product photography.' });

addProduct({ name: 'كيس قمامة 30 لتر 20 كيس', nameEn: 'Medium Trash Bags 30 L 20 bags', category: cleaning, price: 18, compareAtPrice: 22, brand: 'Cinderella', unit: '20 bags', description: 'أكياس قمامة متوسطة الحجم متينة ومغلقة بإحكام', descriptionEn: 'Medium 30L trash bags, durable and leak-proof', stock: 200, discount: 12, rating: 4.3, reviews: 55,
  imagePrompt: 'Medium trash bags 30L 20 pack roll on white background, household product photography.' });

addProduct({ name: 'ورق ألمنيوم 30 متر', nameEn: 'Aluminum Foil 30 m', category: cleaning, price: 18, compareAtPrice: 22, brand: 'Cinderella', unit: '30 m', description: 'ورق ألمنيوم متين للطهي والتغليف والحفظ', descriptionEn: 'Durable aluminum foil for cooking, wrapping and food storage', stock: 160, discount: 11, rating: 4.5, reviews: 95,
  imagePrompt: 'Aluminum foil roll 30m on white background, kitchen wrap product photography.' });

addProduct({ name: 'غلاف بلاستيكي 30 متر', nameEn: 'Cling Film 30 m', category: cleaning, price: 15, compareAtPrice: 18, brand: 'Cinderella', unit: '30 m', description: 'غلاف بلاستيكي شفاف لتغليف الأطعمة والحفظ في الثلاجة', descriptionEn: 'Transparent cling film for food wrapping and refrigerator storage', stock: 150, discount: 11, rating: 4.4, reviews: 80,
  imagePrompt: 'Cling film wrap 30m roll on white background, kitchen food wrap photography.' });

addProduct({ name: 'منظف شفط تنظيف 500 مل', nameEn: 'Vacuum Cleaner Solution 500 ml', category: cleaning, price: 22, compareAtPrice: 27, brand: 'Flash', unit: '500 ml', description: 'سائل تنظيف متخصص لأجهزة الشفط لإزالة الأوساخ والروائح', descriptionEn: 'Specialized cleaning solution for vacuum cleaners to remove dirt and odors', stock: 80, discount: 14, rating: 4.3, reviews: 45,
  imagePrompt: 'Flash vacuum cleaner solution 500ml bottle on white background, cleaning product photography.' });

addProduct({ name: 'فرشاة تنظيف متعددة', nameEn: 'Multi-Purpose Cleaning Brush', category: cleaning, price: 15, compareAtPrice: 18, brand: 'Cinderella', unit: '1 piece', description: 'فرشاة تنظيف متعددة الاستخدامات للحمام والمطبخ', descriptionEn: 'Multi-purpose cleaning brush for bathroom and kitchen', stock: 130, discount: 12, rating: 4.4, reviews: 60,
  imagePrompt: 'Multi-purpose cleaning brush on white background, cleaning tool product photography.' });

addProduct({ name: 'مناديل مبللة للأطفال 80 منديل', nameEn: 'Baby Wet Wipes 80 pcs', category: cleaning, price: 12, compareAtPrice: 15, brand: 'Scott', unit: '80 pcs', description: 'مناديل مبللة ناعمة آمنة لبشرة الأطفال الحساسة', descriptionEn: 'Scott soft wet wipes safe for baby delicate skin', stock: 200, discount: 13, rating: 4.5, reviews: 140,
  imagePrompt: 'Scott baby wet wipes 80 pcs pack on white background, baby wipes product photography.' });

// ==================== PERSONAL CARE (18) ====================
const personalCare = 'personal-care';

addProduct({ name: 'شامبو سنسيلك ناعم ولامع 350 مل', nameEn: 'Sunsilk Smooth & Shine 350 ml', category: personalCare, price: 45, compareAtPrice: 55, brand: 'Sunsilk', unit: '350 ml', description: 'شامبو لتنعيم وإشراق الشعر', descriptionEn: 'Hair smoothing and shining shampoo', stock: 150,
  imagePrompt: 'Sunsilk smooth and shine 350ml bottle on white background, hair care photography.' });

addProduct({ name: 'شامبو بانتين كلاسيك 600 مل', nameEn: 'Pantene Classic Clean 600 ml', category: personalCare, price: 65, compareAtPrice: 78, brand: 'Pantene', unit: '600 ml', description: 'شامبو بنتين لتنظيف الشعر', descriptionEn: 'Pantene classic clean shampoo', stock: 120,
  imagePrompt: 'Pantene classic shampoo 600ml bottle on white background, hair care photography.' });

addProduct({ name: 'بلسم بانتين كلاسيك 600 مل', nameEn: 'Pantene Classic Conditioner 600 ml', category: personalCare, price: 65, compareAtPrice: 78, brand: 'Pantene', unit: '600 ml', description: 'بلسم لترطيب الشعر', descriptionEn: 'Hair conditioner', stock: 100,
  imagePrompt: 'Pantene classic conditioner 600ml bottle on white background, hair care photography.' });

addProduct({ name: 'صابون دوف كريم بيوتي 135 جم', nameEn: 'Dove Beauty Cream Bar 135 g', category: personalCare, price: 22, compareAtPrice: 27, brand: 'Dove', unit: '135 g', description: 'صابون دوف المرطب', descriptionEn: 'Dove moisturizing beauty soap', stock: 200,
  imagePrompt: 'Dove beauty cream bar 135g on white background, soap photography.' });

addProduct({ name: 'صابون دوف أبيض 135 جم', nameEn: 'Dove White Beauty Bar 135 g', category: personalCare, price: 22, compareAtPrice: 27, brand: 'Dove', unit: '135 g', description: 'صابون دوف الأبيض', descriptionEn: 'Dove white beauty soap', stock: 190,
  imagePrompt: 'Dove white beauty bar 135g on white background, soap photography.' });

addProduct({ name: 'صابون لوكس زهري 130 جم', nameEn: 'Lux Pink Soap 130 g', category: personalCare, price: 15, compareAtPrice: 18, brand: 'Lux', unit: '130 g', description: 'صابون لوكس برائحة الورد', descriptionEn: 'Lux pink rose scented soap', stock: 180,
  imagePrompt: 'Lux pink soap 130g on white background, soap photography.' });

addProduct({ name: 'معجون أسنان سيجنال وايتهنينج 125 مل', nameEn: 'Signal Whitening Toothpaste 125 ml', category: personalCare, price: 28, compareAtPrice: 34, brand: 'Signal', unit: '125 ml', description: 'معجون أسنان لتبييض الأسنان', descriptionEn: 'Teeth whitening toothpaste', stock: 170,
  imagePrompt: 'Signal whitening toothpaste 125ml tube on white background, oral care photography.' });

addProduct({ name: 'معجون أسنان كولجيت كلاسيك 100 مل', nameEn: 'Colgate Classic Toothpaste 100 ml', category: personalCare, price: 18, compareAtPrice: 22, brand: 'Colgate', unit: '100 ml', description: 'معجون أسنان كلاسيك', descriptionEn: 'Classic toothpaste', stock: 200,
  imagePrompt: 'Colgate classic toothpaste 100ml tube on white background, oral care photography.' });

addProduct({ name: 'فرشاة أسنان كولجيت ناعمة', nameEn: 'Colgate Soft Toothbrush', category: personalCare, price: 15, compareAtPrice: 18, brand: 'Colgate', unit: '1 piece', description: 'فرشاة أسنان ناعمة', descriptionEn: 'Soft toothbrush', stock: 160,
  imagePrompt: 'Colgate soft toothbrush on white background, oral care photography.' });

addProduct({ name: 'مزيل عرق نيفيا رول أون 50 مل', nameEn: 'Nivea Roll On Deodorant 50 ml', category: personalCare, price: 35, compareAtPrice: 42, brand: 'Nivea', unit: '50 ml', description: 'مزيل عرق رول أون', descriptionEn: 'Roll on deodorant', stock: 130,
  imagePrompt: 'Nivea roll on deodorant 50ml bottle on white background, deodorant photography.' });

addProduct({ name: 'مزيل عرق كريم افون 50 مل', nameEn: 'Avon Deodorant Cream 50 ml', category: personalCare, price: 22, compareAtPrice: 27, brand: 'Avon', unit: '50 ml', description: 'كريم مزيل عرق', descriptionEn: 'Deodorant cream', stock: 100,
  imagePrompt: 'Avon deodorant cream 50ml tube on white background, deodorant photography.' });

addProduct({ name: 'شفرة حلاقة جيليت بلو 3 3 قطعة', nameEn: 'Gillette Blue 3 Razor 3 pcs', category: personalCare, price: 38, compareAtPrice: 45, brand: 'Gillette', unit: '3 pcs', description: 'شفرات حلاقة جيليت', descriptionEn: 'Gillette Blue 3 disposable razors', stock: 120,
  imagePrompt: 'Gillette Blue 3 razor pack on white background, shaving product photography.' });

addProduct({ name: 'كريم بانثينول للبشرة 30 مل', nameEn: 'Panthenol Skin Cream 30 ml', category: personalCare, price: 25, compareAtPrice: 30, brand: 'Panthenol', unit: '30 ml', description: 'كريم بانثينول لترطيب البشرة', descriptionEn: 'Panthenol moisturizing skin cream', stock: 90,
  imagePrompt: 'Panthenol skin cream 30ml tube on white background, skincare photography.' });

addProduct({ name: 'زيت شعر جوز الهند 250 مل', nameEn: 'Coconut Hair Oil 250 ml', category: personalCare, price: 20, compareAtPrice: 24, brand: 'Alwaleed', unit: '250 ml', description: 'زيت جوز الهند لتغذية الشعر', descriptionEn: 'Coconut oil for hair nourishment', stock: 110,
  imagePrompt: 'Coconut hair oil 250ml bottle on white background, hair care photography.' });

addProduct({ name: 'كريم نيفيا المرطب للوجه 50 مل', nameEn: 'Nivea Face Moisturizer 50 ml', category: personalCare, price: 45, compareAtPrice: 55, brand: 'Nivea', unit: '50 ml', description: 'كريم ترطيب للوجه', descriptionEn: 'Nivea face moisturizing cream', stock: 90,
  imagePrompt: 'Nivea face moisturizer 50ml jar on white background, skincare photography.' });

addProduct({ name: 'سائل غسيل اليدين فيم 500 مل', nameEn: 'Fem Hand Wash 500 ml', category: personalCare, price: 28, compareAtPrice: 34, brand: 'Fem', unit: '500 ml', description: 'سائل لغسيل اليدين', descriptionEn: 'Liquid hand wash', stock: 150,
  imagePrompt: 'Fem hand wash 500ml bottle on white background, hand soap photography.' });

addProduct({ name: 'مناديل مبللة بالبابونج 30 حبة', nameEn: 'Chamomile Wet Wipes 30 pcs', category: personalCare, price: 10, compareAtPrice: 13, brand: 'Fem', unit: '30 pcs', description: 'مناديل مبللة بالبابونج للوجه', descriptionEn: 'Chamomile facial wet wipes', stock: 200,
  imagePrompt: 'Chamomile wet wipes pack on white background, personal care photography.' });

addProduct({ name: 'كريم إزالة الشعر 200 مل', nameEn: 'Hair Removal Cream 200 ml', category: personalCare, price: 30, compareAtPrice: 36, brand: 'Fem', unit: '200 ml', description: 'كريم إزالة الشعر للبشرة الحساسة', descriptionEn: 'Hair removal cream for sensitive skin', stock: 80,
  imagePrompt: 'Hair removal cream 200ml tube on white background, personal care photography.' });

addProduct({ name: 'شامبو هيد اند آند شولدرز 400 مل', nameEn: 'Head & Shoulders Shampoo 400 ml', category: personalCare, price: 55, compareAtPrice: 65, brand: 'Head Shoulders', unit: '400 ml', description: 'شامبو مكافحة القشر بتركيبة نشطة تعمل على إزالة القشر وحماية فروة الرأس من الحكة', descriptionEn: 'Anti-dandruff shampoo with active formula that removes flakes and protects scalp from itch', stock: 140, discount: 15, rating: 4.6, reviews: 175,
  imagePrompt: 'Head & Shoulders anti-dandruff shampoo 400ml bottle on white background, hair care product photography.' });

addProduct({ name: 'معجون أسنان كولجيت توتال 125 مل', nameEn: 'Colgate Total Toothpaste 125 ml', category: personalCare, price: 35, compareAtPrice: 42, brand: 'Colgate', unit: '125 ml', description: 'معجون أسنان كولجيت توتال للحماية الشاملة من التسوس والتهاب اللثة والبلاك لمدة 12 ساعة', descriptionEn: 'Colgate Total toothpaste with 12-hour protection against cavities, gum problems and plaque', stock: 200, discount: 16, rating: 4.7, reviews: 200,
  imagePrompt: 'Colgate Total toothpaste 125ml tube on white background, oral care product photography.' });

addProduct({ name: 'غسول فم ليستيرين 500 مل', nameEn: 'Listerine Mouthwash 500 ml', category: personalCare, price: 45, compareAtPrice: 55, brand: 'Listerine', unit: '500 ml', description: 'غسول فم ليستيرين المضاد للبكتيريا لتنظيف الأماكن التي لا يصلها فرشاة الأسنان', descriptionEn: 'Listerine antibacterial mouthwash to clean areas toothbrushes miss and kill germs', stock: 110, discount: 18, rating: 4.5, reviews: 130,
  imagePrompt: 'Listerine mouthwash 500ml bottle on white background, oral care product photography.' });

addProduct({ name: 'كريم شفرة جيليت 200 مل', nameEn: 'Gillette Shave Cream 200 ml', category: personalCare, price: 30, compareAtPrice: 36, brand: 'Gillette', unit: '200 ml', description: 'كريم حلاقة جيليت بنكهة منعشة لحماية البشرة أثناء الحلاقة وتوفير انسيابية ناعمة', descriptionEn: 'Gillette shave cream with refreshing scent that protects skin during shaving for a smooth glide', stock: 90, discount: 15, rating: 4.4, reviews: 95,
  imagePrompt: 'Gillette shave cream 200ml tube on white background, men grooming product photography.' });

addProduct({ name: 'شامبو بانتين برو في 400 مل', nameEn: 'Pantene Pro-V Shampoo 400 ml', category: personalCare, price: 55, compareAtPrice: 65, brand: 'Pantene', unit: '400 ml', description: 'شامبو بانتين برو في مع برو فيتامين لتغذية الشعر وتقويته وحمايته من التلف', descriptionEn: 'Pantene Pro-V shampoo with pro-vitamin formula to nourish, strengthen and protect hair from damage', stock: 130, discount: 14, rating: 4.7, reviews: 185,
  imagePrompt: 'Pantene Pro-V shampoo 400ml bottle on white background, hair care product photography.' });

addProduct({ name: 'لوشن نيفيا للجسم 400 مل', nameEn: 'Nivea Body Lotion 400 ml', category: personalCare, price: 55, compareAtPrice: 65, brand: 'Nivea', unit: '400 ml', description: 'لوشن نيفيا للجسم برطوبة عميقة لترطيب البشرة 48 ساعة مع مزيج من الزيوت الطبيعية', descriptionEn: 'Nivea body lotion with deep moisture that hydrates skin for 48 hours with natural oil blend', stock: 120, discount: 15, rating: 4.8, reviews: 190,
  imagePrompt: 'Nivea body lotion 400ml bottle on white background, body care product photography.' });

addProduct({ name: 'صابون ديتول مضاد للبكتيريا 110 جم', nameEn: 'Dettol Antibacterial Soap 110 g', category: personalCare, price: 15, compareAtPrice: 18, brand: 'Dettol', unit: '110 g', description: 'صابون ديتول المضاد للبكتيريا لحماية العائلة من 99.9% من الجراثيم مع رائحة منعشة', descriptionEn: 'Dettol antibacterial soap that protects family from 99.9% of germs with a fresh scent', stock: 200, discount: 16, rating: 4.6, reviews: 165,
  imagePrompt: 'Dettol antibacterial soap 110g bar on white background, antibacterial soap photography.' });

addProduct({ name: 'شامبو ريسكلينج نيتروجينا 400 مل', nameEn: 'Neutrogena Anti-Residue Shampoo 400 ml', category: personalCare, price: 65, compareAtPrice: 78, brand: 'Neutrogena', unit: '400 ml', description: 'شامبو نيتروجينا لإزالة الرواسب ينظف بلطف ويزيل تراكمات المنتجات والمعادن من الشعر', descriptionEn: 'Neutrogena anti-residue shampoo gently cleanses and removes product and mineral buildup from hair', stock: 70, discount: 16, rating: 4.5, reviews: 110,
  imagePrompt: 'Neutrogena anti-residue shampoo 400ml bottle on white background, hair care product photography.' });

addProduct({ name: 'كريم اليدين فازلين 100 مل', nameEn: 'Vaseline Hand Cream 100 ml', category: personalCare, price: 25, compareAtPrice: 30, brand: 'Vaseline', unit: '100 ml', description: 'كريم فازلين لليد بتركيبة خفيفة تعمل على ترطيب اليدين الجافتين والمتشققة بفعالية', descriptionEn: 'Vaseline hand cream with light formula that effectively moisturizes dry and cracked hands', stock: 160, discount: 15, rating: 4.7, reviews: 140,
  imagePrompt: 'Vaseline hand cream 100ml tube on white background, hand care product photography.' });

addProduct({ name: 'دهان جسم نيفيا بالفانيليا 250 مل', nameEn: 'Nivea Vanilla Body Cream 250 ml', category: personalCare, price: 40, compareAtPrice: 48, brand: 'Nivea', unit: '250 ml', description: 'كريم جسم نيفيا بعطر الفانيليا الساخن يرطب البشرة بعمق ويتركها ناعمة ونضرة', descriptionEn: 'Nivea vanilla body cream with warm vanilla scent that deeply moisturizes leaving skin soft and smooth', stock: 100, discount: 16, rating: 4.6, reviews: 125,
  imagePrompt: 'Nivea vanilla body cream 250ml tub on white background, body care product photography.' });

addProduct({ name: 'مزيل عرق رول أون دوف 50 مل', nameEn: 'Dove Roll On Deodorant 50 ml', category: personalCare, price: 32, compareAtPrice: 38, brand: 'Dove', unit: '50 ml', description: 'مزيل رائحة العرق دوف رول أون بتركيبة 1/4 كريم مرطب للبشرة الحساسة بدون كحول', descriptionEn: 'Dove roll on deodorant with 1/4 moisturizing cream formula for sensitive skin, alcohol free', stock: 150, discount: 15, rating: 4.7, reviews: 155,
  imagePrompt: 'Dove roll on deodorant 50ml on white background, personal care product photography.' });

addProduct({ name: 'منظف وجه نيتروجينا 200 مل', nameEn: 'Neutrogena Facial Cleanser 200 ml', category: personalCare, price: 55, compareAtPrice: 65, brand: 'Neutrogena', unit: '200 ml', description: 'غسول وجه نيتروجينا بتركيبة الدهون لا تسد المسام ينظف البشرة بعمق برفق دون تجفيفها', descriptionEn: 'Neutrogena oil-free facial cleanser that deep cleanses pores gently without drying skin', stock: 85, discount: 14, rating: 4.8, reviews: 170,
  imagePrompt: 'Neutrogena facial cleanser 200ml bottle on white background, skincare product photography.' });

addProduct({ name: 'شامبو كريستال 400 مل', nameEn: 'Crystal Shampoo 400 ml', category: personalCare, price: 30, compareAtPrice: 36, brand: 'Crystal', unit: '400 ml', description: 'شامبو كريستال اليومي لتنظيف الشعر بلطف وتركه ناعم ولامع برائحة منعشة', descriptionEn: 'Crystal daily shampoo that gently cleanses hair leaving it soft, shiny and with a fresh scent', stock: 180, discount: 17, rating: 4.3, reviews: 95,
  imagePrompt: 'Crystal shampoo 400ml bottle on white background, hair care product photography.' });

addProduct({ name: 'لوشن مرطب للقدمين 100 مل', nameEn: 'Foot Moisturizing Lotion 100 ml', category: personalCare, price: 22, compareAtPrice: 27, brand: 'Vaseline', unit: '100 ml', description: 'لوشن مرطب للقدمين بتركيبة مركزة تعيد النعومة للقدمين الجافات والمتصلبة', descriptionEn: 'Intensive moisturizing foot lotion that restores softness to dry and rough feet', stock: 90, discount: 18, rating: 4.4, reviews: 80,
  imagePrompt: 'Vaseline foot moisturizing lotion 100ml tube on white background, foot care product photography.' });

addProduct({ name: 'معجون أسنان سيجنال حماية اللثة 125 مل', nameEn: 'Signal Gum Protection Toothpaste 125 ml', category: personalCare, price: 28, compareAtPrice: 34, brand: 'Signal', unit: '125 ml', description: 'معجون أسنان سيجنال بتركيبة حماية اللثة تقوي الأسنان وتمنع التسوس وتزيل البلاك', descriptionEn: 'Signal gum protection toothpaste with formula that strengthens teeth, prevents cavities and removes plaque', stock: 170, discount: 16, rating: 4.5, reviews: 135,
  imagePrompt: 'Signal gum protection toothpaste 125ml tube on white background, oral care product photography.' });

// ==================== BABY CARE (12) ====================
const babyCare = 'baby-care';

addProduct({ name: 'حفاضات بامبرز مقاس 3 58 حفاضة', nameEn: 'Pampers Pants Size 3 58 Diapers', category: babyCare, price: 155, compareAtPrice: 180, brand: 'Pampers', unit: '58 pcs', description: 'حفاضات بامبرز للأطفال مقاس 3', descriptionEn: 'Pampers baby diapers size 3', stock: 80,
  imagePrompt: 'Pampers pants size 3 pack on white background, baby diaper photography.' });

addProduct({ name: 'حفاضات بامبرز مقاس 4 52 حفاضة', nameEn: 'Pampers Pants Size 4 52 Diapers', category: babyCare, price: 165, compareAtPrice: 195, brand: 'Pampers', unit: '52 pcs', description: 'حفاضات بامبرز للأطفال مقاس 4', descriptionEn: 'Pampers baby diapers size 4', stock: 70,
  imagePrompt: 'Pampers pants size 4 pack on white background, baby diaper photography.' });

addProduct({ name: 'حفاضات بامبرز مقاس 5 46 حفاضة', nameEn: 'Pampers Pants Size 5 46 Diapers', category: babyCare, price: 175, compareAtPrice: 205, brand: 'Pampers', unit: '46 pcs', description: 'حفاضات بامبرز للأطفال مقاس 5', descriptionEn: 'Pampers baby diapers size 5', stock: 60,
  imagePrompt: 'Pampers pants size 5 pack on white background, baby diaper photography.' });

addProduct({ name: 'حفاضات بيبي جوي مقاس 3 54 حفاضة', nameEn: 'Baby Joy Size 3 54 Diapers', category: babyCare, price: 110, compareAtPrice: 130, brand: 'Baby Joy', unit: '54 pcs', description: 'حفاضات للأطفال مقاس 3', descriptionEn: 'Baby Joy diapers size 3', stock: 90,
  imagePrompt: 'Baby Joy diapers size 3 pack on white background, baby product photography.' });

addProduct({ name: 'مناديل مبللة بامبرز 100 منديل', nameEn: 'Pampers Wet Wipes 100 pcs', category: babyCare, price: 22, compareAtPrice: 27, brand: 'Pampers', unit: '100 pcs', description: 'مناديل مبللة للأطفال', descriptionEn: 'Pampers baby wet wipes', stock: 200,
  imagePrompt: 'Pampers wet wipes 100 pcs pack on white background, baby wipes photography.' });

addProduct({ name: 'مناديل مبللة بيبي جوي 80 منديل', nameEn: 'Baby Joy Wet Wipes 80 pcs', category: babyCare, price: 15, compareAtPrice: 18, brand: 'Baby Joy', unit: '80 pcs', description: 'مناديل مبللة للأطفال', descriptionEn: 'Baby wet wipes', stock: 180,
  imagePrompt: 'Baby Joy wet wipes 80 pcs pack on white background, baby wipes photography.' });

addProduct({ name: 'بودرة أطفال جونسون 200 جم', nameEn: 'Johnson Baby Powder 200 g', category: babyCare, price: 32, compareAtPrice: 38, brand: 'Johnsons', unit: '200 g', description: 'بودرة أطفال منعشة', descriptionEn: 'Johnson baby powder', stock: 140,
  imagePrompt: 'Johnson baby powder 200g bottle on white background, baby care photography.' });

addProduct({ name: 'شامبو أطفال جونسون 300 مل', nameEn: 'Johnson Baby Shampoo 300 ml', category: babyCare, price: 35, compareAtPrice: 42, brand: 'Johnsons', unit: '300 ml', description: 'شامبو أطفال لطيف', descriptionEn: 'Gentle baby shampoo', stock: 120,
  imagePrompt: 'Johnson baby shampoo 300ml bottle on white background, baby care photography.' });

addProduct({ name: 'زيت أطفال جونسون 200 مل', nameEn: 'Johnson Baby Oil 200 ml', category: babyCare, price: 28, compareAtPrice: 34, brand: 'Johnsons', unit: '200 ml', description: 'زيت أطفال مرطب', descriptionEn: 'Johnson baby oil', stock: 110,
  imagePrompt: 'Johnson baby oil 200ml bottle on white background, baby care photography.' });

addProduct({ name: 'كريم حفاضات بيبي كريم 100 مل', nameEn: 'Baby Diaper Cream 100 ml', category: babyCare, price: 25, compareAtPrice: 30, brand: 'Baby Joy', unit: '100 ml', description: 'كريم للوقاية من التسلخات', descriptionEn: 'Diaper rash prevention cream', stock: 100,
  imagePrompt: 'Baby diaper cream 100ml tube on white background, baby care photography.' });

addProduct({ name: 'رضاعة أطفال أفنت 250 مل', nameEn: 'Avent Baby Bottle 250 ml', category: babyCare, price: 85, compareAtPrice: 100, brand: 'Avent', unit: '250 ml', description: 'رضاعة للأطفال', descriptionEn: 'Baby feeding bottle', stock: 60,
  imagePrompt: 'Avent baby bottle 250ml on white background, baby feeding photography.' });

addProduct({ name: 'بيبي فود خضار مشكل 200 جم', nameEn: 'Mixed Vegetables Baby Food 200 g', category: babyCare, price: 18, compareAtPrice: 22, brand: 'Heinz', unit: '200 g', description: 'طعام أطفال خضار مشكل', descriptionEn: 'Mixed vegetables baby food jar', stock: 130,
  imagePrompt: 'Baby food mixed vegetables jar on white background, baby food photography.' });

addProduct({ name: 'حفاضات بامبرز مقاس 2 74 حفاضة', nameEn: 'Pampers Pants Size 2 74 Diapers', category: babyCare, price: 145, compareAtPrice: 170, brand: 'Pampers', unit: '74 pcs', description: 'حفاضات بامبرز سهلة الارتداد للأطفال الصغار مقاس 2 بـ 74 حفاضة، توفر حماية طويلة وامتصاص عالي للرطوبة', descriptionEn: 'Pampers easy-on pants for smaller babies size 2 with 74 diapers, long-lasting protection and high moisture absorption', stock: 130, discount: 15, rating: 4.7, reviews: 175,
  imagePrompt: 'Pampers pants size 2 with 74 count pack on white background, baby diaper product photography.' });

addProduct({ name: 'حفاضات بيبي جوي مقاس 4 48 حفاضة', nameEn: 'Baby Joy Size 4 48 Diapers', category: babyCare, price: 115, compareAtPrice: 135, brand: 'Baby Joy', unit: '48 pcs', description: 'حفاضات بيبي جوي مقاس 4 بـ 48 حفاضة، ناعمة على بشرة الطفل وتوفر حماية موثوقة طوال اليوم', descriptionEn: 'Baby Joy diapers size 4 with 48 pieces, soft on baby skin providing reliable all-day protection', stock: 160, discount: 14, rating: 4.5, reviews: 130,
  imagePrompt: 'Baby Joy diapers size 4 with 48 count pack on white background, baby product photography.' });

addProduct({ name: 'شامبو أطفال جونسون 300 مل', nameEn: 'Johnson Baby Shampoo 300 ml', category: babyCare, price: 35, compareAtPrice: 42, brand: 'Johnsons', unit: '300 ml', description: 'شامبو جونسون للأطفال بـ 300 مل، تركيبة لطيفة لا تحرق العيون تترك شعر الطفل ناعماً ونظيفاً', descriptionEn: 'Johnson baby shampoo 300 ml with a gentle no-tears formula leaving baby hair soft and clean', stock: 145, discount: 16, rating: 4.8, reviews: 195,
  imagePrompt: 'Johnson baby shampoo 300ml pink bottle on white background, baby hair care product photography.' });

addProduct({ name: 'مناديل مبللة بامبرز حساسة 80 منديل', nameEn: 'Pampers Sensitive Wipes 80 pcs', category: babyCare, price: 25, compareAtPrice: 30, brand: 'Pampers', unit: '80 pcs', description: 'مناديل مبللة بامبرز الحساسة بـ 80 منديل، مصنوعة بالpure water مناسبة لبشرة حساسة الطفل', descriptionEn: 'Pampers sensitive wipes with 80 pieces made with pure water, dermatologically tested for delicate baby skin', stock: 190, discount: 12, rating: 4.6, reviews: 155,
  imagePrompt: 'Pampers sensitive wet wipes 80 pcs green pack on white background, baby wipes product photography.' });

addProduct({ name: 'بودرة أطفال جونسون 350 جم', nameEn: 'Johnson Baby Powder 350 g', category: babyCare, price: 42, compareAtPrice: 50, brand: 'Johnsons', unit: '350 g', description: 'بودرة جونسون للأطفال 350 جم، تمنع تسلخات الحفاضات وتحافظ على بشرة الطفل ناعمة وجافة', descriptionEn: 'Johnson baby powder 350 g helps prevent diaper rash and keeps baby skin soft and dry', stock: 110, discount: 14, rating: 4.7, reviews: 140,
  imagePrompt: 'Johnson baby powder 350g white bottle on white background, baby care product photography.' });

addProduct({ name: 'زجاجة رضاعة أفنت 330 مل', nameEn: 'Avent Feeding Bottle 330 ml', category: babyCare, price: 95, compareAtPrice: 110, brand: 'Avent', unit: '330 ml', description: 'زجاجة رضاعة أفنت بسعة 330 مل مصنوعة من البوروسيليكيت الخالي من البيسفينول مع فتحة واسعة', descriptionEn: 'Avent feeding bottle 330 ml made from BPA-free borosilicate glass with wide neck for easy filling', stock: 75, discount: 13, rating: 4.8, reviews: 165,
  imagePrompt: 'Avent baby feeding bottle 330ml clear glass on white background, baby feeding product photography.' });

addProduct({ name: 'حفاضات بامبرز مقاس 6 40 حفاضة', nameEn: 'Pampers Pants Size 6 40 Diapers', category: babyCare, price: 180, compareAtPrice: 210, brand: 'Pampers', unit: '40 pcs', description: 'حفاضات بامبرز مقاس 6 الكبيرة بـ 40 حفاضة مثالية للأطفال الأكبر سناً مع حماية تصل إلى 12 ساعة', descriptionEn: 'Pampers pants size 6 large with 40 diapers ideal for bigger babies with up to 12 hours of protection', stock: 90, discount: 16, rating: 4.6, reviews: 110,
  imagePrompt: 'Pampers pants size 6 with 40 count pack on white background, baby diaper product photography.' });

addProduct({ name: 'طعام أطفال حليب جاف 400 جم', nameEn: 'Baby Milk Powder 400 g', category: babyCare, price: 85, compareAtPrice: 100, brand: 'Nido', unit: '400 g', description: 'حليب جاف للأطفال من نيدو 400 جم غني بالفيتامينات والمعادنEssential لنمو الطفل السليم', descriptionEn: 'Nido baby milk powder 400 g enriched with vitamins and minerals essential for healthy child growth', stock: 120, discount: 15, rating: 4.9, reviews: 200,
  imagePrompt: 'Nido baby milk powder 400g tin can on white background, baby formula product photography.' });

addProduct({ name: 'كريم مرطب أطفال ميستيلا 200 مل', nameEn: 'Mustela Baby Moisturizer 200 ml', category: babyCare, price: 65, compareAtPrice: 78, brand: 'Mustela', unit: '200 ml', description: 'كريم مرطب ميستيلا للأطفال 200 مل يرطب بشرة الطفل بعمق ويوفر حماية طويلة من الجفاف', descriptionEn: 'Mustela baby moisturizer 200 ml deeply hydrates baby skin and provides long-lasting protection against dryness', stock: 65, discount: 16, rating: 4.8, reviews: 95,
  imagePrompt: 'Mustela baby moisturizer 200ml white tube on white background, premium baby skincare photography.' });

addProduct({ name: 'شامبو أطفال ميستيلا 500 مل', nameEn: 'Mustela Baby Shampoo 500 ml', category: babyCare, price: 75, compareAtPrice: 88, brand: 'Mustela', unit: '500 ml', description: 'شامبو ميستيلا للأطفال 500 مل بلطفه الطبيعي ينظف فروة رأس الطفل دون تجريد الدهون الطبيعية', descriptionEn: 'Mustela baby shampoo 500 ml gently cleanses baby hair without stripping natural oils, hypoallergenic formula', stock: 55, discount: 14, rating: 4.7, reviews: 115,
  imagePrompt: 'Mustela baby shampoo 500ml pump bottle on white background, premium baby hair care photography.' });

addProduct({ name: 'حفاضات بيبي جوي مقاس 5 42 حفاضة', nameEn: 'Baby Joy Size 5 42 Diapers', category: babyCare, price: 120, compareAtPrice: 140, brand: 'Baby Joy', unit: '42 pcs', description: 'حفاضات بيبي جوي مقاس 5 بـ 42 حفاضة مريحة وناعمة مع حزام مرن يمنع التسرب', descriptionEn: 'Baby Joy diapers size 5 with 42 pieces comfortable and soft with flexible tape to prevent leaks', stock: 140, discount: 14, rating: 4.4, reviews: 105,
  imagePrompt: 'Baby Joy diapers size 5 with 42 count pack on white background, baby diaper product photography.' });

addProduct({ name: 'زجاجة رضاعة أفنت 150 مل', nameEn: 'Avent Starter Bottle 150 ml', category: babyCare, price: 65, compareAtPrice: 78, brand: 'Avent', unit: '150 ml', description: 'زجاجة رضاعة أفنت مبتدئ بـ 150 مل صغيرة الحجم مثالية للرضاعة الأولى مع ثقب صغير للتهوية', descriptionEn: 'Avent starter bottle 150 ml small size ideal for first feedings with anti-colic vent for comfortable feeding', stock: 85, discount: 15, rating: 4.6, reviews: 80,
  imagePrompt: 'Avent starter baby bottle 150ml clear on white background, baby feeding product photography.' });

// ==================== BAKERY (18) ====================
const bakery = 'bakery';

addProduct({ name: 'عيش توست ريتش بيك أبيض 500 جم', nameEn: 'Rich Bake White Toast 500 g', category: bakery, price: 18, compareAtPrice: 22, brand: 'Rich Bake', unit: '500 g', description: 'عيش توست أبيض طري', descriptionEn: 'Soft white toast bread', stock: 200,
  imagePrompt: 'Rich Bake white toast bread 500g loaf on white background, bakery photography.' });

addProduct({ name: 'عيش توست ريتش بيك أسمر 500 جم', nameEn: 'Rich Bake Brown Toast 500 g', category: bakery, price: 22, compareAtPrice: 27, brand: 'Rich Bake', unit: '500 g', description: 'عيش توست أسمر غني بالألياف', descriptionEn: 'Brown wheat toast bread rich in fiber', stock: 160,
  imagePrompt: 'Rich Bake brown toast bread 500g on white background, bakery photography.' });

addProduct({ name: 'عيش شامي بلدي 500 جم', nameEn: 'Baladi Egyptian Bread 500 g', category: bakery, price: 12, compareAtPrice: 15, brand: 'Rich Bake', unit: '500 g', description: 'عيش شامي بلدي طازج', descriptionEn: 'Fresh baladi Arabic bread', stock: 250,
  imagePrompt: 'Baladi Egyptian bread pita style on white background, Arabic bread photography.' });

addProduct({ name: 'كرواسون ريتش بيك بلجيكي 100 جم', nameEn: 'Rich Bake Belgian Croissant 100 g', category: bakery, price: 10, compareAtPrice: 13, brand: 'Rich Bake', unit: '100 g', description: 'كرواسون بلجيكي طري', descriptionEn: 'Soft Belgian croissant', stock: 120,
  imagePrompt: 'Rich Bake Belgian croissant on white background, pastry photography.' });

addProduct({ name: 'باتيه ريتش بيك جبنة 100 جم', nameEn: 'Rich Bake Cheese Pastry 100 g', category: bakery, price: 12, compareAtPrice: 15, brand: 'Rich Bake', unit: '100 g', description: 'باتيه جبنة طري', descriptionEn: 'Soft cheese pastry', stock: 110,
  imagePrompt: 'Rich Bake cheese pastry on white background, bakery photography.' });

addProduct({ name: 'كحك العيد سادة 500 جم', nameEn: 'Plain Eid Cookies 500 g', category: bakery, price: 45, compareAtPrice: 55, brand: 'Rich Bake', unit: '500 g', description: 'كحك العيد المصري', descriptionEn: 'Traditional Egyptian Eid cookies', stock: 60,
  imagePrompt: 'Egyptian Eid cookies 500g box on white background, traditional pastry photography.' });

addProduct({ name: 'بيتي فور ريتش بيك 300 جم', nameEn: 'Rich Bake Petit Four 300 g', category: bakery, price: 35, compareAtPrice: 42, brand: 'Rich Bake', unit: '300 g', description: 'بيتي فور مشكل', descriptionEn: 'Assorted petit four pastries', stock: 70,
  imagePrompt: 'Rich Bake petit four assorted 300g box on white background, pastry photography.' });

addProduct({ name: 'بسكويت دايجستيف ريتش بيك 250 جم', nameEn: 'Rich Bake Digestive 250 g', category: bakery, price: 22, compareAtPrice: 27, brand: 'Rich Bake', unit: '250 g', description: 'بسكويت دايجستيف', descriptionEn: 'Digestive biscuits', stock: 130,
  imagePrompt: 'Rich Bake digestive biscuits 250g pack on white background, biscuit photography.' });

addProduct({ name: 'كيك بالفانيليا ريتش بيك 400 جم', nameEn: 'Rich Bake Vanilla Cake 400 g', category: bakery, price: 30, compareAtPrice: 36, brand: 'Rich Bake', unit: '400 g', description: 'كيك ناعم بالفانيليا', descriptionEn: 'Soft vanilla sponge cake', stock: 80,
  imagePrompt: 'Rich Bake vanilla cake 400g on white background, cake photography.' });

addProduct({ name: 'دونات سادة ريتش بيك 6 حبات', nameEn: 'Rich Bake Plain Donuts 6 pcs', category: bakery, price: 20, compareAtPrice: 25, brand: 'Rich Bake', unit: '6 pcs', description: 'دونات سادة طازجة', descriptionEn: 'Fresh plain donuts', stock: 60,
  imagePrompt: 'Rich Bake plain donuts 6 pack on white background, donut photography.' });

addProduct({ name: 'بيغل سادة ريتش بيك 4 حبات', nameEn: 'Rich Bake Plain Bagels 4 pcs', category: bakery, price: 25, compareAtPrice: 30, brand: 'Rich Bake', unit: '4 pcs', description: 'بيغل طازج', descriptionEn: 'Fresh plain bagels', stock: 50,
  imagePrompt: 'Rich Bake bagels 4 pack on white background, bagel photography.' });

addProduct({ name: 'فطيرة ريتش بيك بالسكر 200 جم', nameEn: 'Rich Bake Sugar Pie 200 g', category: bakery, price: 15, compareAtPrice: 18, brand: 'Rich Bake', unit: '200 g', description: 'فطيرة سكر طازجة', descriptionEn: 'Fresh sugar pie', stock: 90,
  imagePrompt: 'Rich Bake sugar pie on white background, pastry photography.' });

addProduct({ name: 'ميني كروسون جبنة ريتش بيك 200 جم', nameEn: 'Rich Bake Mini Cheese Croissants 200 g', category: bakery, price: 18, compareAtPrice: 22, brand: 'Rich Bake', unit: '200 g', description: 'ميني كرواسون بالجبنة', descriptionEn: 'Mini cheese filled croissants', stock: 80,
  imagePrompt: 'Rich Bake mini cheese croissants on white background, bakery photography.' });

addProduct({ name: 'خبز شامي حب 6 حبات', nameEn: 'Arabic Sesame Bread 6 pcs', category: bakery, price: 10, compareAtPrice: 13, brand: 'Rich Bake', unit: '6 pcs', description: 'خبز شامي بالسمسم', descriptionEn: 'Sesame topped Arabic bread', stock: 150,
  imagePrompt: 'Arabic sesame bread 6 pack on white background, bakery photography.' });

addProduct({ name: 'خبز همبرجر 8 حبات', nameEn: 'Hamburger Buns 8 pcs', category: bakery, price: 15, compareAtPrice: 18, brand: 'Rich Bake', unit: '8 pcs', description: 'خبز همبرجر', descriptionEn: 'Hamburger burger buns', stock: 100,
  imagePrompt: 'Hamburger buns 8 pack on white background, bakery photography.' });

addProduct({ name: 'خبز هوت دوج 8 حبات', nameEn: 'Hot Dog Buns 8 pcs', category: bakery, price: 15, compareAtPrice: 18, brand: 'Rich Bake', unit: '8 pcs', description: 'خبز هوت دوج', descriptionEn: 'Hot dog buns', stock: 100,
  imagePrompt: 'Hot dog buns 8 pack on white background, bakery photography.' });

addProduct({ name: 'سينابون بالقرفة 400 جم', nameEn: 'Cinnamon Cinnabon 400 g', category: bakery, price: 45, compareAtPrice: 55, brand: 'Rich Bake', unit: '400 g', description: 'سينابون بالقرفة والكريمة', descriptionEn: 'Cream cheese cinnamon rolls', stock: 40,
  imagePrompt: 'Cinnamon rolls on white background, bakery dessert photography.' });

addProduct({ name: 'بريوش ريتش بيك 200 جم', nameEn: 'Rich Bake Brioche 200 g', category: bakery, price: 20, compareAtPrice: 25, brand: 'Rich Bake', unit: '200 g', description: 'بريوش فرنسي طري', descriptionEn: 'Soft French brioche bread', stock: 70,
  imagePrompt: 'Rich Bake brioche 200g on white background, bakery photography.' });

addProduct({ name: 'توست أسمر بالحبوب 500 جم', nameEn: 'Whole Grain Toast Bread 500 g', category: bakery, price: 28, compareAtPrice: 34, brand: 'Rich Bake', unit: '500 g', description: 'توست أسمر مدعم بالحبوب الكاملة غني بالألياف والفيتامينات مثالي للإفطار الصحي', descriptionEn: 'Brown toast bread enriched with whole grains, high in fiber and vitamins, perfect for a healthy breakfast', stock: 90, discount: 15, rating: 4.6, reviews: 120,
  imagePrompt: 'Whole grain brown toast bread loaf sliced on white background, bakery product photography, commercial grocery shot.' });

addProduct({ name: 'كرواسون بالشوكولاتة 100 جم', nameEn: 'Chocolate Croissant 100 g', category: bakery, price: 14, compareAtPrice: 17, brand: 'Rich Bake', unit: '100 g', description: 'كرواسون فرنسي محشي بالشوكولاتة الداكنة طريق ولذيذ مع قشرة ذهبية مقرمشة', descriptionEn: 'French croissant filled with rich dark chocolate, flaky and delicious with a golden crispy crust', stock: 120, discount: 12, rating: 4.7, reviews: 155,
  imagePrompt: 'Chocolate croissant sliced open showing melted chocolate filling on white background, pastry photography.' });

addProduct({ name: 'خبز أبيض رقيق 500 جم', nameEn: 'Thin White Bread 500 g', category: bakery, price: 12, compareAtPrice: 15, brand: 'Rich Bake', unit: '500 g', description: 'خبز أبيض رقيق خفيف مثالي للساندويتشات والتوست السريع مع قوام ناعم', descriptionEn: 'Thin and light white bread ideal for sandwiches and quick toast with a soft texture', stock: 140, discount: 18, rating: 4.3, reviews: 90,
  imagePrompt: 'Thin white sliced bread loaf on white background, bakery product shot, clean commercial photography.' });

addProduct({ name: 'مافن بالتوت 4 حبات', nameEn: 'Blueberry Muffins 4 pcs', category: bakery, price: 22, compareAtPrice: 27, brand: 'Rich Bake', unit: '4 pcs', description: 'كعك مافن طري بالتوت الأزرق الطبيعي مناسب للفطور أو وجبة خفيفة لذيذة', descriptionEn: 'Soft blueberry muffins made with real blueberries, perfect for breakfast or a delicious snack', stock: 75, discount: 14, rating: 4.5, reviews: 100,
  imagePrompt: 'Four blueberry muffins in paper liners on white background, bakery dessert photography.' });

addProduct({ name: 'بيتزا صغيرة بالجبنة 200 جم', nameEn: 'Mini Cheese Pizza 200 g', category: bakery, price: 15, compareAtPrice: 18, brand: 'Rich Bake', unit: '200 g', description: 'بيتزا صغيرة بالجبنة الشيدر والموزاريلا على عجينة طرية محضرة جاهزة للتسخين', descriptionEn: 'Mini pizza topped with cheddar and mozzarella cheese on soft dough, ready to heat and serve', stock: 80, discount: 12, rating: 4.4, reviews: 85,
  imagePrompt: 'Mini cheese pizza with melted cheese topping on white background, frozen bakery product photography.' });

addProduct({ name: 'ساندوتش تونة جاهز 150 جم', nameEn: 'Ready Tuna Sandwich 150 g', category: bakery, price: 18, compareAtPrice: 22, brand: 'Rich Bake', unit: '150 g', description: 'ساندوتش تونة جاهز بالخبز الطري مع خضار طازجة ومайونيز مثالي للوجبة السريعة', descriptionEn: 'Ready-to-eat tuna sandwich with soft bread, fresh vegetables, and mayonnaise for a quick meal', stock: 60, discount: 15, rating: 4.3, reviews: 70,
  imagePrompt: 'Ready-made tuna sandwich wrapped on white background, grab-and-go bakery product photography.' });

addProduct({ name: 'بان كيك سادة 300 جم', nameEn: 'Plain Pancake Mix 300 g', category: bakery, price: 15, compareAtPrice: 18, brand: 'Rich Bake', unit: '300 g', description: 'خليط بان كيك سهل التحضير只需 إضافة الحليب والماء لتحضير قطع بان كيك طرية ولذيذة', descriptionEn: 'Easy pancake mix, just add milk and water to prepare fluffy and delicious pancakes at home', stock: 100, discount: 14, rating: 4.5, reviews: 110,
  imagePrompt: 'Pancake mix package with stack of pancakes on white background, baking mix product photography.' });

addProduct({ name: 'فطيرة بالجبنة 200 جم', nameEn: 'Cheese Pastry Pie 200 g', category: bakery, price: 15, compareAtPrice: 18, brand: 'Rich Bake', unit: '200 g', description: 'فطيرة بالجبنة البيضاء على عجينة فيلو مقرمشة باللون الذهبي جاهزة للتسخين', descriptionEn: 'Cheese pastry pie with white cheese on crispy golden filo dough, ready to heat and serve', stock: 85, discount: 13, rating: 4.4, reviews: 95,
  imagePrompt: 'Golden crispy cheese pastry pie on white background, Middle Eastern bakery photography.' });

addProduct({ name: 'ميني دونات بالسكر 6 حبات', nameEn: 'Mini Sugar Donuts 6 pcs', category: bakery, price: 18, compareAtPrice: 22, brand: 'Rich Bake', unit: '6 pcs', description: 'دونات صغيرة مغلفة بالسكر البودرة طرية ومناسبة كوجبة خفيفة أو حلوى', descriptionEn: 'Mini donuts coated with powdered sugar, soft and perfect as a snack or sweet treat', stock: 90, discount: 16, rating: 4.6, reviews: 130,
  imagePrompt: 'Six mini sugar donuts dusted with powdered sugar on white background, pastry product photography.' });

addProduct({ name: 'خبز توست بالزبدة 500 جم', nameEn: 'Butter Toast Bread 500 g', category: bakery, price: 22, compareAtPrice: 27, brand: 'Rich Bake', unit: '500 g', description: 'توست بالزبدة الفاخرة طري وطازج مثالي للإفطار مع الجبنة أو المربى', descriptionEn: 'Butter-enriched toast bread, soft and fresh, perfect for breakfast with cheese or jam', stock: 110, discount: 15, rating: 4.5, reviews: 115,
  imagePrompt: 'Butter toast bread loaf sliced on white background, premium bakery product photography.' });

addProduct({ name: 'سينابون بالفستق 400 جم', nameEn: 'Pistachio Cinnamon Rolls 400 g', category: bakery, price: 50, compareAtPrice: 60, brand: 'Rich Bake', unit: '400 g', description: 'سينابون بالقرفة والكريمة مزود بحبات الفستق المجروشة مذاق فاخر لا يُقاوم', descriptionEn: 'Cinnamon rolls with cream cheese frosting topped with crushed pistachios, an irresistible premium treat', stock: 45, discount: 14, rating: 4.8, reviews: 175,
  imagePrompt: 'Pistachio cinnamon rolls with cream frosting and crushed pistachios on white background, dessert bakery photography.' });

addProduct({ name: 'بريوش بالزبدة 300 جم', nameEn: 'Butter Brioche 300 g', category: bakery, price: 28, compareAtPrice: 34, brand: 'Rich Bake', unit: '300 g', description: 'بريوش فرنسي غني بالزبدة طري وذو قوام مخملي مثالي مع العسل أو الزبدة', descriptionEn: 'Rich French butter brioche, soft with a velvety texture, perfect with honey or butter', stock: 65, discount: 13, rating: 4.7, reviews: 145,
  imagePrompt: 'Rich butter brioche loaf on white background, premium French bakery product photography.' });

// Write the catalog file
const catalog = { categories, products };
const outputPath = path.join(__dirname, '..', 'canonical-catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf8');

console.log(`=== Catalog Generated ===`);
console.log(`Categories: ${catalog.categories.length}`);
console.log(`Products: ${catalog.products.length}`);
console.log(`Output: ${outputPath}`);

// Summary by category
const byCat = {};
for (const p of products) {
  byCat[p.category] = (byCat[p.category] || 0) + 1;
}
for (const cat of categories) {
  console.log(`  ${cat.slug}: ${byCat[cat.slug] || 0} products`);
}
