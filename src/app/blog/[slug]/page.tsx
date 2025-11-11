'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageProvider';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';
import styles from './BlogPost.module.css';
import { useEffect, useState } from 'react';
import img from "../Phoenix_10_A_vibrant_promotional_banner_showing_smart_shopping_3.jpg";
import img2 from "../Phoenix_10_Fresh_colorful_fruits_and_vegetables_display_repres_2.jpg";
import img3 from "../Phoenix_10_Professional_food_storage_and_preservation_concept_3.jpg";

// بيانات المقالات
const blogPosts = {
  'smart-shopping': {
    title: {
      ar: 'نصائح للتسوق الذكي في السوبر ماركت',
      en: 'Smart Shopping Tips at the Supermarket'
    },
    image: img,
    author: {
      ar: 'فريق باندا ماركت',
      en: 'Panda Market Team'
    },
    date: {
      ar: '١٠ نوفمبر ٢٠٢٥',
      en: 'November 10, 2025'
    },
    content: {
      ar: `
        <h2>كيف توفر المال أثناء التسوق؟</h2>
        <p>التسوق الذكي لا يعني فقط البحث عن أرخص الأسعار، بل يتعلق باتخاذ قرارات مدروسة تساعدك على توفير المال دون التضحية بجودة المنتجات التي تشتريها. في هذا المقال، سنشارك معك أفضل النصائح لتوفير المال أثناء التسوق.</p>
        
        <h3>١. اصنع قائمة تسوق والتزم بها</h3>
        <p>قبل الذهاب إلى السوبر ماركت، اكتب قائمة مفصلة بكل ما تحتاجه. هذه الطريقة البسيطة يمكن أن توفر لك مئات الريالات شهرياً، لأنها تمنعك من شراء أشياء لا تحتاجها فعلياً. السوبر ماركت مصمم لإغرائك بالمنتجات غير الضرورية، لذا القائمة هي درعك الواقي.</p>
        
        <h3>٢. قارن الأسعار واستخدم التطبيقات</h3>
        <p>في عصر التكنولوجيا، أصبح من السهل مقارنة الأسعار بين السوبر ماركت المختلفة. استخدم تطبيقات مقارنة الأسعار أو تطبيق باندا ماركت نفسه لمعرفة أفضل العروض. أحياناً، الفرق في السعر بين متجرين قد يصل إلى ٣٠٪ للمنتج نفسه!</p>
        
        <h3>٣. تسوق المنتجات الموسمية</h3>
        <p>الفواكه والخضروات الموسمية ليست فقط أرخص، بل هي أيضاً أكثر نضارة وأفضل مذاقاً. على سبيل المثال، شراء البطيخ في الصيف والبرتقال في الشتاء يوفر لك المال ويضمن حصولك على منتجات طازجة بأعلى جودة.</p>
        
        <h3>٤. لا تتسوق وأنت جائع</h3>
        <p>هذه نصيحة ذهبية! التسوق على معدة فارغة يجعلك تشتري أكثر مما تحتاج، خاصة الوجبات السريعة والحلويات. تناول وجبة خفيفة قبل الذهاب للتسوق لتحافظ على تركيزك وعقلانيتك.</p>
        
        <h3>٥. استفد من العروض والكوبونات الرقمية</h3>
        <p>تابع العروض الأسبوعية في باندا ماركت واستخدم الكوبونات الرقمية المتاحة في التطبيق. العروض على المنتجات الأساسية مثل الأرز والزيت والسكر يمكن أن توفر لك مبالغ كبيرة على المدى الطويل.</p>
        
        <h3>٦. تسوق من الرفوف العلوية والسفلية</h3>
        <p>هل تعلم أن السوبر ماركت يضع المنتجات الأغلى سعراً على مستوى العين؟ المنتجات الأرخص والقيمة الأفضل عادة ما تكون على الرفوف العلوية أو السفلية. خذ دقيقة إضافية للبحث!</p>
        
        <h3>٧. اشترِ بالجملة للمنتجات غير القابلة للتلف</h3>
        <p>المنتجات مثل الأرز، المعكرونة، والمعلبات يمكن شراؤها بالجملة لتوفير المال. فقط تأكد من أن لديك مساحة تخزين كافية ولن تنتهي صلاحية المنتج قبل استخدامه.</p>
        
        <h3>٨. تجنب التسوق في أوقات الذروة</h3>
        <p>التسوق قبل وقت الإغلاق أو في الصباح الباكر قد يمنحك فرصة للحصول على خصومات على المنتجات الطازجة التي يريد المتجر تصريفها سريعاً.</p>
        
        <p><strong>خلاصة:</strong> التسوق الذكي هو مهارة يمكن تعلمها بسهولة. بمجرد أن تبدأ في تطبيق هذه النصائح، ستلاحظ فرقاً كبيراً في فاتورة التسوق الشهرية. ابدأ اليوم واجعل كل ريال يُحسب!</p>
      `,
      en: `
        <h2>How to Save Money While Shopping?</h2>
        <p>Smart shopping isn't just about finding the cheapest prices—it's about making informed decisions that help you save money without sacrificing the quality of products you buy. In this article, we'll share the best tips for saving money while grocery shopping.</p>
        
        <h3>1. Make a Shopping List and Stick to It</h3>
        <p>Before heading to the supermarket, write a detailed list of everything you need. This simple method can save you hundreds of dollars monthly because it prevents you from buying things you don't actually need. Supermarkets are designed to tempt you with unnecessary products, so your list is your shield.</p>
        
        <h3>2. Compare Prices and Use Apps</h3>
        <p>In the age of technology, comparing prices between different supermarkets has become easy. Use price comparison apps or the Panda Market app itself to find the best deals. Sometimes, the price difference between two stores can be up to 30% for the same product!</p>
        
        <h3>3. Shop Seasonal Products</h3>
        <p>Seasonal fruits and vegetables are not only cheaper but also fresher and better tasting. For example, buying watermelon in summer and oranges in winter saves you money and ensures you get fresh products of the highest quality.</p>
        
        <h3>4. Don't Shop When Hungry</h3>
        <p>This is golden advice! Shopping on an empty stomach makes you buy more than you need, especially fast food and sweets. Have a light snack before shopping to maintain your focus and rationality.</p>
        
        <h3>5. Take Advantage of Deals and Digital Coupons</h3>
        <p>Follow weekly offers at Panda Market and use digital coupons available in the app. Deals on staples like rice, oil, and sugar can save you significant amounts in the long run.</p>
        
        <h3>6. Shop from Top and Bottom Shelves</h3>
        <p>Did you know supermarkets place the most expensive products at eye level? The cheaper and better value products are usually on the top or bottom shelves. Take an extra minute to search!</p>
        
        <h3>7. Buy in Bulk for Non-Perishables</h3>
        <p>Products like rice, pasta, and canned goods can be bought in bulk to save money. Just make sure you have enough storage space and the product won't expire before you use it.</p>
        
        <h3>8. Avoid Shopping During Peak Hours</h3>
        <p>Shopping before closing time or early in the morning may give you a chance to get discounts on fresh products that the store wants to clear quickly.</p>
        
        <p><strong>Conclusion:</strong> Smart shopping is a skill that can be easily learned. Once you start applying these tips, you'll notice a big difference in your monthly grocery bill. Start today and make every dollar count!</p>
      `
    }
  },
  'fresh-produce': {
    title: {
      ar: 'أهمية المنتجات الطازجة في نظامك الغذائي',
      en: 'The Importance of Fresh Produce in Your Diet'
    },
    image: img2,
    author: {
      ar: 'د. سارة أحمد',
      en: 'Dr. Sarah Ahmed'
    },
    date: {
      ar: '٩ نوفمبر ٢٠٢٥',
      en: 'November 9, 2025'
    },
    content: {
      ar: `
        <h2>لماذا المنتجات الطازجة مهمة لصحتك؟</h2>
        <p>الفواكه والخضروات الطازجة هي حجر الأساس لنظام غذائي صحي ومتوازن. إنها ليست فقط لذيذة، بل مليئة بالفيتامينات والمعادن والألياف التي يحتاجها جسمك ليعمل بكفاءة. في هذا المقال، سنستكشف الفوائد الصحية المذهلة للمنتجات الطازجة.</p>
        
        <h3>الفوائد الصحية للمنتجات الطازجة</h3>
        <p>المنتجات الطازجة غنية بمضادات الأكسدة التي تحمي خلايا جسمك من التلف وتقلل من خطر الإصابة بالأمراض المزمنة مثل أمراض القلب والسكري والسرطان. كما أنها تقوي جهاز المناعة، مما يساعد جسمك على مقاومة العدوى والأمراض.</p>
        
        <h3>تحسين الهضم والصحة المعوية</h3>
        <p>الألياف الموجودة في الفواكه والخضروات تساعد في تحسين عملية الهضم ومنع الإمساك. كما أنها تغذي البكتيريا النافعة في أمعائك، مما يعزز صحة الجهاز الهضمي بشكل عام. نظام هضمي صحي يعني امتصاص أفضل للعناصر الغذائية وطاقة أكثر طوال اليوم.</p>
        
        <h3>التحكم في الوزن</h3>
        <p>المنتجات الطازجة منخفضة السعرات الحرارية ولكنها تحتوي على كمية كبيرة من الماء والألياف، مما يجعلك تشعر بالشبع لفترة أطول. هذا يساعدك على التحكم في وزنك دون الشعور بالحرمان. استبدال الوجبات الخفيفة غير الصحية بالفواكه الطازجة يمكن أن يحدث فرقاً كبيراً.</p>
        
        <h3>تحسين المزاج والصحة النفسية</h3>
        <p>هل تعلم أن تناول الفواكه والخضروات يمكن أن يحسن مزاجك؟ بعض المنتجات الطازجة مثل الخضروات الورقية والتوت تحتوي على عناصر غذائية ترفع المزاج وتقلل من أعراض الاكتئاب. السبانخ، على سبيل المثال، غنية بحمض الفوليك الذي يرتبط بانخفاض معدلات الاكتئاب.</p>
        
        <h3>كيف تختار المنتجات الطازجة؟</h3>
        <p>عند اختيار الفواكه والخضروات، ابحث عن:</p>
        <ul>
          <li><strong>الألوان الزاهية:</strong> تدل على نضج المنتج وغناه بالعناصر الغذائية</li>
          <li><strong>القوام الصلب:</strong> تجنب المنتجات اللينة أو المجعدة</li>
          <li><strong>الرائحة الطازجة:</strong> المنتجات الطازجة لها رائحة طبيعية مميزة</li>
          <li><strong>خلو من البقع:</strong> تجنب الفواكه والخضروات ذات البقع الداكنة أو التلف</li>
        </ul>
        
        <h3>نصائح لزيادة استهلاك المنتجات الطازجة</h3>
        <p>• ابدأ يومك بسلطة فواكه طازجة أو عصير طبيعي<br>
        • أضف الخضروات إلى كل وجبة رئيسية<br>
        • احتفظ بالفواكه المقطعة في الثلاجة كوجبة خفيفة سريعة<br>
        • جرب أنواعاً جديدة من الفواكه والخضروات كل أسبوع<br>
        • استخدم الخضروات كبديل صحي للوجبات السريعة</p>
        
        <p><strong>خلاصة:</strong> المنتجات الطازجة هي استثمار في صحتك وعافيتك. اجعلها جزءاً أساسياً من نظامك الغذائي اليومي واستمتع بحياة أكثر صحة ونشاطاً!</p>
      `,
      en: `
        <h2>Why Fresh Products Are Important for Your Health?</h2>
        <p>Fresh fruits and vegetables are the cornerstone of a healthy and balanced diet. They're not only delicious but also packed with vitamins, minerals, and fiber that your body needs to function efficiently. In this article, we'll explore the amazing health benefits of fresh produce.</p>
        
        <h3>Health Benefits of Fresh Produce</h3>
        <p>Fresh produce is rich in antioxidants that protect your body's cells from damage and reduce the risk of chronic diseases such as heart disease, diabetes, and cancer. They also strengthen the immune system, helping your body fight infections and diseases.</p>
        
        <h3>Improved Digestion and Gut Health</h3>
        <p>The fiber found in fruits and vegetables helps improve digestion and prevent constipation. It also feeds the beneficial bacteria in your gut, promoting overall digestive health. A healthy digestive system means better nutrient absorption and more energy throughout the day.</p>
        
        <h3>Weight Management</h3>
        <p>Fresh produce is low in calories but contains a large amount of water and fiber, making you feel full longer. This helps you control your weight without feeling deprived. Replacing unhealthy snacks with fresh fruit can make a big difference.</p>
        
        <h3>Improved Mood and Mental Health</h3>
        <p>Did you know that eating fruits and vegetables can improve your mood? Some fresh products like leafy greens and berries contain nutrients that boost mood and reduce depression symptoms. Spinach, for example, is rich in folate, which is linked to lower depression rates.</p>
        
        <h3>How to Choose Fresh Produce?</h3>
        <p>When choosing fruits and vegetables, look for:</p>
        <ul>
          <li><strong>Bright Colors:</strong> Indicate ripeness and rich nutrients</li>
          <li><strong>Firm Texture:</strong> Avoid soft or wrinkled products</li>
          <li><strong>Fresh Smell:</strong> Fresh products have a distinctive natural aroma</li>
          <li><strong>No Spots:</strong> Avoid fruits and vegetables with dark spots or damage</li>
        </ul>
        
        <h3>Tips to Increase Fresh Produce Consumption</h3>
        <p>• Start your day with fresh fruit salad or natural juice<br>
        • Add vegetables to every main meal<br>
        • Keep cut fruits in the fridge as a quick snack<br>
        • Try new types of fruits and vegetables each week<br>
        • Use vegetables as a healthy alternative to fast food</p>
        
        <p><strong>Conclusion:</strong> Fresh produce is an investment in your health and well-being. Make it an essential part of your daily diet and enjoy a healthier, more active life!</p>
      `
    }
  },
  'food-storage': {
    title: {
      ar: 'طرق تخزين الأطعمة للحفاظ على جودتها',
      en: 'How to Store Food and Keep It Fresh'
    },
    image: img3,
    author: {
      ar: 'أحمد محمد',
      en: 'Ahmed Mohamed'
    },
    date: {
      ar: '٨ نوفمبر ٢٠٢٥',
      en: 'November 8, 2025'
    },
    content: {
      ar: `
        <h2>دليلك الشامل لتخزين الطعام بطريقة صحيحة</h2>
        <p>التخزين الصحيح للطعام ليس فقط يحافظ على نكهته وجودته لفترة أطول، بل يقلل أيضاً من الهدر ويوفر لك المال. في هذا المقال، سنشارك معك أفضل طرق تخزين الأطعمة المختلفة.</p>
        
        <h3>التخزين في الثلاجة</h3>
        <p>الثلاجة هي أفضل صديق لك في الحفاظ على الطعام طازجاً. لكن هل تعلم أن لكل نوع من الطعام مكاناً مثالياً في الثلاجة؟</p>
        
        <h4>الخضروات الورقية:</h4>
        <p>احفظها في أكياس بلاستيكية مثقبة أو في علب محكمة مع منشفة ورقية لامتصاص الرطوبة الزائدة. هذا يحافظ عليها طازجة لمدة أسبوع أو أكثر.</p>
        
        <h4>الفواكه:</h4>
        <p>معظم الفواكه تُحفظ في الدرج السفلي للثلاجة، لكن احذر من خلط بعض الفواكه مثل التفاح والموز مع الخضروات لأنها تطلق غاز الإيثيلين الذي يسرع النضج.</p>
        
        <h4>منتجات الألبان:</h4>
        <p>احفظها في الرف الأوسط أو العلوي حيث تكون درجة الحرارة ثابتة. تجنب وضعها في باب الثلاجة لأن درجة الحرارة هناك غير مستقرة.</p>
        
        <h4>اللحوم النيئة:</h4>
        <p>احفظها في الرف السفلي لمنع تسرب السوائل إلى الأطعمة الأخرى. استخدم علب محكمة الإغلاق وتأكد من طهيها خلال يومين أو ثلاثة.</p>
        
        <h3>التخزين في الفريزر</h3>
        <p>الفريزر يمدد عمر الطعام لشهور، لكن التخزين الصحيح ضروري:</p>
        
        <h4>اللحوم والدواجن:</h4>
        <p>قسّم اللحوم إلى حصص صغيرة قبل التجميد. استخدم أكياس محكمة الإغلاق واطرد الهواء منها. ضع ملصقاً بتاريخ التجميد لمعرفة متى يجب استخدامها.</p>
        
        <h4>الخضروات:</h4>
        <p>معظم الخضروات تحتاج إلى سلق سريع (blanching) قبل التجميد للحفاظ على لونها وقوامها. بعد السلق، ضعها في ماء مثلج ثم جففها قبل التجميد.</p>
        
        <h4>الخبز والمعجنات:</h4>
        <p>يمكن تجميد الخبز لمدة تصل إلى 3 أشهر. لف كل رغيف بورق الألمنيوم أو ضعه في كيس محكم. للاستخدام، أخرجه واتركه يذوب في درجة حرارة الغرفة.</p>
        
        <h3>التخزين في درجة حرارة الغرفة</h3>
        <p>بعض الأطعمة تُحفظ بشكل أفضل خارج الثلاجة:</p>
        
        <h4>الطماطم والبصل والثوم:</h4>
        <p>احفظها في مكان بارد وجاف وبعيداً عن ضوء الشمس المباشر. الطماطم تفقد نكهتها في الثلاجة.</p>
        
        <h4>البطاطس:</h4>
        <p>احفظها في مكان مظلم وبارد وجيد التهوية. تجنب تخزينها مع البصل لأن ذلك يسرع فسادها.</p>
        
        <h4>الموز:</h4>
        <p>يُحفظ في درجة حرارة الغرفة. إذا أردت إبطاء النضج، لف ساق الموز بورق الألمنيوم.</p>
        
        <h3>نصائح عامة لتخزين فعّال</h3>
        <p>• استخدم علب زجاجية شفافة لرؤية المحتويات بسهولة<br>
        • ضع الأطعمة الأقدم في المقدمة لاستخدامها أولاً<br>
        • تحقق بانتظام من تواريخ الصلاحية<br>
        • نظّف الثلاجة شهرياً لمنع نمو البكتيريا<br>
        • استخدم أكياس التفريغ الهوائي (vacuum bags) للتخزين طويل الأمد</p>
        
        <h3>علامات فساد الطعام</h3>
        <p>تخلص من الطعام إذا لاحظت:<br>
        • رائحة كريهة أو غير طبيعية<br>
        • تغير في اللون أو القوام<br>
        • وجود عفن أو بقع غريبة<br>
        • انتفاخ في العبوات المعلبة</p>
        
        <p><strong>خلاصة:</strong> التخزين الصحيح للطعام يوفر لك المال ويقلل الهدر ويضمن أن عائلتك تأكل طعاماً آمناً وطازجاً دائماً. طبق هذه النصائح اليوم واستمتع بطعام طازج لفترة أطول!</p>
      `,
      en: `
        <h2>Your Complete Guide to Proper Food Storage</h2>
        <p>Proper food storage not only maintains its flavor and quality for longer but also reduces waste and saves you money. In this article, we'll share the best methods for storing different types of food.</p>
        
        <h3>Refrigerator Storage</h3>
        <p>The refrigerator is your best friend in keeping food fresh. But did you know that each type of food has an ideal place in the fridge?</p>
        
        <h4>Leafy Vegetables:</h4>
        <p>Store them in perforated plastic bags or in airtight containers with a paper towel to absorb excess moisture. This keeps them fresh for a week or more.</p>
        
        <h4>Fruits:</h4>
        <p>Most fruits are stored in the bottom drawer of the fridge, but be careful not to mix some fruits like apples and bananas with vegetables as they release ethylene gas that speeds up ripening.</p>
        
        <h4>Dairy Products:</h4>
        <p>Store them on the middle or top shelf where the temperature is stable. Avoid placing them in the fridge door as the temperature there is unstable.</p>
        
        <h4>Raw Meats:</h4>
        <p>Store them on the bottom shelf to prevent liquids from dripping onto other foods. Use airtight containers and make sure to cook them within two or three days.</p>
        
        <h3>Freezer Storage</h3>
        <p>The freezer extends food life for months, but proper storage is essential:</p>
        
        <h4>Meats and Poultry:</h4>
        <p>Divide meat into small portions before freezing. Use airtight bags and remove air from them. Put a label with the freezing date to know when to use them.</p>
        
        <h4>Vegetables:</h4>
        <p>Most vegetables need quick blanching before freezing to maintain their color and texture. After blanching, place them in ice water then dry before freezing.</p>
        
        <h4>Bread and Pastries:</h4>
        <p>Bread can be frozen for up to 3 months. Wrap each loaf in aluminum foil or place it in an airtight bag. To use, remove and let it thaw at room temperature.</p>
        
        <h3>Room Temperature Storage</h3>
        <p>Some foods are better stored outside the fridge:</p>
        
        <h4>Tomatoes, Onions, and Garlic:</h4>
        <p>Store them in a cool, dry place away from direct sunlight. Tomatoes lose their flavor in the fridge.</p>
        
        <h4>Potatoes:</h4>
        <p>Store them in a dark, cool, well-ventilated place. Avoid storing them with onions as this speeds up spoilage.</p>
        
        <h4>Bananas:</h4>
        <p>Store at room temperature. If you want to slow ripening, wrap the banana stem in aluminum foil.</p>
        
        <h3>General Tips for Effective Storage</h3>
        <p>• Use transparent glass containers to easily see contents<br>
        • Place older foods in front to use them first<br>
        • Regularly check expiration dates<br>
        • Clean the fridge monthly to prevent bacterial growth<br>
        • Use vacuum bags for long-term storage</p>
        
        <h3>Signs of Food Spoilage</h3>
        <p>Discard food if you notice:<br>
        • Bad or unusual smell<br>
        • Change in color or texture<br>
        • Presence of mold or strange spots<br>
        • Bulging in canned packages</p>
        
        <p><strong>Conclusion:</strong> Proper food storage saves you money, reduces waste, and ensures your family eats safe and fresh food always. Apply these tips today and enjoy fresh food for longer!</p>
      `
    }
  }
};

// 👇 هذا هو التعديل الأساسي: تحديد نوع params بشكل صحيح
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  const post = blogPosts[params.slug as keyof typeof blogPosts];

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  if (!post) {
    return (
      <div className={styles.container}>
        <div className="text-center pt-32">
          <h1 className="text-2xl font-bold">
            {language === "ar" ? "المقال غير موجود" : "Post not found"}
          </h1>
          <Link
            href="/blog"
            className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium"
          >
            {language === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
          </Link>
        </div>
      </div>
    );
  }

  const ArrowIcon = language === "ar" ? FiArrowRight : FiArrowLeft;

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ""}`}>
      <article className={styles.article}>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
        >
          <ArrowIcon className="w-5 h-5" />
          {language === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
        </Link>

        <div className={`${styles.headerImage} ${styles.fadeIn} relative w-full h-80 sm:h-96 md:h-[500px] rounded-lg overflow-hidden mb-6`}>
          <Image
            src={post.image}
            alt={post.title[language]}
            fill
            priority
            className="object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title[language]}</h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            <FiUser className="w-5 h-5" />
            <span>{post.author[language]}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="w-5 h-5" />
            <span>{post.date[language]}</span>
          </div>
        </div>

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content[language] }}
        />
      </article>
    </div>
  );
}